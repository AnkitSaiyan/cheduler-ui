import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppointmentComponent } from './pages/appointment/appointment.component';

const dashboardRoutes: Routes = [
  {
    path: '',
    component: AppointmentComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(dashboardRoutes)],
  exports: [RouterModule]
})
export class AppointmentRoutingModule { }
