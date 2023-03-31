import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// import { TranslateHttpLoader } from '@ngx-translate/http-loader';
// eslint-disable-next-line import/no-extraneous-dependencies
// import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { CoreRoutingModule } from './core-routing.module';
import { CoreComponent } from './core.component';
import { SharedModule } from '../shared/shared.module';
import { PrivacyPolicyComponent } from './privacy/privacy-policy/privacy-policy.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
// eslint-disable-next-line import/order
// import { HttpClient } from '@angular/common/http';

// export function HttpLoaderFactory(http: HttpClient) {
//   return new TranslateHttpLoader(http);
// }

@NgModule({
  declarations: [CoreComponent, PrivacyPolicyComponent],
  imports: [
    CommonModule,
    CoreRoutingModule,
    SharedModule,
    MatProgressBarModule,
    // TranslateModule.forChild({
    //   loader: {
    //     provide: TranslateLoader,
    //     // eslint-disable-next-line @typescript-eslint/no-use-before-define
    //     useFactory: HttpLoaderFactory,
    //     deps: [HttpClient],
    //   },
    // }),
  ],
  exports: [MatProgressBarModule],
})
export class CoreModule {}




