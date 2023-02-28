import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AppComponent} from './app.component';
import {CoreModule} from './core/core.module';
import {HttpClientModule, HTTP_INTERCEPTORS} from "@angular/common/http";
import {DesignSystemCoreModule} from 'diflexmo-angular-design';
import {AppRoutingModule} from './app-routing.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {ServiceWorkerModule} from "@angular/service-worker";
import {DatePipe} from "@angular/common";
import { HeaderInterceptor } from './core/http/header.interceptor';


@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    CoreModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: !window.location.href.includes('localhost') }),
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    DesignSystemCoreModule,
    AppRoutingModule,
    NgbModule
  ],
  bootstrap: [AppComponent],
  providers: [
    DatePipe,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HeaderInterceptor,
      multi: true,
    },
  ]
})
export class AppModule {
}
