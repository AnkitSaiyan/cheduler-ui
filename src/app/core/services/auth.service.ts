import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoggedInUser = new BehaviorSubject<boolean>(false);
  isPending = new BehaviorSubject<boolean>(false); // implemented temporarily
  constructor(private router: Router) { }

  public login$(): Observable<any> {
    this.saveToLocalStorage();
    return of('');
  }

  private saveToLocalStorage() {
    localStorage.setItem('user', 'true');
  }

  public logout$(redirect = true): Observable<{}> {
    this.clearLocalStorage();
    return this.navigateToAuth$(redirect);
  }

  public clearLocalStorage() {
    localStorage.removeItem('user');
  }

  private navigateToAuth$(redirect: boolean): Observable<{}> {
    const url = this.router.routerState.snapshot.url;
    this.router.navigate(['/auth'], {
      queryParams: { redirectTo: redirect && !url?.includes('auth') ? url : null },
    });
    return of({});
  }

  public get isLoggedIn$(): Observable<boolean> {
    return of(!!localStorage.getItem('user'));
  }

  // userLoginCheck(){
  //   let userLoggedIn = Boolean(localStorage.getItem('user'));
  //   return !userLoggedIn;
  // }
}
