import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, combineLatest, map, Observable, of, startWith, Subject, switchMap } from 'rxjs';
import { Router } from '@angular/router';
import { ScheduleAppointmentService } from './schedule-appointment.service';
import { AuthUser } from 'src/app/shared/models/user.model';
import { MsalGuardConfiguration, MsalService, MSAL_GUARD_CONFIG } from '@azure/msal-angular';
import { UserManagementService } from './user-management.service';
import { InteractionType } from '@azure/msal-browser';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isLoggedInUser = new BehaviorSubject<boolean>(false);

  isPending = new BehaviorSubject<boolean>(false); // implemented temporarily

  private authUser$$: BehaviorSubject<AuthUser | undefined> = new BehaviorSubject<AuthUser | undefined>(undefined);

  private refreshLoginStatus$$ = new Subject<void>();

  private readonly userToken = '843YHRF47YF43H7843J78D3N78F3UMDSMDJ89398RUF3F8M4I';

  constructor(
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private msalService: MsalService,
    private router: Router,
    private scheduleAppointmentSvc: ScheduleAppointmentService,
    private userManagementApiService: UserManagementService,
  ) {}

  public login$(): Observable<any> {
    this.saveToLocalStorage();
    this.refreshLoginStatus$$.next();
    return of('');
  }

  private saveToLocalStorage() {
    localStorage.setItem('user', this.userToken);
  }

  public logout$(redirect = true): Observable<{}> {
    this.clearLocalStorage();
    this.refreshLoginStatus$$.next();
    this.scheduleAppointmentSvc.resetDetails();
    this.logout();
    return this.navigateToAuth$(redirect);
  }

  public get authUser$(): Observable<AuthUser | undefined> {
    return this.authUser$$.asObservable();
  }

  public initializeUser(): Observable<boolean> {
    const user = this.msalService.instance.getActiveAccount();
    const userId = user?.localAccountId ?? '';

    return this.userManagementApiService.getUserProperties(userId).pipe(
      map((res: any) => {
        console.log({ res });
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

  public clearLocalStorage() {
    localStorage.removeItem('user');
    this.scheduleAppointmentSvc.resetDetails();
  }

  private navigateToAuth$(redirect: boolean): Observable<{}> {
    const url = this.router.routerState.snapshot.url;
    this.router.navigate(['/auth'], {
      queryParams: { redirectTo: redirect && !url?.includes('auth') ? url : null },
    });
    return of({});
  }

  public logout() {
    if (this.msalGuardConfig.interactionType === InteractionType.Popup) {
      this.msalService.logoutPopup({
        mainWindowRedirectUri: '/',
      });
    } else {
      this.msalService.logoutRedirect();
    }

    setTimeout(() => this.removeUser(), 500);
  }

  public removeUser() {
    this.authUser$$.next(undefined);
  }

  public get isLoggedIn$(): Observable<boolean> {
    return combineLatest([this.refreshLoginStatus$$.pipe(startWith(''))]).pipe(
      switchMap(() => this.authUser$),
      map(Boolean),
    );
  }

  // userLoginCheck(){
  //   let userLoggedIn = Boolean(localStorage.getItem('user'));
  //   return !userLoggedIn;
  // }
}


