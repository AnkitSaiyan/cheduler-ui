import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Tooltip } from 'bootstrap';
// eslint-disable-next-line import/no-extraneous-dependencies
import { TranslateService } from '@ngx-translate/core';
// eslint-disable-next-line import/no-extraneous-dependencies
import { IdTokenClaims } from '@azure/msal-common';
import { AuthenticationResult, EventMessage, EventType, InteractionStatus } from '@azure/msal-browser';
import { MSAL_GUARD_CONFIG, MsalBroadcastService, MsalGuardConfiguration, MsalService } from '@azure/msal-angular';
import { filter, takeUntil } from 'rxjs';
import { NotificationType } from 'diflexmo-angular-design';
import defaultLanguage from '../assets/i18n/en-BE.json';
import { DestroyableComponent } from './shared/components/destroyable/destroyable.component';
import { AuthService } from './core/services/auth.service';
import { AuthConfig } from './configuration/auth.config';
import { NotificationDataService } from './core/services/notification-data.service';

type IdTokenClaimsWithPolicyId = IdTokenClaims & {
  acr?: string;
  tfp?: string;
};

@Component({
  selector: 'dfm-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent extends DestroyableComponent implements OnInit, OnDestroy {
  public user?: any;

  constructor(
    public translate: TranslateService,
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private authService: MsalService,
    private msalBroadcastService: MsalBroadcastService,
    private userAuthSvc: AuthService,
    private notificationSvc: NotificationDataService,
  ) {
    translate.addLangs(['en-BE', 'nl-BE']);
    translate.setTranslation('en-BE', defaultLanguage);
    translate.setDefaultLang('en-BE');
    super();
  }

  ngOnInit(): void {
    this.checkAndSetActiveAccount();
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltipTriggerList.forEach((e) => new Tooltip(e));
    // this.authService
    //   .handleRedirectObservable()
    //   .pipe(takeUntil(this.destroy$$))
    //   .subscribe({
    //     next: (res) => console.log('redirect observable', res),
    //   });

    this.msalBroadcastService.msalSubject$
      .pipe(
        filter((msg: EventMessage) => msg.eventType === EventType.ACCOUNT_ADDED || msg.eventType === EventType.ACCOUNT_REMOVED),
        takeUntil(this.destroy$$),
      )
      .subscribe({
        next: () => {
          if (this.authService.instance.getAllAccounts().length === 0) {
            window.location.pathname = '/';
          } else {
            this.checkAndSetActiveAccount();
          }
        },
      });

    this.msalBroadcastService.inProgress$
      .pipe(
        filter((status: InteractionStatus) => status === InteractionStatus.None),
        takeUntil(this.destroy$$),
      )
      .subscribe({
        next: () => {
          this.checkAndSetActiveAccount();
        },
      });

    this.msalBroadcastService.msalSubject$
      .pipe(
        filter(
          (msg: EventMessage) =>
            msg.eventType === EventType.LOGIN_SUCCESS ||
            msg.eventType === EventType.ACQUIRE_TOKEN_SUCCESS ||
            msg.eventType === EventType.SSO_SILENT_SUCCESS,
        ),
        // eslint-disable-next-line no-underscore-dangle
        takeUntil(this.destroy$$),
      )
      .subscribe({
        next: (result: EventMessage) => {
          const payload = result.payload as AuthenticationResult;
          const idToken = payload.idTokenClaims as IdTokenClaimsWithPolicyId;

          if (idToken.acr === AuthConfig.authFlow || idToken.tfp === AuthConfig.authFlow) {
            this.authService.instance.setActiveAccount(payload.account);
          }

          // return result;
        },
      });
  }

  public override ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  private checkAndSetActiveAccount() {
    /**
     * If no active account set but there are accounts signed in, sets first account to active account
     * To use active account set here, subscribe to inProgress$ first in your component
     * Note: Basic usage demonstrated. Your app may require more complicated account selection logic
     */


    const activeAccount = this.authService.instance.getActiveAccount();
    if (!this.authService.instance.getAllAccounts().length) return;

    if (!activeAccount && this.authService.instance.getAllAccounts().length > 0) {
      const accounts = this.authService.instance.getAllAccounts();
      this.authService.instance.setActiveAccount(accounts[0]);
    }

    this.userAuthSvc.authUser$.pipe(takeUntil(this.destroy$$)).subscribe({
      next: (x) => (this.user = x),
    });

    this.userAuthSvc
      .initializeUser()
      .pipe(takeUntil(this.destroy$$))
      .subscribe({
        next: (x) => {
          if (!x) {
            // not showing error for now
            this.notificationSvc.showNotification('User login failed. Logging out.', NotificationType.DANGER);
            this.userAuthSvc.logout();
            // setTimeout(() => this.userService.logout(), 1500);
          }
        },
      });
  }
}
