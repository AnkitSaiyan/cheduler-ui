import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, UrlTree } from '@angular/router';
import { map, Observable } from 'rxjs';
import { MsalService } from '@azure/msal-angular';
import { AuthService } from '../services/auth.service';
import { RouteTypeName } from '../../shared/models/routes.model';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router, private msalSvc: MsalService) {}

  public canActivate(route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> {
    const { data } = route;
    return this.guard(data['routeName']);
  }

  // private checkLogin(url: string): Observable<boolean> {
  //   return this.authService.isLoggedIn$.pipe(
  //     map((isLoggedIn) => {
  //       if (!isLoggedIn) {
  //         if (url.includes('schedule-appointment') || url === '/') {
  //           return true;
  //         }
  //
  //         this.router.navigate(['/auth'], {
  //           queryParams: { redirectTo: url },
  //         });
  //       }
  //
  //       // Block logged-in user from accessing landing and guest appointment pages
  //       if (url === '/' || url.includes('schedule-appointment')) {
  //         this.router.navigate(['/dashboard']);
  //       }
  //
  //       return isLoggedIn;
  //     }),
  //   );
  // }

  private guard(routeName: RouteTypeName) {
    return this.authService.isLoggedIn$.pipe(
      map(() => Boolean(this.msalSvc.instance.getAllAccounts()?.length)),
      map((isLoggedIn) => {
        switch (routeName) {
          case RouteTypeName.Public:
            return true;
          case RouteTypeName.NonProtected: {
            if (isLoggedIn) {
              return this.router.parseUrl('/dashboard');
            }
            return true;
          }
          case RouteTypeName.Protected: {
            if (!isLoggedIn) {
              return this.router.parseUrl('/');
            }
            return true;
          }
          default: {
            return this.router.parseUrl('/');
          }
        }
      }),
    );
  }
}
