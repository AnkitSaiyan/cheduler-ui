import { HttpBackend, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, map, Observable, startWith, switchMap, tap } from 'rxjs';
import { Router } from '@angular/router';
import { BaseResponse } from 'src/app/shared/models/base-response.model';
import { environment } from 'src/environments/environment';
import { LoaderService } from './loader.service';

@Injectable({
  providedIn: 'root',
})
export class LandingService {
  isLoggedInUser = new BehaviorSubject<boolean>(false);

  private refreshSiteDetails$$ = new BehaviorSubject<any>({});

  public siteFooterDetails$$ = new BehaviorSubject<any>({});

  private workingHourDetails$$ = new BehaviorSubject<any>({});

  private httpClient: HttpClient;

  private SubDomain: string = '';

  public siteSetting$$ = new BehaviorSubject<any>(null);

  constructor(private router: Router, private http: HttpBackend, private loaderSvc: LoaderService) {
    this.httpClient = new HttpClient(http);
    // eslint-disable-next-line prefer-destructuring
    this.SubDomain = window.location.host.split('.')[0];
  }

  public get siteDetails$(): Observable<BaseResponse<any>> {
    return combineLatest([this.refreshSiteDetails$$.pipe(startWith(''))]).pipe(switchMap(() => this.fetchAllSiteDetail()));
  }

  fetchAllSiteDetail(): Observable<any> {
    this.loaderSvc.activate();
    return this.httpClient
      .get<any>(`${environment.serverBaseUrl}/patientsite/getsitesettings`, {
        headers: { SubDomain: this.SubDomain },
      })
      .pipe(
        tap((data) => {
          this.siteSetting$$.next(data?.data);
          this.loaderSvc.deactivate();
        }),
      );
  }

  public get workingDetails$(): Observable<any[]> {
    return combineLatest([this.workingHourDetails$$.pipe(startWith(''))]).pipe(switchMap(() => this.fetchAllWorkingHours()));
  }

  fetchAllWorkingHours(): Observable<any> {
    return this.httpClient
      .get<any>(`${environment.serverBaseUrl}/patientsite/getworktime`, {
        headers: { SubDomain: this.SubDomain },
      })
      .pipe(map((response) => response?.data));
  }
}
