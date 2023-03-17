import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { ScheduleAppointmentService } from 'src/app/core/services/schedule-appointment.service';
import { DestroyableComponent } from 'src/app/shared/components/destroyable/destroyable.component';

@Component({
  selector: 'dfm-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.scss'],
})
export class AppointmentComponent extends DestroyableComponent implements OnInit, OnDestroy {
  viewAll: boolean = false;

  public isAppointemntScheduled: boolean = true;

  public isLoggedIn$!: Observable<boolean>;

  private appointments$$: BehaviorSubject<any[]>;

  public filteredAppointments$$: BehaviorSubject<any[]>;

  private completedAppointments$$: BehaviorSubject<any[]>;

  public filteredCompletedAppointments$$: BehaviorSubject<any[]>;

  monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  constructor(private scheduleAppointmentService: ScheduleAppointmentService, private authSvc: AuthService) {
    super();
    this.appointments$$ = new BehaviorSubject<any[]>([]);
    this.filteredAppointments$$ = new BehaviorSubject<any[]>([]);
    this.completedAppointments$$ = new BehaviorSubject<any[]>([]);
    this.filteredCompletedAppointments$$ = new BehaviorSubject<any[]>([]);
  }

  ngOnInit(): void {
    this.isLoggedIn$ = this.authSvc.isLoggedIn$;
    this.scheduleAppointmentService.upcommingAppointment$.pipe(takeUntil(this.destroy$$)).subscribe((appointments) => {
      if (!appointments['0']) {
        this.isAppointemntScheduled = false;
        return;
      }
      this.isAppointemntScheduled = true;
      console.log('Upcoming: ', appointments);
      this.appointments$$.next(appointments);
      this.filteredAppointments$$.next(appointments);
    });

    this.scheduleAppointmentService.completedAppointment$.pipe(takeUntil(this.destroy$$)).subscribe((completedAppointments) => {
      if (!completedAppointments['0']) {
        this.isAppointemntScheduled = false;
        return;
      }
      this.isAppointemntScheduled = true;
      console.log('completed: ', completedAppointments);
      this.completedAppointments$$.next(completedAppointments);
      this.filteredCompletedAppointments$$.next(completedAppointments);
    });
  }

  monthName(date) {
    const d = new Date(date);
    return this.monthNames[d.getMonth()];
  }
}
