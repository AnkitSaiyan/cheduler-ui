import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LandingRoutingModule } from './landing-routing.module';
import { LandingComponent } from './pages/landing.component';
import { SharedModule } from '../../shared/shared.module';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [
        LandingComponent,
    ],
    exports: [
        LandingComponent
    ],
    imports: [
        CommonModule,
        LandingRoutingModule,
        SharedModule,
        RouterModule,
    ]
})
export class LandingModule { }
