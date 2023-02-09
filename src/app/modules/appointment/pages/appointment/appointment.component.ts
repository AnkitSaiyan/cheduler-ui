import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ScheduleAppointmentService } from 'src/app/core/services/schedule-appointment.service';
import { DestroyableComponent } from 'src/app/shared/components/destroyable/destroyable.component';

@Component({
  selector: 'dfm-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.scss']
})
export class AppointmentComponent extends DestroyableComponent implements OnInit, OnDestroy {
  viewAll: boolean = false

  private appointments$$: BehaviorSubject<any[]>;

  public filteredAppointments$$: BehaviorSubject<any[]>;

  private completedAppointments$$: BehaviorSubject<any[]>;

  public filteredCompletedAppointments$$: BehaviorSubject<any[]>;

  constructor(private scheduleAppointmentService: ScheduleAppointmentService) {
    super();
    this.appointments$$ = new BehaviorSubject<any[]>([]);
    this.filteredAppointments$$ = new BehaviorSubject<any[]>([]);
    this.completedAppointments$$ = new BehaviorSubject<any[]>([]);
    this.filteredCompletedAppointments$$ = new BehaviorSubject<any[]>([]);
   }

  ngOnInit(): void {
    this.scheduleAppointmentService.upcommingAppointment$.pipe(takeUntil(this.destroy$$)).subscribe((appointments) => {
      console.log('appointments upcomming: ', appointments);
      this.appointments$$.next(appointments);
      this.filteredAppointments$$.next(appointments);
    });


    this.scheduleAppointmentService.completedAppointment$.pipe(takeUntil(this.destroy$$)).subscribe((completedAppointments) => {
      console.log('completed: ', completedAppointments);
      this.completedAppointments$$.next(completedAppointments);
      this.filteredCompletedAppointments$$.next(completedAppointments);
    });
  }

}
