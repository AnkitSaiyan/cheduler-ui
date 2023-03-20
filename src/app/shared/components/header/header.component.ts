import { Component, OnDestroy, OnInit } from '@angular/core';
// eslint-disable-next-line import/no-extraneous-dependencies
import { TranslateService } from '@ngx-translate/core';
import { DestroyableComponent } from '../destroyable/destroyable.component';
import defaultLanguage from '../../../../assets/i18n/en-BE.json';
import dutchLangauge from '../../../../assets/i18n/nl-BE.json';
import { RouterStateService } from '../../../core/services/router-state.service';
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

  public selectedLang: string = 'en-BE'

  siteDetails$$: BehaviorSubject<any>;

  constructor(
    private routerStateSvc: RouterStateService,
    private authSvc: AuthService,
    private translateService: TranslateService,
    private landingService: LandingService,
  ) {
    super();
    this.siteDetails$$ = new BehaviorSubject<any[]>([]);
    this.landingService.siteFooterDetails$$.pipe(takeUntil(this.destroy$$)).subscribe((res) => {
      this.ngOnInit();
    });
  }

  public ngOnInit(): void {
    this.siteDetails$$.next(JSON.parse(localStorage.getItem('siteDetails') || '{}'));

    this.isLoggedIn$ = this.authSvc.isLoggedIn$;
    this.routerStateSvc
      .listenForUrlChange$()
      .pipe(takeUntil(this.destroy$$))
      .subscribe((url) => {
        this.siteDetails$$.next(JSON.parse(localStorage.getItem('siteDetails') || '{}'));
        this.url = url;
      });
  }

  changeLanguage(value) {
    if (value === 'en-BE') {
      this.translateService.setTranslation(value, defaultLanguage);
      this.translateService.setDefaultLang(value);
      // eslint-disable-next-line eqeqeq
    } else if (value === 'nl-BE') {
      this.translateService.setTranslation(value, dutchLangauge);
      this.translateService.setDefaultLang(value);
    }

    this.selectedLang = value;
  }

  public override ngOnDestroy() {
    super.ngOnDestroy();
  }
}
