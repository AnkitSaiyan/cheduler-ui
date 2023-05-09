import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, combineLatest, map, Observable, of, switchMap } from 'rxjs';
import { AuthUser } from 'src/app/shared/models/user.model';
import { MSAL_GUARD_CONFIG, MsalGuardConfiguration, MsalService } from '@azure/msal-angular';
import { RedirectRequest } from '@azure/msal-browser';
import { EXT_Patient_Tenant } from 'src/app/shared/utils/const';
import { UserManagementService } from './user-management.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authUser$$: BehaviorSubject<AuthUser | undefined> = new BehaviorSubject<AuthUser | undefined>(undefined);

  private TenantId: string = 'NPXN';

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
    console.log('ide req');
    return this.authUser$$.value?.id;
  }

  public get isLoggedIn(): boolean {
    return !!this.authUser$$.value;
  }

  public loginWithRedirect(): Observable<void> {
    // sessionStorage.clear();
    // this.loaderSvc.activate();
    // this.msalService.loginRedirect();
    if (this.msalGuardConfig.authRequest) {
      return this.msalService.loginRedirect({ ...this.msalGuardConfig.authRequest } as RedirectRequest);
    }
    return this.msalService.loginRedirect();
  }

  public initializeUser(): Observable<boolean> {
    console.log('initializing user...');

    const user = this.msalService.instance.getActiveAccount();
    const userId = user?.localAccountId ?? '';

    console.log('user', user);
    const tenantIds = (user?.idTokenClaims as any)?.extension_Tenants?.split(',');

    console.log('tenantIds', tenantIds)

    if (!tenantIds?.some((value) => value === EXT_Patient_Tenant)) {
      return of(false);
    }

    return this.userManagementApiService.getUserProperties(userId).pipe(
      map((res: any) => {
        try {
          this.authUser$$.next(new AuthUser(res.mail, res.givenName, res.id, res.surname, res.displayName, res.email, res.properties));
          return true;
        } catch (error) {
          return false;
        }
      }),
      switchMap(() => {
        return this.userManagementApiService.getAllPermits(userId).pipe(
          map(() => true),
          catchError(async () => true),
        );
      }),
      catchError(() => of(false)),
    );
  }

  public logout() {
    this.removeUser();

    this.msalService.logoutRedirect({
      postLogoutRedirectUri: window.location.origin,
    });
  }

  public removeUser() {
    this.authUser$$.next(undefined);
    sessionStorage.clear();
  }
}
