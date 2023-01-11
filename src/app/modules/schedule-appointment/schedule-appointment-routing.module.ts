import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppointmentTimeDetailComponent } from './components/appointment-time-detail/appointment-time-detail.component';
import { BasicDetailComponent } from './components/basic-detail/basic-detail.component';
import { ConfirmAppointmentComponent } from './components/confirm-appointment/confirm-appointment.component';
import { ExamDetailComponent } from './components/exam-detail/exam-detail.component';
import { OverviewComponent } from './components/overview/overview.component';

const scheduleAppointmentRoutes: Routes = [
  {
    path: 'overview',
    component: OverviewComponent
  },
  {
    path: 'basic',
    component: BasicDetailComponent
  },
  {
    path: 'exam',
    component: ExamDetailComponent
  },
  {
    path: 'date-time',
    component: AppointmentTimeDetailComponent
  },
  {
    path: 'confirm-appointment',
    component: ConfirmAppointmentComponent
  },

];

@NgModule({
  imports: [RouterModule.forChild(scheduleAppointmentRoutes)],
  exports: [RouterModule]
})
export class ScheduleAppointmentRoutingModule { }
