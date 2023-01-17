import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentComponent } from './pages/appointment/appointment.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { AppointmentRoutingModule } from './appointment-routing.module';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    AppointmentComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    AppointmentRoutingModule,
    RouterModule
  ]
})
export class AppointmentModule { }
