import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CoreComponent} from "./core.component";
import { AuthGuard } from './gurads/auth.guard';

const routes: Routes = [
    {
        path: '',
        component: CoreComponent,
        children: [
            {
                path: '',
                loadChildren: async () => (await import('../modules/landing/landing.module')).LandingModule,
                // canActivate: [AuthGuard]
            },
            {
                path: 'dashboard',
                loadChildren: async () => (await import('../modules/dashboard/dashboard.module')).DashboardModule,
            },
            {
                path: 'schedule-appointment',
                loadChildren: async () => (await import('../modules/schedule-appointment/schedule-appointment.module')).ScheduleAppointmentModule,
            },
            {
                path: 'appointment',
                loadChildren: async () => (await import('../modules/appointment/appointment.module')).AppointmentModule,
            },
            {
                path: 'profile',
                loadChildren: async () => (await import('../modules/profile/profile.module')).ProfileModule,
            },
        ],
    },
    // {
    //     path: '',
    //     redirectTo: 'dashboard',
    //     pathMatch: 'full',
    // },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CoreRoutingModule {
}
