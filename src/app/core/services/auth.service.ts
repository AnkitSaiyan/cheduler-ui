import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, combineLatest, map, Observable, of, switchMap, take, throwError } from 'rxjs';
import { AuthUser } from 'src/app/shared/models/user.model';
import { MSAL_GUARD_CONFIG, MsalGuardConfiguration, MsalService } from '@azure/msal-angular';
import { RedirectRequest } from '@azure/msal-browser';
import { EXT_Patient_Tenant } from 'src/app/shared/utils/const';
import { Router } from '@angular/router';
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
    private router: Router,
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

  public loginWithRedirect(): Observable<any> {
    sessionStorage.clear();

    // checking if already logged in
    if (this.msalService.instance.getActiveAccount()) {
      window.location.reload();
      return of(null);
    }

    // If not already logged in then redirect
    if (this.msalGuardConfig.authRequest) {
      return this.msalService.loginRedirect({ ...this.msalGuardConfig.authRequest } as RedirectRequest);
    }
    return this.msalService.loginRedirect();
  }

  public initializeUser(): Observable<any> {
    console.log('initializing user...');

    const user = this.msalService.instance.getActiveAccount();
    const userId = user?.localAccountId ?? '';

    console.log('user', user);
    const tenantIds = (user?.idTokenClaims as any)?.extension_Tenants?.split(',');

    console.log('tenantIds', tenantIds);

    if (!tenantIds?.some((value) => value === EXT_Patient_Tenant)) {
      this.logout();
      return of(null);
    }

    return this.userManagementApiService.getTenantId().pipe(
      switchMap(() => {
        return this.userManagementApiService.getUserProperties(userId).pipe(
          switchMap((res: any) => {
            this.authUser$$.next(new AuthUser(res.mail, res.givenName, res.id, res.surname, res.displayName, res.email, res.properties));
            return this.userManagementApiService.getAllPermits(userId).pipe(catchError((err) => throwError(err)));
          }),
          catchError((err) => throwError(err)),
        );
      }),
      catchError(() => of(false)),
    );
  }

  public logout() {
    this.msalService
      .logoutRedirect({
        postLogoutRedirectUri: window.location.origin,
      })
      .pipe(take(1))
      .subscribe({
        next: () => this.removeUser(),
      });
  }

  public removeUser() {
    this.authUser$$.next(undefined);
    sessionStorage.clear();
  }
}
