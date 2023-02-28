import { Component, OnDestroy, OnInit } from '@angular/core';
// eslint-disable-next-line import/no-extraneous-dependencies
import { TranslateService } from '@ngx-translate/core';
import { Observable, takeUntil } from 'rxjs';
import { RouterStateService } from '../../../core/services/router-state.service';
import { DestroyableComponent } from '../destroyable/destroyable.component';
import { AuthService } from '../../../core/services/auth.service';
import defaultLanguage from '../../../../assets/i18n/en-BE.json';
import dutchLangauge from '../../../../assets/i18n/nl-BE.json';

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

  public url!: string;

  public isLoggedIn$!: Observable<boolean>;

  constructor(private routerStateSvc: RouterStateService, private authSvc: AuthService, private translateService: TranslateService) {
    super();
  }

  public ngOnInit(): void {
    this.isLoggedIn$ = this.authSvc.isLoggedIn$;
    this.routerStateSvc
      .listenForUrlChange$()
      .pipe(takeUntil(this.destroy$$))
      .subscribe((url) => (this.url = url));
  }

  changeLangauge(value) {
    if (value == 'en-BE') {
      console.log('inn1');
      this.translateService.setTranslation(value, defaultLanguage);
      this.translateService.setDefaultLang(value);
      // eslint-disable-next-line eqeqeq
    } else if (value == 'nl-BE') {
      console.log('inn2');
      this.translateService.setTranslation(value, dutchLangauge);
      this.translateService.setDefaultLang(value);
    }
  }

  public override ngOnDestroy() {
    super.ngOnDestroy();
  }
}
