import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard.component';
import { OverviewComponent } from '../schedule-appointment/components/overview/overview.component';
import { ExamDetailComponent } from '../schedule-appointment/components/exam-detail/exam-detail.component';
import { ConfirmAppointmentComponent } from '../schedule-appointment/components/confirm-appointment/confirm-appointment.component';
import { BasicDetailComponent } from '../schedule-appointment/components/basic-detail/basic-detail.component';
import { AppointmentSlotComponent } from '../schedule-appointment/components/appointment-slot/appointment-slot.component';
import { ReferralPhysicianComponent } from '../schedule-appointment/components/referral-physician/referral-physician.component';

const dashboardRoutes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: '',
        component: OverviewComponent,
      },
      {
        path: 'schedule/exam',
        component: ExamDetailComponent,
      },
      {
        path: 'schedule/referral-physician',
        component: ReferralPhysicianComponent,
      },
      {
        path: 'schedule/slot',
        component: AppointmentSlotComponent,
      },
      {
        path: 'schedule/basic-details',
        component: BasicDetailComponent,
      },
      {
        path: 'schedule/confirm',
        component: ConfirmAppointmentComponent,
      },
      {
        path: '',
        redirectTo: '',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(dashboardRoutes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
