import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { OverviewComponent } from './components/overview/overview.component';
import { BasicDetailComponent } from './components/basic-detail/basic-detail.component';
import { ExamDetailComponent } from './components/exam-detail/exam-detail.component';
import { AppointmentSlotComponent } from './components/appointment-slot/appointment-slot.component';
import { ConfirmAppointmentComponent } from './components/confirm-appointment/confirm-appointment.component';
import { ScheduleAppointmentRoutingModule } from './schedule-appointment-routing.module';
import { ScheduleAppointmentComponent } from './pages/schedule-appointment.component';
import { ReferralPhysicianComponent } from './components/referral-physician/referral-physician.component';

@NgModule({
  declarations: [
    ScheduleAppointmentComponent,
    OverviewComponent,
    BasicDetailComponent,
    ExamDetailComponent,
    AppointmentSlotComponent,
    ConfirmAppointmentComponent,
    ReferralPhysicianComponent,
  ],
  imports: [CommonModule, SharedModule, ScheduleAppointmentRoutingModule, ReactiveFormsModule],
})
export class ScheduleAppointmentModule {}
