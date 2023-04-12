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
}

