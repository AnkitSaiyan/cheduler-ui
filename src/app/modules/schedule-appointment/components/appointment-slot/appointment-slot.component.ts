import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from 'src/app/core/services/auth.service';
import {DatePipe} from '@angular/common';
import {BehaviorSubject, debounceTime, filter, switchMap, takeUntil, tap} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {getDaysOfMonth, getWeekdayWiseDays, Weekday} from '../../../../shared/models/calendar.model.';
import {ScheduleAppointmentService} from '../../../../core/services/schedule-appointment.service';
import {DestroyableComponent} from '../../../../shared/components/destroyable/destroyable.component';
import {AppointmentSlot, ModifiedSlot, Slot, WorkStatusesEnum} from '../../../../shared/models/appointment.model';
import {ExamDetails, SlotDetails} from '../../../../shared/models/local-storage-data.model';

@Component({
  selector: 'dfm-appointment-slot',
  templateUrl: './appointment-slot.component.html',
  styleUrls: ['./appointment-slot.component.scss'],
})
export class AppointmentSlotComponent extends DestroyableComponent implements OnInit, OnDestroy {
  public selectedDate$$ = new BehaviorSubject<Date | null>(null);

  public appointmentSlots$$ = new BehaviorSubject<AppointmentSlot | null>(null);

  public selectedCalendarDate$$ = new BehaviorSubject<Date>(new Date());

  public weekdayEnum = Weekday;

  public daysInMonthMatrix: number[][] = [];

  public today: Date = new Date();

  public availableDays: number[] = [];

  public pastDays: number[] = [];

  public holidays: number[] = [];

  public offDays: number[] = [];

  public selectedTimeSlot: { [key: number]: any } = {};

  public editSelectedTimeSlot: { [key: number]: any } = {};

  public examsDetails: ExamDetails = {} as ExamDetails;

  public examIdToName: { [key: number]: { name: string; info: string; instructions: string } } = {};

  public examIdToAppointmentSlots: { [key: number]: ModifiedSlot[] } = {};

  public isSlotCombinable: boolean = false;

  public loadingSlots$$ = new BehaviorSubject(false);

  public editData: any;

  public isEdit$$ = new BehaviorSubject<boolean>(false);

  constructor(
    private authService: AuthService,
    private scheduleAppointmentSvc: ScheduleAppointmentService,
    private router: Router,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
  ) {
    super();
    if (localStorage.getItem('edit')) {
      this.isEdit$$.next(true);
    }
  }

