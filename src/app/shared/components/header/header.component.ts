import { Component, OnDestroy, OnInit } from '@angular/core';
// eslint-disable-next-line import/no-extraneous-dependencies
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable, map, takeUntil } from 'rxjs';
import { LandingService } from 'src/app/core/services/landing.service';
import { DestroyableComponent } from '../destroyable/destroyable.component';
import defaultLanguage from '../../../../assets/i18n/en-BE.json';
import dutchLanguage from '../../../../assets/i18n/nl-BE.json';
import { RouterStateService } from '../../../core/services/router-state.service';
import { AuthService } from '../../../core/services/auth.service';
import {ScheduleAppointmentService} from "../../../core/services/schedule-appointment.service";
import { DUTCH_BE, ENG_BE } from '../../utils/const';
import { ShareDataService } from 'src/app/services/share-data.service';

@Component({
  selector: 'dfm-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent extends DestroyableComponent implements OnInit, OnDestroy {
  public loggingIn$$ = new BehaviorSubject(false);
  public userName$!: Observable<string | undefined>;

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

  public selectedLang!: string;

  siteDetails$$: BehaviorSubject<any>;

  constructor(
    private routerStateSvc: RouterStateService,
    private authSvc: AuthService,
    private translateService: TranslateService,
    private landingService: LandingService,
    private scheduleAppointmentSvc: ScheduleAppointmentService,
    private shareDataSvc: ShareDataService
  ) {
    super();
    this.siteDetails$$ = new BehaviorSubject<any[]>([]);
    this.landingService.siteFooterDetails$$.pipe(takeUntil(this.destroy$$)).subscribe({
      next: () => this.ngOnInit(),
    });
  }

  public ngOnInit(): void {
    this.siteDetails$$.next(JSON.parse(localStorage.getItem('siteDetails') || '{}'));
    this.isLoggedIn$ = this.authSvc.isLoggedIn$;
    this.userName$ = this.authSvc.authUser$.pipe(map((user) => user?.givenName));

    this.isLoggedIn$ = this.authSvc.isLoggedIn$;
    this.routerStateSvc
      .listenForUrlChange$()
      .pipe(takeUntil(this.destroy$$))
      .subscribe((url) => {
        this.siteDetails$$.next(JSON.parse(localStorage.getItem('siteDetails') || '{}'));
        this.url = url;
      });
      this.shareDataSvc
			.getLanguage$()
			.pipe(takeUntil(this.destroy$$))
			.subscribe({
				next: (language: string) => this.selectedLang = language,
			});
  }

  public changeLanguage(value) {
    this.shareDataSvc.setLanguage(value);
    if (value === ENG_BE) {
      this.translateService.setTranslation(value, defaultLanguage);
      // eslint-disable-next-line eqeqeq
    } else if (value === DUTCH_BE) {
      this.translateService.setTranslation(value, dutchLanguage);
    }
    this.translateService.setDefaultLang(value);
    this.selectedLang = value;
  }

  public override ngOnDestroy() {
    super.ngOnDestroy();
  }

  public login() {
    // this.loggingIn$$.next(true);

    if (this.url.includes('confirm')) {
      this.scheduleAppointmentSvc.resetDetails(true);
      console.log('details reset');
    }

    const subscription = this.authSvc.loginWithRedirect();
    subscription.pipe(takeUntil(this.destroy$$)).subscribe();
  }
}
