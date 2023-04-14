import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, startWith, Subject, switchMap, tap } from 'rxjs';
import { UserProperties } from 'src/app/shared/models/user-properties.model';
import { environment } from 'src/environments/environment';
import { Permits } from '../../shared/models/user-permits.model';

@Injectable({
  providedIn: 'root',
})
export class UserManagementService {
  private readonly url = environment.userManagementApiUrl;

  private permits$$ = new BehaviorSubject<undefined | Permits[]>(undefined);

  private refreshPermits$$ = new Subject<void>();

  constructor(private httpClient: HttpClient) {}

  public getUserProperties(userId: string): Observable<UserProperties> {
    return this.httpClient.get<UserProperties>(`${this.url}/users/${userId}/properties`);
  }

  public getTenantId(userId: string): Observable<UserProperties> {
    return this.httpClient.get<UserProperties>(`${this.url}/users/${userId}/tenants`);
  }

  public getAllPermits(userId: string): Observable<Permits[]> {
    if (this.permits$$.value) {
      return this.permits$$.asObservable() as Observable<Permits[]>;
    }
    return combineLatest([this.refreshPermits$$.pipe(startWith(''))]).pipe(
      switchMap(() => this.httpClient.get<Permits[]>(`${this.url}/users/${userId}/properties/permits`)),
      tap((res) => this.permits$$.next(res)),
    );
  }

  public createPropertiesPermit(userId: string, tenantId: string): Observable<Record<string, string>> {
    return this.httpClient.post<Record<string, string>>(`${this.url}/users/${userId}/properties/permit`, { tenantId });
  }

  public revokePermit(userId: string, tenantId: string): Observable<any> {
    return this.httpClient.post<any>(`${this.url}/users/${userId}/properties/revoke`, { tenantId }).pipe(
      tap(() => {
        this.permits$$.next(undefined);
        this.refreshPermits$$.next();
      }),
    );
  }

  public deleteUser(userId: string): Observable<UserProperties> {
    return this.httpClient.delete<UserProperties>(`${this.url}/users/${userId}`);
  }
}
