import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, map, Observable, startWith, Subject, switchMap, tap } from 'rxjs';
import { UserProperties, UserPropertiesRequestDate } from 'src/app/shared/models/user-properties.model';
import { environment } from 'src/environments/environment';
import { Permits } from '../../shared/models/user-permits.model';

@Injectable({
  providedIn: 'root',
})
export class UserManagementService {
  private readonly url = environment.userManagementApiUrl;

  private readonly serverBaseUrl = environment.serverBaseUrl;

  private permits$$ = new BehaviorSubject<undefined | Permits[]>(undefined);

  private refreshPermits$$ = new Subject<void>();

  private refreshProperties$$ = new Subject<void>();

  private currentTenantId = '';

  constructor(private httpClient: HttpClient) {}

  public getUserProperties(userId: string): Observable<UserProperties> {
    return combineLatest([this.refreshProperties$$.pipe(startWith(''))]).pipe(
      switchMap(() => this.httpClient.get<UserProperties>(`${this.url}/users/${userId}/properties`).pipe(
        map((data) => data)
      )),
    );
  }

  public patchUserProperties(userId: string, payload: UserPropertiesRequestDate) {
    return this.httpClient.patch(`${this.url}/users/${userId}/properties`, payload).pipe(tap(() => this.refreshProperties$$.next()));
  }

  public getTenantId(): Observable<any> {
    return this.httpClient.get<any>(`${this.serverBaseUrl}/common/gettenantid`).pipe(tap((res) => (this.currentTenantId = res.data)));
  }

  public get tenantId(): string {
    return this.currentTenantId;
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
