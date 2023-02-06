import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, takeUntil} from "rxjs";
import {AuthService} from "../../../core/services/auth.service";
import {RouterStateService} from "../../../core/services/router-state.service";
import {DestroyableComponent} from "../destroyable/destroyable.component";

@Component({
  selector: 'dfm-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent extends DestroyableComponent implements OnInit, OnDestroy {
  public url!: string;
  public isUserLoggedIn$!: Observable<boolean>;

  constructor(private authSvc: AuthService, private routerStateSvc: RouterStateService) {
    super();
  }

  public ngOnInit(): void {
    this.routerStateSvc.listenForUrlChange$().pipe(takeUntil(this.destroy$$)).subscribe((url) => this.url = url);
    this.isUserLoggedIn$ = this.authSvc.isLoggedIn$;
  }

  public override ngOnDestroy() {
    super.ngOnDestroy();
  }

}