  public ngOnInit() {
    if (localStorage.getItem('siteDetails')) {
      const siteData = JSON.parse(localStorage.getItem('siteDetails') || '');
      this.isSlotCombinable = siteData.data?.isSlotsCombinable;
    }

    if (localStorage.getItem('appointmentDetails')) {
      this.editData = JSON.parse(localStorage.getItem('appointmentDetails') || '');
      if (this.editData?.exam) {
        const exams = [...this.editData.exams];
        exams.forEach((exam) => {
          const start = this.dateTo24TimeString(exam?.startedAt);
          const end = this.dateTo24TimeString(exam?.endedAt);

          this.toggleSlotSelection(
            {
              start,
              end,
              examId: +exam.id,
              userList: exam.users,
              roomList: exam.rooms,
            } as ModifiedSlot,
            true,
          );
        });
      }
    }

    // this.scheduleAppointmentSvc.editDetails$$.pipe(takeUntil(this.destroy$$)).subscribe((examDetails) => {
    //   if (!this.editData) {
    //     if (examDetails?.isEdit) {
    //       this.scheduleAppointmentSvc
    //         .getAppointmentByID$(examDetails.id)
    //         .pipe(takeUntil(this.destroy$$))
    //         .subscribe((appointment) => {
    //           this.editData = appointment;
    //           const exams: ExamDetails = {
    //             exams: this.editData.exams.map((exam) => exam.id),
    //             physician: this.editData.physicianId,
    //             comments: this.editData.comments,
    //           };
    //           this.scheduleAppointmentSvc.setExamDetails(exams);
    //           // this.scheduleAppointmentSvc.editData$$.next(appointment);
    //           this.editData = localStorage.setItem('appointmentDetails', JSON.stringify(appointment));
    //         });
    //     }
    //   }
    // });

    this.scheduleAppointmentSvc.examDetails$.pipe(takeUntil(this.destroy$$)).subscribe((examDetails) => {
      this.examsDetails = examDetails;
    });

    this.scheduleAppointmentSvc.slotDetails$.pipe(takeUntil(this.destroy$$)).subscribe((slotDetails) => {
      if (slotDetails?.selectedDate) {
        const date = new Date(slotDetails.selectedDate);
        this.selectedDate$$.next(date);
        this.selectedCalendarDate$$.next(date);
      }

      if (slotDetails?.selectedSlots) {
        this.selectedTimeSlot = { ...slotDetails.selectedSlots };
      }

      this.updateCalendarDays();
    });

    this.scheduleAppointmentSvc.exams$.pipe(takeUntil(this.destroy$$)).subscribe((exams) =>
      exams.forEach((exam) => {
        this.examIdToName[+exam.id] = { name: exam.name, info: exam.info, instructions: exam.instructions ?? '' };
      }),
    );

    this.selectedCalendarDate$$
      .asObservable()
      .pipe(
        debounceTime(0),
        filter((date) => !!date),
        tap(() => this.resetCalendarData()),
        switchMap((date) => {
          const fromDate = `${date.getFullYear()}-${date.getMonth() + 1}-01`;
          const toDate = `${date.getFullYear()}-${date.getMonth() + 1}-${this.getLastDayOfMonth(date)}`;
          const { exams } = this.examsDetails;
          return this.scheduleAppointmentSvc.getCalendarDays$({ fromDate, toDate, exams });
        }),
      )
      .subscribe((appointmentSlot) => {
        appointmentSlot.forEach((slot) => {
          const day = +slot.start.slice(-2);

          switch (slot.workStatus) {
            case WorkStatusesEnum.Holiday:
              this.holidays.push(day);
              break;
            case WorkStatusesEnum.Working:
              this.availableDays.push(day);
              break;
            case WorkStatusesEnum.Off:
              this.offDays.push(day);
              break;
            case WorkStatusesEnum.Past:
              this.pastDays.push(day);
              break;
            default:
          }
        });
        if (this.editData?.exams?.length) {
          this.selectDate(new Date(this.editData.exams[0].startedAt).getDate(), true);
        }
      });


    this.selectedDate$$
      .pipe(
        debounceTime(0),
        filter((date) => {
          return this.isDateValid(date);
        }),
        tap(() => this.loadingSlots$$.next(true)),
        switchMap((date) => {
          const dateString = this.getDateString(date);
          this.resetSlots();
          if (this.editData?.exams) {
            return this.scheduleAppointmentSvc.getSlots$({
              date: dateString,
              exams: this.editData.exams.map((exam) => exam.id),
            });
          }
          return this.scheduleAppointmentSvc.getSlots$({
            date: dateString,
            exams: [...this.examsDetails.exams],
          });
        }),
        takeUntil(this.destroy$$),
      )
      .subscribe({
        next: (appointmentSlot) => {
          this.appointmentSlots$$.next(appointmentSlot);
          this.examIdToAppointmentSlots = {};

          const { examIdToSlots } = this.getModifiedSlotData(appointmentSlot?.slots, appointmentSlot?.isCombined);
          this.examIdToAppointmentSlots = { ...examIdToSlots };
          Object.keys(this.examIdToAppointmentSlots).forEach((id) => {
            this.sortArrayObject(this.examIdToAppointmentSlots[id], 'start');
          });

          // appointmentSlot?.slots?.forEach((slot: any) => {
          //   if (!this.examIdToAppointmentSlots[slot.examId]) {
          //     this.examIdToAppointmentSlots[slot.examId] = [];
          //   }
          //   if (appointmentSlot.isCombined) {
          //     slot.exams.forEach((exam) => {
          //       const tempSlot: any = {
          //         end: slot.end,
          //         start: slot.start,
          //         exams: slot.exams,
          //         examId: exam.examId,
          //         roomList: exam.rooms,
          //         userList: exam.users,
          //       };
          //       this.examIdToAppointmentSlots[slot.examId].push(tempSlot);
          //     });
          //   } else {
          //     slot.exams.forEach((exam) => {
          //       const tempSlot: any = {
          //         end: exam.end,
          //         start: exam.start,
          //         examId: exam.examId,
          //         roomList: exam.rooms,
          //         userList: exam.users,
          //       };
          //       this.examIdToAppointmentSlots[slot.examId].push(tempSlot);
          //     });
          //   }
          // });
          this.loadingSlots$$.next(false);
        },
        error: () => this.loadingSlots$$.next(false),
      });
  }

