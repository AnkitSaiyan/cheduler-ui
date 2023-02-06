import {Component, OnDestroy, OnInit} from '@angular/core';
import {RouterStateService} from "../../../core/services/router-state.service";
import {DestroyableComponent} from "../destroyable/destroyable.component";
import {take, takeUntil} from "rxjs";

@Component({
  selector: 'dfm-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent extends DestroyableComponent implements OnInit, OnDestroy {
  items: any = [
    {
      name: 'EN',
      value: 'EN',
      discription: '',
    },
    {
      name: 'NL',
      value: 'NL',
      discription: '',
    }
  ];

  public url!: string;

  constructor(private routerStateSvc: RouterStateService) {
    super();
  }

  public ngOnInit(): void {
    this.routerStateSvc.listenForUrlChange$().pipe(takeUntil(this.destroy$$)).subscribe((url) => this.url = url);
  }

  public override ngOnDestroy() {
    super.ngOnDestroy();
  }

}
