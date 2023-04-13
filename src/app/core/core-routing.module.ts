import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoreComponent } from './core.component';
import { AuthGuard } from './gurads/auth.guard';
import { PrivacyPolicyComponent } from './privacy/privacy-policy/privacy-policy.component';
import { RouteTypeName } from '../shared/models/routes.model';

const routes: Routes = [
  {
    path: '',
    component: CoreComponent,
    children: [
      {
        path: '',
        loadChildren: async () => (await import('../modules/landing/landing.module')).LandingModule,
        canActivate: [AuthGuard],
        data: { routeName: RouteTypeName.NonProtected },
      },
      {
        path: 'schedule',
        loadChildren: async () => (await import('../modules/schedule-appointment/schedule-appointment.module')).ScheduleAppointmentModule,
      },
      {
        path: 'privacy/policy',
        component: PrivacyPolicyComponent,
      },
      {
        path: '',
        loadChildren: async () => (await import('../modules/main/main.module')).MainModule,
        canActivate: [AuthGuard],
        data: { routeName: RouteTypeName.Protected },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CoreRoutingModule {}
