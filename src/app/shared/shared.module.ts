import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import { DesignSystemCoreModule, DesignSystemModule, TableModule } from 'diflexmo-angular-design';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { RouterModule } from '@angular/router';
import { SubHeaderComponent } from './components/sub-header/sub-header.component';
import { SideNavComponent } from './components/side-nav/side-nav.component';


@NgModule({
    declarations: [HeaderComponent, FooterComponent, SubHeaderComponent, SideNavComponent],
    imports: [
        CommonModule,
        DesignSystemModule,
        DesignSystemCoreModule,
        RouterModule
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
