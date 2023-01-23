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


@NgModule({
    declarations: [HeaderComponent, FooterComponent, SubHeaderComponent, SideNavComponent, DestroyableComponent, ConfirmActionModalComponent],
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
