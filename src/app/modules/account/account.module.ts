import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountComponent } from './pages/account.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { AccountRoutingModule } from './account.routing.module';
import {ReactiveFormsModule} from "@angular/forms";
import {PrivacyComponent} from "./components/privacy/privacy.component";
import {ProfileComponent} from "./components/profile/profile.component";

@NgModule({
  declarations: [
    AccountComponent,
    PrivacyComponent,
    ProfileComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    AccountRoutingModule,
    ReactiveFormsModule
  ]
})
export class AccountModule { }
