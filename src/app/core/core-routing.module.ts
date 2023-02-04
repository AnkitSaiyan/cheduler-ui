import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CoreComponent} from "./core.component";
import {AuthGuard} from './gurads/auth.guard';
import {PrivacyPolicyComponent} from "./privacy/privacy-policy/privacy-policy.component";

const routes: Routes = [
  {
    path: '',
    component: CoreComponent,
    children: [
      {
        path: '',
        loadChildren: async () => (await import('../modules/landing/landing.module')).LandingModule,
        canActivate: [AuthGuard]
      },
      {
        path: 'dashboard',
        loadChildren: async () => (await import('../modules/dashboard/dashboard.module')).DashboardModule,
        canActivateChild: [AuthGuard]
      },
      {
        path: 'schedule-appointment',
        loadChildren: async () => (await import('../modules/schedule-appointment/schedule-appointment.module')).ScheduleAppointmentModule,
        canActivateChild: [AuthGuard]
      },
      {
        path: 'appointment',
        loadChildren: async () => (await import('../modules/appointment/appointment.module')).AppointmentModule,
        canActivateChild: [AuthGuard]
      },
      {
        path: 'profile',
        loadChildren: async () => (await import('../modules/profile/profile.module')).ProfileModule,
        canActivateChild: [AuthGuard]
      },
      {
        path: 'privacy/policy',
        component: PrivacyPolicyComponent,
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreRoutingModule {
}
