import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './pages/dashboard.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { ExamDetailComponent } from './components/exam-detail/exam-detail.component';
import { AppointmentTimeDetailComponent } from './components/appointment-time-detail/appointment-time-detail.component';
import { ConfirmAppointmentComponent } from './components/confirm-appointment/confirm-appointment.component';
import { OverviewComponent } from './components/overview/overview.component';
import { ReactiveFormsModule } from '@angular/forms';
import { BasicDetailsComponent } from './components/basic-details/basic-details.component';



@NgModule({
  declarations: [
    DashboardComponent,
    ExamDetailComponent,
    AppointmentTimeDetailComponent,
    ConfirmAppointmentComponent,
    OverviewComponent,
    BasicDetailsComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    DashboardRoutingModule,
    ReactiveFormsModule,
  ]
})
export class DashboardModule { }
