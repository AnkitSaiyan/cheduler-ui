import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
// eslint-disable-next-line import/no-extraneous-dependencies
import { TranslateService } from '@ngx-translate/core';
import { InteractionStatus } from '@azure/msal-browser';
import { MSAL_GUARD_CONFIG, MsalBroadcastService, MsalGuardConfiguration, MsalService } from '@azure/msal-angular';
import { BehaviorSubject, filter, takeUntil, tap } from 'rxjs';
import { NotificationType } from 'diflexmo-angular-design';
import defaultLanguage from '../assets/i18n/nl-BE.json';
import englishLanguage from '../assets/i18n/en-BE.json';
import { DestroyableComponent } from './shared/components/destroyable/destroyable.component';
import { AuthService } from './core/services/auth.service';
import { NotificationDataService } from './core/services/notification-data.service';

@Component({
  selector: 'dfm-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent extends DestroyableComponent implements OnInit, OnDestroy {
  public loading$$ = new BehaviorSubject<boolean>(false);

  constructor(
    public translate: TranslateService,
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private authService: MsalService,
    private msalBroadcastService: MsalBroadcastService,
    private userAuthSvc: AuthService,
    private notificationSvc: NotificationDataService,
  ) {
    super();
    this.setupLanguage();
    this.msalBroadcastService.inProgress$
      .pipe(
        filter((status: InteractionStatus) => status === InteractionStatus.None),
        tap(() => this.loading$$.next(true)),
        takeUntil(this.destroy$$),
      )
      .subscribe({
        next: () => {
          this.checkAndSetActiveAccount();
        },
      });
  }

  public ngOnInit(): void {
    // this.msalBroadcastService.msalSubject$
    //   .pipe(
    //     filter((msg: EventMessage) => msg.eventType === EventType.ACCOUNT_ADDED || msg.eventType === EventType.ACCOUNT_REMOVED),
    //     takeUntil(this.destroy$$),
    //   )
    //   .subscribe({
    //     next: () => {
    //       this.checkAndSetActiveAccount();
    //     },
    //   });
    // this.msalBroadcastService.msalSubject$
    //   .pipe(
    //     filter(
    //       (msg: EventMessage) =>
    //         msg.eventType === EventType.LOGIN_SUCCESS ||
    //         msg.eventType === EventType.ACQUIRE_TOKEN_SUCCESS ||
    //         msg.eventType === EventType.SSO_SILENT_SUCCESS,
    //     ),
    //     // eslint-disable-next-line no-underscore-dangle
    //     takeUntil(this.destroy$$),
    //   )
    //   .subscribe({
    //     next: (result: EventMessage) => {
    //       const payload = result.payload as AuthenticationResult;
    //       const idToken = payload.idTokenClaims as IdTokenClaimsWithPolicyId;
    //
    //       if (idToken.acr === AuthConfig.authFlow || idToken.tfp === AuthConfig.authFlow) {
    //         this.authService.instance.setActiveAccount(payload.account);
    //       }
    //
    //       // return result;
    //     },
    //   });
  }

  public override ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  private checkAndSetActiveAccount() {
    console.log('inside ');

    if (!this.authService.instance.getAllAccounts().length) {
      this.loading$$.next(false);
      return;
    }

    const activeAccount = this.authService.instance.getActiveAccount();
    if (!activeAccount && this.authService.instance.getAllAccounts().length > 0) {
      const accounts = this.authService.instance.getAllAccounts();
      this.authService.instance.setActiveAccount(accounts[0]);
    }

    this.userAuthSvc
      .initializeUser()
      .pipe(takeUntil(this.destroy$$))
      .subscribe({
        next: (x) => {
          if (!x) {
            // not showing error for now
            this.notificationSvc.showNotification('You are not permitted to view this page.', NotificationType.DANGER);
            setTimeout(() => this.userAuthSvc.logout(), 1500);
          }

          this.loading$$.next(false);
        },
      });
  }

  private setupLanguage() {
    this.translate.addLangs(['en-BE', 'nl-BE']);
    this.translate.setTranslation('en-BE', defaultLanguage);
    this.translate.setDefaultLang('en-BE');
    this.translate.addLangs(['en-BE', 'nl-BE']);
    const lang = localStorage.getItem('lang');
    if (lang) {
      this.translate.setTranslation(lang, lang === 'nl-BE' ? defaultLanguage : englishLanguage);
      this.translate.setDefaultLang(lang);
    } else {
      this.translate.setTranslation('nl-BE', defaultLanguage);
      this.translate.setDefaultLang('nl-BE');
    }
  }
}
