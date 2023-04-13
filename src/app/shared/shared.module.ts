import {NgModule} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {DesignSystemModule} from 'diflexmo-angular-design';
import {RouterModule} from '@angular/router';
// eslint-disable-next-line import/no-extraneous-dependencies
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HttpClient} from '@angular/common/http';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {HeaderComponent} from './components/header/header.component';
import {FooterComponent} from './components/footer/footer.component';
import {SubHeaderComponent} from './components/sub-header/sub-header.component';
import {SideNavComponent} from './components/side-nav/side-nav.component';
import {DestroyableComponent} from './components/destroyable/destroyable.component';
import {ConfirmActionModalComponent} from './components/confirm-action-modal/confirm-action-modal.component';
import {WeekdayToNamePipe} from './pipes/weekday-to-name.pipe';
import {JoinWithAndPipe} from './pipes/join-with-and.pipe';
import {ProgressBarComponent} from './components/progress-bar/progress-bar.component';
import {VersioningComponent} from './components/versioning/versioning.component';
import {ObjectToArrayPipe} from './pipes/object-to-array.pipe';
import {SliceStringArrayPipe} from './pipes/slice-string-array.pipe';
import {DashIfNothingPipe} from './pipes/dash-if-nothing.pipe';
import {NgbPopoverModule} from '@ng-bootstrap/ng-bootstrap';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    SubHeaderComponent,
    SideNavComponent,
    DestroyableComponent,
    ConfirmActionModalComponent,
    WeekdayToNamePipe,
    JoinWithAndPipe,
    ProgressBarComponent,
    VersioningComponent,
    ObjectToArrayPipe,
    SliceStringArrayPipe,
    DashIfNothingPipe,
  ],
  imports: [
    CommonModule,
    DesignSystemModule,
    RouterModule,
    NgbPopoverModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    MatProgressSpinnerModule,
    MatProgressBarModule,
    NgOptimizedImage,
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
    ProgressBarComponent,
    VersioningComponent,
    ObjectToArrayPipe,
    SliceStringArrayPipe,
    TranslateModule,
    DashIfNothingPipe,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    NgbPopoverModule
  ],
})
export class SharedModule {}





