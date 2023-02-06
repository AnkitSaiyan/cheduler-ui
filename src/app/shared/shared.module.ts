import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DesignSystemCoreModule, DesignSystemModule} from 'diflexmo-angular-design';
import {HeaderComponent} from './components/header/header.component';
import {FooterComponent} from './components/footer/footer.component';
import {RouterModule} from '@angular/router';
import {SubHeaderComponent} from './components/sub-header/sub-header.component';
import {SideNavComponent} from './components/side-nav/side-nav.component';
import {DestroyableComponent} from './components/destroyable/destroyable.component';
import {ConfirmActionModalComponent} from './components/confirm-action-modal/confirm-action-modal.component';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HttpClient} from '@angular/common/http';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {WeekdayToNamePipe} from "./pipes/weekday-to-name.pipe";
import {JoinWithAndPipe} from "./pipes/join-with-and.pipe";
import {ProgressBarComponent} from "./components/progress-bar/progress-bar.component";

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [HeaderComponent, FooterComponent, SubHeaderComponent, SideNavComponent, DestroyableComponent, ConfirmActionModalComponent, WeekdayToNamePipe, JoinWithAndPipe, ProgressBarComponent],
  imports: [
    CommonModule,
    DesignSystemModule,
    RouterModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
  ],
  exports: [
    DesignSystemModule,
    HeaderComponent,
    FooterComponent,
    SideNavComponent,
    SubHeaderComponent,
    DestroyableComponent,
    WeekdayToNamePipe,
    JoinWithAndPipe,
    ConfirmActionModalComponent,
    ProgressBarComponent
  ]
})
export class SharedModule {
}
