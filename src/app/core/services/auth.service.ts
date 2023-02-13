import {Injectable} from '@angular/core';
import {BehaviorSubject, combineLatest, Observable, of, startWith, Subject, switchMap} from 'rxjs';
import {Router} from "@angular/router";
import {ScheduleAppointmentService} from "./schedule-appointment.service";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoggedInUser = new BehaviorSubject<boolean>(false);
  isPending = new BehaviorSubject<boolean>(false); // implemented temporarily

  private refreshLoginStatus$$ = new Subject<void>();

  private readonly userToken = '843YHRF47YF43H7843J78D3N78F3UMDSMDJ89398RUF3F8M4I';

  constructor(private router: Router, private scheduleAppointmentSvc: ScheduleAppointmentService) {
  }

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
    return this.navigateToAuth$(redirect);
  }

  public clearLocalStorage() {
    localStorage.removeItem('user');
    this.scheduleAppointmentSvc.resetDetails();
  }

  private navigateToAuth$(redirect: boolean): Observable<{}> {
    const url = this.router.routerState.snapshot.url;
    this.router.navigate(['/auth'], {
      queryParams: {redirectTo: redirect && !url?.includes('auth') ? url : null},
    });
    return of({});
  }

  public get isLoggedIn$(): Observable<boolean> {
    return combineLatest([this.refreshLoginStatus$$.pipe(startWith(''))]).pipe(switchMap(() => of(!!localStorage.getItem('user'))));
  }

  // userLoginCheck(){
  //   let userLoggedIn = Boolean(localStorage.getItem('user'));
  //   return !userLoggedIn;
  // }
}
