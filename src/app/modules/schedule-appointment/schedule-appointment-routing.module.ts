import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppointmentSlotComponent } from './components/appointment-slot/appointment-slot.component';
import { BasicDetailComponent } from './components/basic-detail/basic-detail.component';
import { ConfirmAppointmentComponent } from './components/confirm-appointment/confirm-appointment.component';
import { ExamDetailComponent } from './components/exam-detail/exam-detail.component';
import { OverviewComponent } from './components/overview/overview.component';
import { ReferralPhysicianComponent } from './components/referral-physician/referral-physician.component';
import { ScheduleAppointmentComponent } from './pages/schedule-appointment.component';

const scheduleAppointmentRoutes: Routes = [
  {
    path: '',
    component: ScheduleAppointmentComponent,
    children: [
      {
        path: 'overview',
        component: OverviewComponent,
      },
      {
        path: 'basic-details',
        component: BasicDetailComponent,
      },
      {
        path: 'referral-physician',
        component: ReferralPhysicianComponent,
      },
      {
        path: 'exam',
        component: ExamDetailComponent,
      },
      {
        path: 'slot',
        component: AppointmentSlotComponent,
      },
      {
        path: 'confirm',
        component: ConfirmAppointmentComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(scheduleAppointmentRoutes)],
  exports: [RouterModule],
})
export class ScheduleAppointmentRoutingModule {}
