import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewComponent } from './components/view/view.component';
import { AppointmentComponent } from './pages/appointment/appointment.component';

const dashboardRoutes: Routes = [
  {
    path: '',
    component: AppointmentComponent
  },
  {
    path: 'view-all',
    component: ViewComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(dashboardRoutes)],
  exports: [RouterModule]
})
export class AppointmentRoutingModule { }