  public override ngOnDestroy() {
    super.ngOnDestroy();
  }

  public changeMonth(offset: number) {
    const year = this.selectedCalendarDate$$.value.getFullYear();
    const month = this.selectedCalendarDate$$.value.getMonth();

    // checking if prev or next month has today's date
    if (getDaysOfMonth(year, month + offset) < this.selectedCalendarDate$$.value.getDate()) {
      this.selectedCalendarDate$$.value.setDate(1);
    }

    this.selectedCalendarDate$$.value.setMonth(this.selectedCalendarDate$$.value.getMonth() + offset);

    // if selected month is today's month then selected today's date by default
    if (this.selectedCalendarDate$$.value.getMonth() === new Date().getMonth()) {
      // eslint-disable-next-line no-new
      new Date(this.selectedCalendarDate$$.value.setDate(new Date().getDate()));
    }

    this.selectedCalendarDate$$.next(new Date(this.selectedCalendarDate$$.value));

    this.updateCalendarDays();

    this.selectedTimeSlot = [];
  }

  public toggleSlotSelection(slot: ModifiedSlot, isEdit: boolean = false) {

    if (!this.isSlotAvailable(slot) && !isEdit) {
      return;
    }
    if (this.selectedTimeSlot[slot.examId]?.slot === `${slot.start}-${slot.end}`) {
      this.selectedTimeSlot[slot.examId] = { slot: '', roomList: [], userList: [], examId: slot.examId };
    } else {
      this.selectedTimeSlot[slot.examId] = {
        ...slot,
        slot: `${slot.start}-${slot.end}`,
        examId: slot.examId,
        roomList: slot?.roomList ?? [],
        userList: slot?.userList ?? [],
      };
    }
    if (isEdit) {
      if (this.editSelectedTimeSlot[slot.examId]?.slot === `${slot.start}-${slot.end}`) {
        this.editSelectedTimeSlot[slot.examId] = { slot: '', roomList: [], userList: [], examId: slot.examId };
      } else {
        this.editSelectedTimeSlot[slot.examId] = {
          ...slot,
          slot: `${slot.start}-${slot.end}`,
          examId: slot.examId,
          roomList: slot?.roomList ?? [],
          userList: slot?.userList ?? [],
        };
      }
    }

  }

  public toggleSlotSelectionCombinable(slot: ModifiedSlot) {
    if (!this.isSlotAvailable(slot)) {
      return;
    }
    if (this.selectedTimeSlot[slot.examId]?.slot === `${slot.start}-${slot.end}`) {
      delete this.selectedTimeSlot[slot.examId];
    } else {
      this.selectedTimeSlot[slot.examId] = {
        ...slot,
        slot: `${slot.start}-${slot.end}`,
        examId: slot.examId,
        roomList: slot?.roomList ?? [],
        userList: slot?.userList ?? [],
      };
    }
  }

  public selectDate(day: number, isEdit: boolean = false) {
    if (Number.isNaN(day)) {
      this.selectedDate$$.next(new Date());
    } else {
      this.selectedDate$$.next(new Date(this.selectedCalendarDate$$.value.getFullYear(), this.selectedCalendarDate$$.value.getMonth(), day));
    }
    if (!isEdit) this.selectedTimeSlot = {};
  }

  public saveSlotDetails() {
    Object.keys(this.editSelectedTimeSlot).forEach((id) => {
      if (!this.selectedTimeSlot[id]) {
        this.selectedTimeSlot[id] = { ...this.editSelectedTimeSlot[id] };
      }
    });
    const slotDetails = {
      selectedDate: this.selectedDate$$.value,
      selectedSlots: this.selectedTimeSlot,
    } as SlotDetails;

    // for (let i = 0; i < this.editData.exams.length; i++) {
    //   // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    //   this.editData.exmas[i].startedAt = this.selectedDate$$.value + ' ';
    // }

    this.scheduleAppointmentSvc.setSlotDetails(slotDetails);
    this.router.navigate(['../basic-details'], { relativeTo: this.route, replaceUrl: true });
  }

  public getDateString(date: Date | null, format = 'yyyy-MM-dd'): string {
    return this.datePipe.transform(date, format) ?? '';
  }

