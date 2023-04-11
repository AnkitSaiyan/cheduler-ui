import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { CoreComponent } from './core.component';
import { AuthGuard } from './gurads/auth.guard';
import { PrivacyPolicyComponent } from './privacy/privacy-policy/privacy-policy.component';

const routes: Routes = [
  {
    path: '',
    component: CoreComponent,
    children: [
      {
        path: '',
        loadChildren: async () => (await import('../modules/landing/landing.module')).LandingModule,
        canActivate: [AuthGuard],
      },
      // {
      //   path: 'auth',
      //   loadChildren: async () => (await import('./auth/auth.module')).AuthModule,
      // },
      {
        path: 'schedule',
        loadChildren: async () => (await import('../modules/schedule-appointment/schedule-appointment.module')).ScheduleAppointmentModule,
        // canActivateChild: [AuthGuard]
      },
      {
        path: 'privacy/policy',
        component: PrivacyPolicyComponent,
      },
      {
        path: '',
        loadChildren: async () => (await import('../modules/main/main.module')).MainModule,
        canActivate: [MsalGuard],
        canActivateChild: [AuthGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CoreRoutingModule {}

