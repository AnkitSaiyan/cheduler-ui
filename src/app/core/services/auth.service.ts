import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, combineLatest, map, Observable, of } from 'rxjs';
import { AuthUser } from 'src/app/shared/models/user.model';
import { MSAL_GUARD_CONFIG, MsalGuardConfiguration, MsalService } from '@azure/msal-angular';
import { RedirectRequest } from '@azure/msal-browser';
import { UserManagementService } from './user-management.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authUser$$: BehaviorSubject<AuthUser | undefined> = new BehaviorSubject<AuthUser | undefined>(undefined);

  private readonly TenantId: string = 'NPXN';

  constructor(
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private msalService: MsalService,
    private userManagementApiService: UserManagementService,
  ) {}

  public get authUser$(): Observable<AuthUser | undefined> {
    return this.authUser$$.asObservable();
  }

  public get isLoggedIn$(): Observable<boolean> {
    return combineLatest([this.authUser$$]).pipe(map(([user]) => !!user));
  }

  public get userId(): string | undefined {
    return this.authUser$$.value?.id;
  }

  public get isLoggedIn(): boolean {
    return !!this.authUser$$.value;
  }

  public get tenantId(): string {
    return this.TenantId;
  }

  public loginWithRedirect() {
    // sessionStorage.clear();
    // this.loaderSvc.activate();
    // this.msalService.loginRedirect();
    if (this.msalGuardConfig.authRequest) {
      this.msalService.loginRedirect({ ...this.msalGuardConfig.authRequest } as RedirectRequest);
    } else {
      this.msalService.loginRedirect();
    }
  }

  public initializeUser(): Observable<boolean> {
    console.log('initializing user...');

    const user = this.msalService.instance.getActiveAccount();
    const userId = user?.localAccountId ?? '';

    return this.userManagementApiService.getUserProperties(userId).pipe(
      map((res: any) => {
        try {
          this.authUser$$.next(new AuthUser(res.mail, res.givenName, res.id, res.surname, res.displayName, res.email, res.properties));
          return true;
        } catch (error) {
          return false;
        }
      }),
      catchError(() => of(false)),
    );
  }

  public logout() {
    this.removeUser();

    // if (this.msalGuardConfig.interactionType === InteractionType.Popup) {
    //   this.msalService.logoutPopup({
    //     mainWindowRedirectUri: '/',
    //   });
    //   console.log('in poppup');
    // } else {
    //   console.log('in redirect');
    //   this.msalService.logoutRedirect();
    // }
    this.msalService.logoutRedirect({
      postLogoutRedirectUri: window.location.origin,
    });
  }

  public removeUser() {
    this.authUser$$.next(undefined);
    sessionStorage.clear();
  }
}
