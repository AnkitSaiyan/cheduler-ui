import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AppComponent} from './app.component';
import {CoreModule} from './core/core.module';
import {HttpClientModule} from "@angular/common/http";
import {DesignSystemCoreModule} from 'diflexmo-angular-design';
import {AppRoutingModule} from './app-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    declarations: [AppComponent],
    imports: [BrowserModule, CoreModule, ReactiveFormsModule, FormsModule, HttpClientModule, DesignSystemCoreModule, AppRoutingModule, NgbModule],
    bootstrap: [AppComponent],
})
export class AppModule {
}
