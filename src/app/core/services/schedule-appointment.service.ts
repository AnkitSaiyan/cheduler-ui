import { HttpClient, HttpParams } from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BehaviorSubject, combineLatest, map, Observable, of, startWith, switchMap, tap} from "rxjs";
import { AddAppointmentRequestData, Appointment } from 'src/app/shared/models/appointment.model';
import { BaseResponse } from 'src/app/shared/models/base-response.model';
import { Exam } from 'src/app/shared/models/exam.model';
import { Physician } from 'src/app/shared/models/physician.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ScheduleAppointmentService {
  private examDetails$$ = new BehaviorSubject<any>({});

  private slotDetails$$ = new BehaviorSubject<any>({});

  private basicDetails$$ = new BehaviorSubject<any>({});

  private appointment$$ = new BehaviorSubject<any>({});

  private upcommingAppointments$$ = new BehaviorSubject<any>({});
  
  private refreshPhysicians$$ = new BehaviorSubject<any>({});

  private refreshExams$$ = new BehaviorSubject<any>({});

  constructor(private http: HttpClient) {
  }

  public setExamDetails(reqData) {
    console.log('reqData: ', reqData);
    this.examDetails$$.next(reqData);
  }

  public get examDetails$(): Observable<any> {
    return this.examDetails$$.asObservable();
  }

  public setSlotDetails(reqData) {
    console.log('reqData: ', reqData);
    this.slotDetails$$.next(reqData);
  }

  // public get slotDetails$(): Observable<any> {

  //   return this.slotDetails$$.asObservable();
  // }


  public get slotDetails$(): Observable<any> {
    return combineLatest([this.slotDetails$$.pipe(startWith(''))]).pipe(switchMap(() => this.fetchSlots()));
  }

  private fetchSlots(): Observable<Appointment[]> {
    return this.http
      .get<BaseResponse<Appointment[]>>(`${environment.serverBaseUrl}/test/slots`)
      .pipe(map((response) => response.data));
  }



  public setBasicDetails(reqData) {
    console.log('reqData: ', reqData);
    console.log('in')
    this.basicDetails$$.next(reqData);
  }

  public get basicDetails$(): Observable<any> {
    return this.basicDetails$$.asObservable();
  }

  public resetDetails() {
    this.examDetails$$.next({});
    this.slotDetails$$.next({});
    this.basicDetails$$.next({});
  }

  public addAppointment(requestData): Observable<AddAppointmentRequestData> {
    console.log('requestData: ', requestData);
    console.log("called");
    
    return this.http.post<BaseResponse<Appointment>>(`${environment.serverBaseUrl}/appointment`, 
      requestData
    ).pipe(
      map(response => response.data),
    )
  }

  public get upcommingAppointment$(): Observable<Appointment[]> {
    return combineLatest([this.upcommingAppointments$$.pipe(startWith(''))]).pipe(switchMap(() => this.fetchAllUpcomingAppointment()));
  }

  private fetchAllUpcomingAppointment(): Observable<Appointment[]> {
    return this.http
      .get<BaseResponse<Appointment[]>>(`${environment.serverBaseUrl}/appointment/getallupcomingappointmentlist`)
      .pipe(map((response) => response.data));
  }

  public get completedAppointment$(): Observable<Appointment[]> {
    return combineLatest([this.upcommingAppointments$$.pipe(startWith(''))]).pipe(switchMap(() => this.fetchAllCompletedAppointments()));
  }

  private fetchAllCompletedAppointments(): Observable<Appointment[]> {
    return this.http
      .get<BaseResponse<Appointment[]>>(`${environment.serverBaseUrl}/appointment/getallcompletedappointmentlist`)
      .pipe(map((response) => response.data));
  }

  
  public get physicians$(): Observable<Physician[]> {
    return combineLatest([this.refreshPhysicians$$.pipe(startWith(''))]).pipe(switchMap(() => this.fetchAllPhysicians()));
  }

  private fetchAllPhysicians(): Observable<any[]> {
    return this.http.get<BaseResponse<any[]>>(`${environment.serverBaseUrl}/doctor`).pipe(map((response) => response.data));
  }


  
  public get exams$(): Observable<Exam[]> {
    return combineLatest([this.refreshExams$$.pipe(startWith(''))]).pipe(switchMap(() => this.fetchAllExams()));
  }

  private fetchAllExams(): Observable<Exam[]> {
    return this.http.get<BaseResponse<Exam[]>>(`${environment.serverBaseUrl}/exam?pageNo=1`).pipe(map((response) => response.data));
  }

  public getExamByID(examID: number): Observable<Exam | undefined> {
    console.log("examId", examID)
    // return combineLatest([this.refreshExams$$.pipe(startWith(''))]).pipe(switchMap(() => of(this.exams.find((exam) => +exam.id === +examID))));
    let queryParams = new HttpParams();
    queryParams = queryParams.append("id", examID);
    return this.http.get<BaseResponse<Exam>>(`${environment.serverBaseUrl}/exam/${examID}`).pipe(
      map(response => response.data),
      tap(()=>{this.refreshExams$$.next('')})
    )
  }

  public cancelAppointment$(appointmentId: Number) {
    return this.http.put<BaseResponse<Number>>(`${environment.serverBaseUrl}/appointment/cancelappointment/${appointmentId}`,'').pipe(
      map((response) => response.data),
    );
  }

  public updateAppointment$(requestData) {
    const {appointmentId, ...restData} = requestData;
    return this.http.put<BaseResponse<Number>>(`${environment.serverBaseUrl}/appointment/${appointmentId}`,restData).pipe(
      map((response) => response.data),
    );
  }
}
