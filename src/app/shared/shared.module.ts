import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import { DesignSystemCoreModule, DesignSystemModule, TableModule } from 'diflexmo-angular-design';


@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        DesignSystemModule,
        DesignSystemCoreModule,
    ],
    exports: [
        DesignSystemModule
    ]
})
export class SharedModule {
}
