import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { getDaysOfMonth, getWeekdayWiseDays, Weekday } from '../../../../shared/models/calendar.model.';
import { ScheduleAppointmentService } from '../../../../core/services/schedule-appointment.service';
import { DestroyableComponent } from '../../../../shared/components/destroyable/destroyable.component';
import { BehaviorSubject, debounceTime, filter, switchMap, takeUntil, tap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { AppointmentSlot, ModifiedSlot, Slot, WorkStatusesEnum } from '../../../../shared/models/appointment.model';
import { ExamDetails, SlotDetails } from '../../../../shared/models/local-storage-data.model';

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

  public examsDetails: ExamDetails = {} as ExamDetails;

  public examIdToName: { [key: number]: { name: string; info: string } } = {};

  public examIdToAppointmentSlots: { [key: number]: ModifiedSlot[] } = {};

  public isSlotCombinable: boolean = false;

  public loadingSlots$$ = new BehaviorSubject(false);

  constructor(
    private authService: AuthService,
    private scheduleAppointmentSvc: ScheduleAppointmentService,
    private router: Router,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
  ) {
    super();
  }

  public ngOnInit(): void {
    this.getCalendarSlots();
    const siteData = JSON.parse(localStorage.getItem('siteDetails') || '');
    this.isSlotCombinable = siteData['data']['isSlotsCombinable'];
    console.log(this.isSlotCombinable);

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
        console.log('in', slotDetails.selectedSlots);
        this.selectedTimeSlot = { ...slotDetails.selectedSlots };
      }

      this.updateCalendarDays();
    });

    this.scheduleAppointmentSvc.exams$.pipe(takeUntil(this.destroy$$)).subscribe((exams) =>
      exams.forEach((exam) => {
        this.examIdToName[+exam.id] = { name: exam.name, info: exam.info };
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
          return this.scheduleAppointmentSvc.getSlots$({ fromDate, toDate, exams });
        }),
      )
      .subscribe((appointmentSlot) => {
        appointmentSlot.forEach((appointmentSlot) => {
          const day = +appointmentSlot.start.slice(-2);
          switch (appointmentSlot.workStatus) {
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
          }
        });
      });

    this.selectedDate$$
      .asObservable()
      .pipe(
        debounceTime(0),
        filter((date) => !!date),
        tap(() => this.loadingSlots$$.next(true)),
        switchMap((date) => {
          const dateString = this.getDateString(date);
          return this.scheduleAppointmentSvc.getSlots$({
            fromDate: dateString,
            toDate: dateString,
            exams: [...this.examsDetails.exams],
          });
        }),
        takeUntil(this.destroy$$),
      )
      .subscribe({
        next: (appointmentSlot) => {
          console.log(appointmentSlot);
          this.appointmentSlots$$.next(appointmentSlot[0]);
          this.examIdToAppointmentSlots = {};

          appointmentSlot[0]?.slots?.forEach((slot) => {
            slot['exams'].forEach((element) => {
              let index = slot['exams'].findIndex((x) => x.examId === element.examId);

              if (!this.examIdToAppointmentSlots[element.examId]) {
                this.examIdToAppointmentSlots[element.examId] = [];
              }
              const tempSlot: ModifiedSlot = {
                end: slot.end,
                start: slot.start,
                examId: slot.exams[index].examId,
                roomList: slot.exams[index].roomId,
                userList: slot.exams[index].userId,
                exams: [],
              };
              this.examIdToAppointmentSlots[element.examId].push(tempSlot);
            });
          });
          console.log(this.examIdToAppointmentSlots);
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

  private updateCalendarDays() {
    this.daysInMonthMatrix = getWeekdayWiseDays(this.selectedCalendarDate$$.value);
  }

  public toggleSlotSelection(slot: ModifiedSlot) {
    console.log(slot);
    if (!this.isSlotAvailable(slot)) {
      return;
    }
    if (this.selectedTimeSlot[slot.examId]?.slot === `${slot.start}-${slot.end}`) {
      this.selectedTimeSlot[slot.examId] = { slot: '', roomList: [], userList: [], examId: slot.examId };
    } else {
      this.selectedTimeSlot[slot.examId] = {
        slot: `${slot.start}-${slot.end}`,
        examId: slot.examId,
        roomList: slot?.roomList ?? [],
        userList: slot?.userList ?? [],
      };
    }
    console.log(this.selectedTimeSlot);
  }

  public toggleSlotSelectionCombinable(slot: ModifiedSlot) {
    console.log(this.selectedTimeSlot);
    console.log(slot);
    Object.keys(this.examIdToAppointmentSlots).forEach((res) => {
      if (this.selectedTimeSlot[res]?.slot === `${this.examIdToAppointmentSlots[res].start}-${this.examIdToAppointmentSlots[res].end}`) {
        console.log('in')
        this.selectedTimeSlot[res] = { slot: '', roomList: [], userList: [], examId: res };
      } else {
        let index = this.examIdToAppointmentSlots[res].findIndex(x => x.start === slot.start && x.end === slot.end);
        this.selectedTimeSlot[res] = {
          slot: `${this.examIdToAppointmentSlots[res][index].start}-${this.examIdToAppointmentSlots[res][index].end}`,
          examId: res,
          roomList: this.examIdToAppointmentSlots[res][index]?.roomList ?? [],
          userList: this.examIdToAppointmentSlots[res][index]?.userList ?? [],
        };
      }
    });
  }

  public selectDate(day: number) {
    this.selectedDate$$.next(new Date(this.selectedCalendarDate$$.value.getFullYear(), this.selectedCalendarDate$$.value.getMonth(), day));
    this.selectedTimeSlot = {};
  }

  public saveSlotDetails() {
    const slotDetails = {
      selectedDate: this.selectedDate$$.value,
      selectedSlots: this.selectedTimeSlot,
    } as SlotDetails;

    this.scheduleAppointmentSvc.setSlotDetails(slotDetails);
    this.router.navigate(['../basic-details'], { relativeTo: this.route });
  }

  public getDateString(date: Date | null, format = 'yyyy-MM-dd'): string {
    return this.datePipe.transform(date, format) ?? '';
  }

  public isFormValid(): boolean {
    if (this.isSlotCombinable) {
      return !!Object.values(this.selectedTimeSlot).length;
    }
    return (
      Object.values(this.selectedTimeSlot).every((value) => value) && Object.values(this.selectedTimeSlot).length === this.examsDetails?.exams?.length
    );
  }

  public isSlotAvailable(slot: ModifiedSlot) {
    let isAvailable = true;
    Object.entries(this.selectedTimeSlot).forEach(([key, value]) => {
      const timeString = `${slot.start}-${slot.end}`;
      if (+key !== slot.examId && timeString === value.slot) {
        isAvailable = false;
      }
    });

    return isAvailable;
  }

  private getCalendarSlots() {
    const year = this.selectedDate$$.value?.getFullYear();
    const month = this.selectedDate$$.value?.getMonth();
    // const fromDate = new Date(, this.selectedDate$$.value?.getDate())
    // this.scheduleAppointmentSvc.getSlots$()
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
}
