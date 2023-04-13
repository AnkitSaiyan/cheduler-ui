import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
  {
    path: 'dashboard',
    loadChildren: async () => (await import('../dashboard/dashboard.module')).DashboardModule,
  },
  {
    path: 'appointment',
    loadChildren: async () => (await import('../appointment/appointment.module')).AppointmentModule,
  },
  {
    path: 'account',
    loadChildren: async () => (await import('../account/account.module')).AccountModule,
  },
  {
    path: '**',
    redirectTo: '/dashboard',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainRoutingModule {
}
