import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from 'src/app/core/services/auth.service';
import {getDaysOfMonth, getWeekdayWiseDays, Weekday} from "../../../../shared/models/calendar.model.";
import {ScheduleAppointmentService} from "../../../../core/services/schedule-appointment.service";
import {DestroyableComponent} from "../../../../shared/components/destroyable/destroyable.component";
import {BehaviorSubject, takeUntil} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'dfm-appointment-slot',
  templateUrl: './appointment-slot.component.html',
  styleUrls: ['./appointment-slot.component.scss'],
})
export class AppointmentSlotComponent extends DestroyableComponent implements OnInit, OnDestroy {
  public weekdayEnum = Weekday;

  public daysInMonthMatrix: number[][] = [];

  public selectedDate!: Date;

  public selectedCalendarDate: Date = new Date();

  public today: Date = new Date();

  public availableDays = [17, 18, 19, 20, 21, 26, 27];

  public holidays = [8, 22];


  public selectedTimeSlot: any[] = [];

  public exams: any[] = [];

  private timeSlots$$: BehaviorSubject<any[]>;

  public filteredSlots$$: BehaviorSubject<any[]>;

  constructor(
    private authService: AuthService,
    private scheduleAppointmentSvc: ScheduleAppointmentService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    super();
    this.timeSlots$$ = new BehaviorSubject<any[]>([]);
    this.filteredSlots$$ = new BehaviorSubject<any[]>([]);
  }

  public ngOnInit(): void {
    this.scheduleAppointmentSvc.slotDetails$.subscribe((slotDetails) => {
      if (slotDetails?.date) {
        this.selectedCalendarDate = new Date(slotDetails.date);
        this.updateCalendarDays();
        this.selectedDate = new Date(slotDetails.date);
      } else {
        this.updateCalendarDays();
      }
      this.timeSlots$$.next(slotDetails);
      this.filteredSlots$$.next(slotDetails);
    });

    this.scheduleAppointmentSvc.examDetails$.pipe(takeUntil(this.destroy$$)).subscribe((examDetails) => {
      if (examDetails?.exams) {
        this.exams = examDetails.exams;
      } else {
        this.exams.push({exam: 'Aanpasing steunzolen', id: 1});
      }
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

  public selectSlot(slot, id) {
    const index = this.selectedTimeSlot.findIndex((timeSlot) => +timeSlot.id === +id);
    if (index !== -1) {
      this.selectedTimeSlot.splice(index, 1, {slot, examId: id});
    } else {
      this.selectedTimeSlot.push({slot, examId: id});
    }

    console.log(this.selectedTimeSlot)
  }

  public selectDate(day: number) {
    this.selectedDate = new Date(this.selectedCalendarDate.getFullYear(), this.selectedCalendarDate.getMonth(), day);
  }

  public saveSlotDetails() {
    if (!this.selectedTimeSlot.length || !this.selectedDate) {
      return;
    }

    const reqData = {
      date: this.selectedDate,
      slots: [...this.selectedTimeSlot]
    }

    this.scheduleAppointmentSvc.setSlotDetails(reqData);
    this.router.navigate(['../basic-details'], {relativeTo: this.route});
  }

  public isSlotSelected(slot: string, id: number): boolean {
    return !!this.selectedTimeSlot.find((timeSlot) => timeSlot?.slot === slot && +timeSlot?.examId === +id);
  }
}