  public isFormValid(): boolean {
    if (this.isSlotCombinable) {
      return !!Object.values(this.selectedTimeSlot)?.length && Object.values(this.selectedTimeSlot).every((value) => value?.slot?.length);
    }
    return (
      Object.values(this.selectedTimeSlot).every((value) => value?.slot?.length) &&
      Object.values(this.selectedTimeSlot).length === this.examsDetails?.exams?.length
    );
  }

  public isSlotAvailable(slot: ModifiedSlot) {
    return !Object.values(this.selectedTimeSlot)?.some((value) => {
      const firstSlot = value.slot.split('-');
      return slot.examId !== value.examId && this.checkTimeRangeOverlapping(firstSlot[0], firstSlot[1], slot.start, slot.end);
    });
  }

  private dateTo24TimeString(date: Date): string {
    if (!date) {
      return '';
    }

    const newDate = new Date(date);

    const minutes = newDate.getMinutes().toString();

    return `${newDate.getHours()}:${minutes.length < 2 ? `0${minutes}` : minutes}:00`;
  }

  private updateCalendarDays() {
    this.daysInMonthMatrix = getWeekdayWiseDays(this.selectedCalendarDate$$.value);
  }

  private getModifiedSlotData(
    slots: Slot[],
    isCombinable: boolean,
  ): {
    newSlots: any[];
    examIdToSlots: {
      [key: number]: any[];
    };
  } {
    if (!slots?.length) {
      return { examIdToSlots: {}, newSlots: [] };
    }

    const newSlots: any[] = [];
    const examIdToSlotsMap: { [key: number]: any[] } = {};

    slots.forEach((slot) => {
      const uniqueSlots = new Set<string>();

      slot?.exams?.forEach((exam: any) => {
        const slotString = isCombinable ? `${slot.start}-${slot.end}` : `${exam.start}-${exam.end}`;

        if (!uniqueSlots.has(slotString + exam.examId)) {
          const newSlot = {
            examId: exam.examId,
            roomList: exam.rooms,
            userList: exam.users,
            ...(isCombinable
              ? {
                  start: slot.start,
                  end: slot.end,
                  exams: slot.exams,
                }
              : {
                  start: exam.start,
                  end: exam.end,
                }),
          };

          if (!examIdToSlotsMap[+exam.examId]) {
            examIdToSlotsMap[+exam.examId] = [];
          }

          examIdToSlotsMap[+exam.examId].push(newSlot);
          newSlots.push(newSlot);
          uniqueSlots.add(slotString + exam.examId);
        }
      });
    });

    return { newSlots, examIdToSlots: examIdToSlotsMap };
  }

  private checkTimeRangeOverlapping(start1: string, end1: string, start2: string, end2: string): boolean {
    // debugger
    const a = this.timeToNumber(start1);
    const b = this.timeToNumber(end1);

    const c = this.timeToNumber(start2);
    const d = this.timeToNumber(end2);

    return !(b <= c || d <= a);
  }

  private timeToNumber(timeString: string): number {
    if (timeString && timeString.includes(':')) {
      const timeInNo = +timeString.split(':').join('');

      if (!Number.isNaN(timeInNo)) {
        return timeInNo;
      }
    }

    return 0;
  }

  private getLastDayOfMonth(date: Date): number {
    return new Date(new Date(new Date(date).setMonth(date.getMonth() + 1)).setDate(0)).getDate();
  }

  private resetCalendarData() {
    this.availableDays = [];
    this.offDays = [];
    this.holidays = [];
    this.pastDays = [];
    this.selectedTimeSlot = {};
    this.examIdToAppointmentSlots = {};
  }

  private resetSlots() {
    this.selectedTimeSlot = {};
    this.examIdToAppointmentSlots = {};
    this.appointmentSlots$$.next(null);
  }

  private isDateValid(d: any): boolean {
    return Object.prototype.toString.call(d) === '[object Date]' && !Number.isNaN(d);
  }

  public isNextButtonDisable(): boolean {
    return !this.editData?.exams?.every((exam) => exam?.startedAt?.length);
  }

  sortArrayObject(arr: any, key: string): Array<any> {
    return arr.sort((a, b) => (a[key] > b[key] ? 1 : b[key] > a[key] ? -1 : 0));
  }
}
