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
import { BodyPartsComponent } from './components/exam-detail/body-parts/body-parts.component';
import { SkeletonModelComponent } from './components/exam-detail/models/skeleton-model/skeleton-model.component';
import { OrganModelComponent } from './components/exam-detail/models/organ-model/organ-model.component';
import { AnatomyModelComponent } from './components/exam-detail/anatomy-model/anatomy-model.component';

@NgModule({
  declarations: [
    ScheduleAppointmentComponent,
    OverviewComponent,
    BasicDetailComponent,
    ExamDetailComponent,
    AppointmentSlotComponent,
    ConfirmAppointmentComponent,
    BodyPartsComponent,
    SkeletonModelComponent,
    OrganModelComponent,
    AnatomyModelComponent,
  ],
  imports: [CommonModule, SharedModule, ScheduleAppointmentRoutingModule, ReactiveFormsModule],
})
export class ScheduleAppointmentModule {}
