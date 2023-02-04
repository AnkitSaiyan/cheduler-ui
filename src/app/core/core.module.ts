import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {CoreRoutingModule} from './core-routing.module';
import {CoreComponent} from './core.component';
import {SharedModule} from "../shared/shared.module";
import { PrivacyPolicyComponent } from './privacy/privacy-policy/privacy-policy.component';

@NgModule({
    declarations: [
        CoreComponent,
        PrivacyPolicyComponent
    ],
    imports: [
        CommonModule,
        CoreRoutingModule,
        SharedModule
    ]
})
export class CoreModule {
}
