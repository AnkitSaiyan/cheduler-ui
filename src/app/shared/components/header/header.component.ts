import {Component, OnDestroy, OnInit} from '@angular/core';
import {RouterStateService} from "../../../core/services/router-state.service";
import {DestroyableComponent} from "../destroyable/destroyable.component";
import {Observable, takeUntil} from "rxjs";
import {AuthService} from "../../../core/services/auth.service";

@Component({
  selector: 'dfm-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent extends DestroyableComponent implements OnInit, OnDestroy {
  public items: any = [
    {
      name: 'EN',
      value: 'EN',
    },
    {
      name: 'NL',
      value: 'NL',
    }
  ];

  public url!: string;

  public isLoggedIn$!: Observable<boolean>;

  constructor(private routerStateSvc: RouterStateService, private authSvc: AuthService) {
    super();
  }

  public ngOnInit(): void {
    this.isLoggedIn$ = this.authSvc.isLoggedIn$;
    this.routerStateSvc.listenForUrlChange$().pipe(takeUntil(this.destroy$$)).subscribe((url) => this.url = url);
  }

  public override ngOnDestroy() {
    super.ngOnDestroy();
  }

}
