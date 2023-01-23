import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AppComponent} from './app.component';
import {CoreModule} from './core/core.module';
import {HttpClientModule} from "@angular/common/http";
import {DesignSystemCoreModule} from 'diflexmo-angular-design';
import {AppRoutingModule} from './app-routing.module';
import {SharedModule} from "./shared/shared.module";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    declarations: [AppComponent],
    imports: [BrowserModule, CoreModule, ReactiveFormsModule, FormsModule, HttpClientModule, DesignSystemCoreModule, AppRoutingModule, SharedModule, NgbModule],
    bootstrap: [AppComponent],
})
export class AppModule {
}
