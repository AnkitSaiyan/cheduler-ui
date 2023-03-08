import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, takeUntil } from 'rxjs';
import { LandingService } from 'src/app/core/services/landing.service';
import { AuthService } from '../../../core/services/auth.service';
import { RouterStateService } from '../../../core/services/router-state.service';
import { DestroyableComponent } from '../destroyable/destroyable.component';

@Component({
  selector: 'dfm-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent extends DestroyableComponent implements OnInit, OnDestroy {
  public url!: string;

  public isUserLoggedIn$!: Observable<boolean>;

  public siteDetails$$: BehaviorSubject<any[]>;

  constructor(private landingService: LandingService, private authSvc: AuthService, private routerStateSvc: RouterStateService) {
    super();
    this.siteDetails$$ = new BehaviorSubject<any[]>([]);
    this.landingService.siteFooterDetails$$.pipe(takeUntil(this.destroy$$)).subscribe((res) => {
      this.ngOnInit();
    });
  }

  public ngOnInit(): void {
    this.siteDetails$$.next(JSON.parse(localStorage.getItem('siteDetails') || '{}'));

    this.routerStateSvc
      .listenForUrlChange$()
      .pipe(takeUntil(this.destroy$$))
      .subscribe((url) => {
        this.siteDetails$$.next(JSON.parse(localStorage.getItem('siteDetails') || '{}'));
        this.url = url;
      });
    this.isUserLoggedIn$ = this.authSvc.isLoggedIn$;
  }

  public override ngOnDestroy() {
    super.ngOnDestroy();
  }
}
