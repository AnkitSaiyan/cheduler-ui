import {Injectable} from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';
import {map, Observable} from 'rxjs';
import {AuthService} from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
  }

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const { url } = state;
    return this.checkLogin(url);
  }

  public canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const { url } = state;
    return this.checkLogin(url);
  }

  private checkLogin(url: string): Observable<boolean> {

    return this.authService.isLoggedIn$.pipe(
      map((isLoggedIn) => {
        if (!isLoggedIn) {
          if (url.includes('schedule-appointment') || url === '/') {
            return true;
          } else {
            this.router.navigate(['/auth'], {
              queryParams: { redirectTo: url },
            });
          }
        }

        // Block logged-in user from accessing landing and guest appointment pages
        if (url === '/' || url.includes('schedule-appointment')) {
          this.router.navigate(['/dashboard']);
        }

        return isLoggedIn;
      })
    );
  }
}
