import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, combineLatest, map, Observable, of, startWith, Subject, switchMap, tap } from 'rxjs';
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

  constructor(private router: Router, private http: HttpClient, private loaderSvc: LoaderService) {}

  public get siteDetails$(): Observable<any[]> {
    return combineLatest([this.refreshSiteDetails$$.pipe(startWith(''))]).pipe(switchMap(() => this.fetchAllSiteDetail()));
  }

  fetchAllSiteDetail(): Observable<any> {
    this.loaderSvc.activate();
    return this.http.get<any>(`${environment.serverBaseUrl}/patientsite/getsitesettings`).pipe(tap(() => this.loaderSvc.deactivate()));
  }

  public get workingDetails$(): Observable<any[]> {
    return combineLatest([this.workingHourDetails$$.pipe(startWith(''))]).pipe(switchMap(() => this.fetchAllWorkingHours()));
  }

  fetchAllWorkingHours(): Observable<any> {
    return this.http.get<any>(`${environment.serverBaseUrl}/patientsite/getworktime`).pipe(map((response) => response?.data));
  }
}

