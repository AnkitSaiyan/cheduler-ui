import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
// eslint-disable-next-line import/no-extraneous-dependencies
import { TranslateService } from '@ngx-translate/core';
import { EventMessage, EventType, InteractionStatus } from '@azure/msal-browser';
import { MSAL_GUARD_CONFIG, MsalBroadcastService, MsalGuardConfiguration, MsalService } from '@azure/msal-angular';
import {BehaviorSubject, filter, of, switchMap, takeUntil, tap} from 'rxjs';
import { NotificationType } from 'diflexmo-angular-design';
import { Router } from '@angular/router';
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
    private router: Router,
  ) {
    super();
    this.setupLanguage();
    this.setupUser();
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

  private setupUser() {
    this.msalBroadcastService.inProgress$
      .pipe(
        filter((status: InteractionStatus) => status === InteractionStatus.None),
        tap(() => this.loading$$.next(true)),
        switchMap(() => this.setActiveAccount()),
      )
      .subscribe({
        next: () => this.loading$$.next(false),
        error: (e) => {
          this.notificationSvc.showNotification(e, NotificationType.DANGER);
          setTimeout(() => this.userAuthSvc.logout(), 1500);
        },
      });

    this.msalBroadcastService.msalSubject$.subscribe({
      next: (e) => {
        const { eventType } = e;

        if (eventType === EventType.LOGIN_SUCCESS || eventType === EventType.ACQUIRE_TOKEN_SUCCESS) {
          this.router.navigate(['/dashboard']);
        }

        if (eventType === EventType.LOGIN_FAILURE || eventType === EventType.ACQUIRE_TOKEN_FAILURE) {
          this.userAuthSvc.logout();
        }
      },
    });

    this.msalBroadcastService.msalSubject$
      .pipe(
        filter((msg: EventMessage) => msg.eventType === EventType.ACCOUNT_REMOVED || msg.eventType === EventType.ACCOUNT_ADDED),
        switchMap(() => {
          if (this.authService.instance.getAllAccounts().length === 0) {
            window.location.pathname = '/';
            return of(null);
          }
          return this.setActiveAccount();
        }),
      )
      .subscribe();
  }

  private setActiveAccount() {
    if (!this.authService.instance.getAllAccounts().length) {
      this.loading$$.next(false);
      return of(null);
    }

    const activeAccount = this.authService.instance.getActiveAccount();
    if (!activeAccount) {
      const accounts = this.authService.instance.getAllAccounts();
      this.authService.instance.setActiveAccount(accounts[0]);
    }

    return this.userAuthSvc.initializeUser();
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
