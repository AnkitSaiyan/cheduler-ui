import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import { DesignSystemCoreModule, DesignSystemModule, TableModule } from 'diflexmo-angular-design';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { RouterModule } from '@angular/router';
import { SubHeaderComponent } from './components/sub-header/sub-header.component';
import { SideNavComponent } from './components/side-nav/side-nav.component';
import { DestroyableComponent } from './components/destroyable/destroyable.component';
import { ConfirmActionModalComponent } from './components/confirm-action-modal/confirm-action-modal.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
    declarations: [HeaderComponent, FooterComponent, SubHeaderComponent, SideNavComponent, DestroyableComponent, ConfirmActionModalComponent],
    imports: [
        CommonModule,
        DesignSystemModule,
        DesignSystemCoreModule,
        RouterModule,
        TranslateModule.forRoot({
            loader: {
              provide: TranslateLoader,
              useFactory: HttpLoaderFactory,
              deps: [HttpClient]
            }
          })
    ],
    exports: [
        DesignSystemModule,
        HeaderComponent,
        FooterComponent,
        SideNavComponent,
        SubHeaderComponent
    ]
})
export class SharedModule {
}
