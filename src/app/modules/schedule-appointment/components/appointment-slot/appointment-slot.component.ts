import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from 'src/app/core/services/auth.service';
import {getDaysOfMonth, getWeekdayWiseDays, Weekday} from "../../../../shared/models/calendar.model.";
import {ScheduleAppointmentService} from "../../../../core/services/schedule-appointment.service";
import {DestroyableComponent} from "../../../../shared/components/destroyable/destroyable.component";
import {BehaviorSubject, debounceTime, filter, switchMap, take, takeUntil} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {DatePipe} from "@angular/common";
import {AppointmentSlot, Slot} from "../../../../shared/models/appointment.model";

@Component({
  selector: 'dfm-appointment-slot',
  templateUrl: './appointment-slot.component.html',
  styleUrls: ['./appointment-slot.component.scss'],
})
export class AppointmentSlotComponent extends DestroyableComponent implements OnInit, OnDestroy {
  public weekdayEnum = Weekday;

  public daysInMonthMatrix: number[][] = [];

  public selectedDate$$ = new BehaviorSubject<Date | null>(null);

  public selectedCalendarDate: Date = new Date();

  public today: Date = new Date();

  public availableDays = [17, 18, 19, 20, 21, 26, 27];

  public holidays = [8, 22];

  public selectedTimeSlot: { [key: number]: string } = {};

  public examsDetails: any = {};

  public examIdToName: { [key: number]: { name: string; info: string } } = {};

  public examIdToAppointmentSlots: { [key: number]: Slot[] } = {};

  public appointmentSlots$$ = new BehaviorSubject<AppointmentSlot | null>(null);

  constructor(
    private authService: AuthService,
    private scheduleAppointmentSvc: ScheduleAppointmentService,
    private router: Router,
    private route: ActivatedRoute,
    private datePipe: DatePipe
  ) {
    super();
  }

  public ngOnInit(): void {
    this.scheduleAppointmentSvc.slotDetails$.pipe(takeUntil(this.destroy$$)).subscribe((slotDetails) => {
      console.log(slotDetails);

      if (slotDetails?.selectedDate) {
        const date = new Date(slotDetails.selectedDate);
        this.selectedDate$$.next(date);
        this.selectedCalendarDate = date;
      }

      if (slotDetails?.selectedSlots) {
        console.log('in', slotDetails.selectedSlots)
        this.selectedTimeSlot = {...slotDetails.selectedSlots};
      }

      this.updateCalendarDays();
    });

    this.scheduleAppointmentSvc.examDetails$.pipe(takeUntil(this.destroy$$)).subscribe((examDetails) => {
      this.examsDetails = examDetails;
    });

    this.scheduleAppointmentSvc.exams$
      .pipe(takeUntil(this.destroy$$))
      .subscribe((exams) => exams.forEach((exam) => {
        this.examIdToName[+exam.id] = {name: exam.name, info: exam.info};
      }));

    // this.scheduleAppointmentSvc.slotDetails$.subscribe((slotDetails) => {
    //   if (slotDetails?.date) {
    //     this.selectedCalendarDate = new Date(slotDetails.date);
    //     this.updateCalendarDays();
    //     this.selectedDate$$ = new Date(slotDetails.date);
    //   } else {
    //     this.updateCalendarDays();
    //   }
    //   this.timeSlots$$.next(slotDetails);
    //   this.filteredSlots$$.next(slotDetails);
    // });

    this.selectedDate$$.asObservable().pipe(debounceTime(0), filter((date) => !!date), switchMap((date) => {
      const dateString = this.getDateString(date);
      return this.scheduleAppointmentSvc.getSlots$({
        fromDate: dateString, toDate: dateString, exams: [...this.examsDetails.exams]
      })
    }), takeUntil(this.destroy$$)).subscribe((appointmentSlot) => {
      this.appointmentSlots$$.next(appointmentSlot);
      this.examIdToAppointmentSlots = {};

      appointmentSlot.slots.forEach((slot) => {
        if (!this.examIdToAppointmentSlots[slot.examId]) {
          this.examIdToAppointmentSlots[slot.examId] = [];
        }

        this.examIdToAppointmentSlots[slot.examId].push(slot);
      });
    });
  }

  public override ngOnDestroy() {
    super.ngOnDestroy();
  }

  public changeMonth(offset: number) {
    const year = this.selectedCalendarDate.getFullYear();
    const month = this.selectedCalendarDate.getMonth();

    // checking if prev or next month has today's date
    if (getDaysOfMonth(year, month + offset) < this.selectedCalendarDate.getDate()) {
      this.selectedCalendarDate.setDate(1);
    }

    this.selectedCalendarDate.setMonth(this.selectedCalendarDate.getMonth() + offset);

    // if selected month is today's month then selected today's date by default
    if (this.selectedCalendarDate.getMonth() === new Date().getMonth()) {
      new Date(this.selectedCalendarDate.setDate(new Date().getDate()));
    }

    this.selectedCalendarDate = new Date(this.selectedCalendarDate);

    this.updateCalendarDays();

    this.selectedTimeSlot = [];
  }

  private updateCalendarDays() {
    this.daysInMonthMatrix = getWeekdayWiseDays(this.selectedCalendarDate);
  }

  public toggleSlotSelection(slot: Slot) {
    if (!this.isSlotAvailable(slot)) {
      return;
    }

    if (this.selectedTimeSlot[slot.examId] === slot.start + '-' + slot.end) {
      this.selectedTimeSlot[slot.examId] = ''
    } else {
      this.selectedTimeSlot[slot.examId] = slot.start + '-' + slot.end;
    }
  }

  public selectDate(day: number) {
    this.selectedDate$$.next(new Date(this.selectedCalendarDate.getFullYear(), this.selectedCalendarDate.getMonth(), day));
    this.selectedTimeSlot = {};
  }

  public saveSlotDetails() {
    const slotDetails = {
      selectedDate: this.selectedDate$$.value,
      selectedSlots: this.selectedTimeSlot,

    };

    this.scheduleAppointmentSvc.setSlotDetails(slotDetails);
    this.router.navigate(['../basic-details'], {relativeTo: this.route});
  }

  public getDateString(date: Date | null, format = 'yyyy-MM-dd'): string {
    return this.datePipe.transform(date, format) ?? '';
  }

  public isFormValid(): boolean {
    return Object.values(this.selectedTimeSlot).every((value) => value) && Object.values(this.selectedTimeSlot).length === this.examsDetails?.exams?.length
  }

  public isSlotAvailable(slot: any) {
    let isAvailable = true;

    console.log(this.selectedTimeSlot);
    Object.entries(this.selectedTimeSlot).forEach(([key, value]) => {
      const timeString = slot.start + '-' + slot.end;
      if (+key !== +slot.examId && timeString === value) {
        isAvailable = false;
      }
    });

    return isAvailable;
  }
}
