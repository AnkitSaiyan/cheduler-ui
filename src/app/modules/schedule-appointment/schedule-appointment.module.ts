import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverviewComponent } from './components/overview/overview.component';
import { BasicDetailComponent } from './components/basic-detail/basic-detail.component';
import { ExamDetailComponent } from './components/exam-detail/exam-detail.component';
import { AppointmentTimeDetailComponent } from './components/appointment-time-detail/appointment-time-detail.component';
import { ConfirmAppointmentComponent } from './components/confirm-appointment/confirm-appointment.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ScheduleAppointmentRoutingModule } from './schedule-appointment-routing.module';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
  
    OverviewComponent,
       BasicDetailComponent,
       ExamDetailComponent,
       AppointmentTimeDetailComponent,
       ConfirmAppointmentComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    ScheduleAppointmentRoutingModule,
    RouterModule
  ]
})
export class ScheduleAppointmentModule { }
