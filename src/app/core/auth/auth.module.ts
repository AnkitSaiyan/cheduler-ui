import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AuthComponent} from './auth.component';
import {AuthRoutingModule} from './auth-routing.module'
import { SharedModule } from 'src/app/shared/shared.module';
import { RegisterComponent } from './register/register.component';

@NgModule({
    declarations: [
        AuthComponent,
        RegisterComponent
    ],
    imports: [
        CommonModule,
        AuthRoutingModule,
        SharedModule
    ]
})
export class AuthModule {
}
