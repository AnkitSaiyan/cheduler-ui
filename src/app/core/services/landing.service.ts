import { HttpBackend, HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, map, Observable, of, startWith, switchMap, tap } from 'rxjs';
import { Router } from '@angular/router';
import { BaseResponse } from 'src/app/shared/models/base-response.model';
import { environment } from 'src/environments/environment';
import { LoaderService } from './loader.service';
import { HttpUtils } from 'src/app/shared/utils/http.utils';

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

  private documentMap = new Map();

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

  public getQr(connectionId: string, appointmentId: string): Observable<any> {
    let params = new HttpParams()
      .append('signalRConnectionId', connectionId)
      .append('url', window.location.origin + `/upload-document/?id=qrcodeid`)
      .append('appointmentid', appointmentId);
    let headers = HttpUtils.GetHeader(['SubDomain', window.location.host.split('.')[0]]);
    return this.httpClient.get<any>(`${environment.serverBaseUrl}/qrcode/getqrcode`, { params, headers }).pipe(
      map((response) => response.data),
      tap(),
    );
  }

  public validateQr(uniqueId: string): Observable<any> {
    let params = new HttpParams().append('uniqueId', uniqueId);
    let headers = HttpUtils.GetHeader(['SubDomain', window.location.host.split('.')[0]]);
    return this.httpClient.get<any>(`${environment.serverBaseUrl}/qrcode/validate`, { params, headers }).pipe(
      map((response) => response.statusCode),
      tap(),
    );
  }

  public uploadDocumnet(file: any, uniqueId: string, isUploadedFromQr: boolean = false): Observable<any> {
    this.documentMap.clear();
    const formData = new FormData();
    formData.append('File', file);
    formData.append('ApmtQRCodeId', uniqueId);
    formData.append('FileData', '');
    formData.append('FileName', '');
    formData.append('AppointmentId', (localStorage.getItem('appointmentId') ?? 0).toString());
    formData.append('isUploadedFromQr', JSON.stringify(isUploadedFromQr));

    let headers = HttpUtils.GetHeader(['SubDomain', window.location.host.split('.')[0]]);
    return this.httpClient.post<any>(`${environment.serverBaseUrl}/qrcode/upload`, formData, { headers }).pipe(
      map((response) => response.data),
      tap(),
    );
  }

  public getDocumentById$(id: any, isPreview: boolean): Observable<any> {
    if (isPreview && this.documentMap.has(id)) {
      return of(this.documentMap.get(id));
    }
    let params = new HttpParams(); //appointmentId
    const idType = isNaN(id) ? 'qrCodeId' : 'appointmentId';
    params = params.append(idType, id);
    params = params.append('isPreview', isPreview);
    let headers = HttpUtils.GetHeader(['SubDomain', window.location.host.split('.')[0]]);
    return this.httpClient.get<any>(`${environment.serverBaseUrl}/qrcode/getdocuments`, { params, headers }).pipe(
      map((response) => response.data),
      tap(() => {}),
    );
  }

  public setDocument(id: any, documentList: any[]) {
    this.documentMap.set(id, documentList);
  }
  public deleteDocument(qrId: string): Observable<any> {
    let headers = HttpUtils.GetHeader(['SubDomain', window.location.host.split('.')[0]]);
    return this.httpClient.delete<any>(`${environment.serverBaseUrl}/qrcode/${qrId}`, { headers }).pipe(
      map((response) => response.statusCode),
      tap(),
    );
  }
}
