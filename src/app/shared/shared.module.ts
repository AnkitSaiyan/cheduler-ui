import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import { DesignSystemCoreModule, DesignSystemModule, TableModule } from 'diflexmo-angular-design';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { RouterModule } from '@angular/router';


@NgModule({
    declarations: [HeaderComponent, FooterComponent],
    imports: [
        CommonModule,
        DesignSystemModule,
        DesignSystemCoreModule,
        RouterModule
    ],
    exports: [
        DesignSystemModule,
        HeaderComponent,
        FooterComponent
    ]
})
export class SharedModule {
}
