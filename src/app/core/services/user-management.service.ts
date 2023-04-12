import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserProperties } from 'src/app/shared/models/user-properties.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserManagementService {
  private readonly url = environment.userManagementApiUrl;

  constructor(private httpClient: HttpClient) {}

  public getUserProperties(userId: string): Observable<UserProperties> {
    return this.httpClient.get<UserProperties>(`${this.url}/users/${userId}/properties`);
  }

  public getTenantId(userId: string): Observable<UserProperties> {
    return this.httpClient.get<UserProperties>(`${this.url}/users/${userId}/tenants`);
  }

  public getAllPermits(userId: string): Observable<any> {
    return this.httpClient.get<any>(`${this.url}/users/${userId}/properties/permits`);
  }

  public createPropertiesPermit(userId: string, tenantId: string): Observable<Record<string, string>> {
    return this.httpClient.post<Record<string, string>>(`${this.url}/users/${userId}/properties/permit`, { tenantId });
  }

  public revokePermit(userId: string, tenantId: string): Observable<any> {
    return this.httpClient.post<any>(`${this.url}/users/${userId}/properties/revoke`, { tenantId });
  }

  public deleteUser(userId: string): Observable<UserProperties> {
    return this.httpClient.delete<UserProperties>(`${this.url}/users/${userId}`);
  }
}







