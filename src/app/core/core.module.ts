import { NgModule } from '@angular/core';
import { DesignSystemCoreModule, DesignSystemModule } from 'diflexmo-angular-design';
import { BaseLayoutComponent } from './components/base-layout/base-layout.component';
import { AppRoutingModule } from '../app-routing.module';

@NgModule({
  declarations: [BaseLayoutComponent],
  imports: [DesignSystemCoreModule, AppRoutingModule, DesignSystemModule],
  exports: [AppRoutingModule],
})
export class CoreModule {}
