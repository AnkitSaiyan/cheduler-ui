import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterStateService } from '../../../core/services/router-state.service';
import { DestroyableComponent } from '../destroyable/destroyable.component';
import { BehaviorSubject, Observable, takeUntil } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { LandingService } from 'src/app/core/services/landing.service';

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
    },
  ];

  public base64Start = 'data:image/jpeg;base64,';

  public url!: string;

  public isLoggedIn$!: Observable<boolean>;

  public siteDetails$$: BehaviorSubject<any[]>;

  constructor(private routerStateSvc: RouterStateService, private authSvc: AuthService, private landingService: LandingService) {
    super();
    this.siteDetails$$ = new BehaviorSubject<any[]>([]);
  }

  public ngOnInit(): void {
    this.landingService.siteFooterDetails$$.pipe(takeUntil(this.destroy$$)).subscribe((res) => {
      console.log('appointments upcomming: ', res);
      this.siteDetails$$.next(res);
    });

    this.isLoggedIn$ = this.authSvc.isLoggedIn$;
    this.routerStateSvc
      .listenForUrlChange$()
      .pipe(takeUntil(this.destroy$$))
      .subscribe((url) => (this.url = url));
  }

  public override ngOnDestroy() {
    super.ngOnDestroy();
  }
}
