import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, UrlTree } from '@angular/router';
import { map, Observable } from 'rxjs';
import { MsalService } from '@azure/msal-angular';
import { AuthService } from '../services/auth.service';
import { RouteTypeName } from '../../shared/models/routes.model';
import { EXT_Patient_Tenant } from 'src/app/shared/utils/const';

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
      map(() => {
        const tenantIds = (this.msalSvc.instance.getActiveAccount()?.idTokenClaims as any)?.extension_Tenants?.split(',');
        const isLoggedIn = tenantIds?.some((value) => value === EXT_Patient_Tenant);
        // if (!isLoggedIn) {
        //   this.authService.logout();
        // }
        return Boolean(this.msalSvc.instance.getAllAccounts()?.length) && isLoggedIn;
      }),
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
