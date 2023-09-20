import { CommonModule, NgOptimizedImage } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DesignSystemModule } from 'diflexmo-angular-design';
// eslint-disable-next-line import/no-extraneous-dependencies
import { HttpClient } from '@angular/common/http';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ConfirmActionModalComponent } from './components/confirm-action-modal/confirm-action-modal.component';
import { DestroyableComponent } from './components/destroyable/destroyable.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { ProgressBarComponent } from './components/progress-bar/progress-bar.component';
import { SideNavComponent } from './components/side-nav/side-nav.component';
import { SubHeaderComponent } from './components/sub-header/sub-header.component';
import { VersioningComponent } from './components/versioning/versioning.component';
import { DashIfNothingPipe } from './pipes/dash-if-nothing.pipe';
import { JoinWithAndPipe } from './pipes/join-with-and.pipe';
import { ObjectToArrayPipe } from './pipes/object-to-array.pipe';
import { RemoveSelectedItemPipe } from './pipes/remove-selected-item.pipe';
import { SliceStringArrayPipe } from './pipes/slice-string-array.pipe';
import { UtcToLocalPipe } from './pipes/utc-to-local.pipe';
import { WeekdayToNamePipe } from './pipes/weekday-to-name.pipe';
import { AsPipe } from './pipes/as.pipe';
import { QrModalComponent } from './components/qr-modal/qr-modal.component';
import { UploadDocumentComponent } from './components/upload-document/upload-document.component';
import { AnatomyMatMenu } from './components/anatomy-mat-menu/anatomy-mat-menu';
import { RemoveSelectedItemFormAnatomyPipe } from './pipes/remove-selected-item-anatomy.pipe';
import { DocumentViewModalComponent } from './components/document-view-modal/document-view-modal.component';
import { SafePipe } from './pipes/safe.pipe';
import { NumberInputDirective } from './directives/number-input.directive';
import { SsnInputDirective } from './directives/ssn-input.directive';
import { NameInputDirective } from './directives/name-input.directive';

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
    UtcToLocalPipe,
    RemoveSelectedItemPipe,
    AsPipe,
    QrModalComponent,
    UploadDocumentComponent,
    AnatomyMatMenu,
    RemoveSelectedItemFormAnatomyPipe,
    DocumentViewModalComponent,
    SafePipe,
    NumberInputDirective,
    SsnInputDirective,
    NameInputDirective,
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
    MatTooltipModule,
    MatMenuModule,
    MatIconModule,
    MatChipsModule,
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
    NgbPopoverModule,
    UtcToLocalPipe,
    RemoveSelectedItemPipe,
    MatTooltipModule,
    MatMenuModule,
    MatIconModule,
    MatChipsModule,
    AsPipe,
    AnatomyMatMenu,
    RemoveSelectedItemFormAnatomyPipe,
    NumberInputDirective,
    SsnInputDirective,
    NameInputDirective,
  ],
})
export class SharedModule {}


