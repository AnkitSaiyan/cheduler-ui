import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CoreComponent} from "./core.component";

const routes: Routes = [
    {
        path: '',
        component: CoreComponent,
        children: [
            {
                path: '',
                loadChildren: async () => (await import('../modules/landing/landing.module')).LandingModule,
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
