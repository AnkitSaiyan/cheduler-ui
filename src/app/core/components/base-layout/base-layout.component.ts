import { Component } from '@angular/core';
import { SelectItem } from 'diflexmo-angular-design/lib/design-system/modules/input-dropdown/models/select-item';

@Component({
  selector: 'dfm-base-layout',
  templateUrl: './base-layout.component.html',
  styleUrls: ['./base-layout.component.scss'],
})
export class BaseLayoutComponent {
  public tenants: SelectItem[] = [{ name: 'Diflexmo', value: 'diflexmo' }];

  public currentTenant: string = this.tenants[0].value;

  public changeTenant(tenant: string) {
    this.currentTenant = tenant;
  }
}
