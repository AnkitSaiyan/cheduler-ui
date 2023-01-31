import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppointmentTimeDetailComponent } from './components/appointment-time-detail/appointment-time-detail.component';
import { ConfirmAppointmentComponent } from './components/confirm-appointment/confirm-appointment.component';
import { ExamDetailComponent } from './components/exam-detail/exam-detail.component';
import { OverviewComponent } from './components/overview/overview.component';
import { DashboardComponent } from './pages/dashboard.component';
import {AuthGuard} from "../../core/gurads/auth.guard";

const dashboardRoutes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    canActivateChild: [AuthGuard],
    children: [
      {
        path: '',
        component: OverviewComponent,
      },
      {
        path: 'exam',
        component: ExamDetailComponent,
      },
      {
        path: 'date-time',
        component: AppointmentTimeDetailComponent,
      },
      {
        path: 'confirm-appointment',
        component: ConfirmAppointmentComponent,
      },
      {
        path: '',
        redirectTo: '',
        pathMatch: 'full'
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(dashboardRoutes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
