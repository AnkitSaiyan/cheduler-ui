import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, combineLatest, map, Observable, of, startWith, Subject, switchMap, tap } from 'rxjs';
import {
  AddAppointmentRequestData,
  Appointment,
  AppointmentDaysRequestData,
  AppointmentSlot,
  AppointmentSlotsRequestData,
} from 'src/app/shared/models/appointment.model';
import { BaseResponse } from 'src/app/shared/models/base-response.model';
import { Exam } from 'src/app/shared/models/exam.model';
import { Physician } from 'src/app/shared/models/physician.model';
import { environment } from 'src/environments/environment';
import { ExamDetails, SlotDetails } from '../../shared/models/local-storage-data.model';
import { LoaderService } from './loader.service';

@Injectable({
  providedIn: 'root',
})
export class ScheduleAppointmentService {
  private examDetails$$ = new BehaviorSubject<ExamDetails>({} as ExamDetails);

  public editDetails$$ = new BehaviorSubject<any>({});

  public editData$$ = new BehaviorSubject<any>({});

  private slotDetails$$ = new BehaviorSubject<SlotDetails>({} as SlotDetails);

  private basicDetails$$ = new BehaviorSubject<any>({});

  private appointment$$ = new BehaviorSubject<any>({});

  private upcommingAppointments$$ = new BehaviorSubject<any>({});

  private refreshPhysicians$$ = new BehaviorSubject<any>({});

  private refreshExams$$ = new BehaviorSubject<any>({});

  private refreshAppointment$$ = new Subject<void>();

  constructor(private http: HttpClient, private loaderSvc: LoaderService) {}

  public setExamDetails(reqData: ExamDetails) {
    localStorage.setItem('examDetails', JSON.stringify(reqData));
    this.examDetails$$.next(reqData);
    localStorage.removeItem('slotDetails');
    this.slotDetails$$.next({} as SlotDetails);
  }

  public get examDetails$(): Observable<ExamDetails> {
    if (!this.examDetails$$.value?.physician || !this.examDetails$$.value?.exams) {
      const examDetails = localStorage.getItem('examDetails');
      if (examDetails) {
        this.examDetails$$.next(JSON.parse(examDetails));
      }
    }

    return this.examDetails$$.asObservable();
  }

  public setSlotDetails(reqData: SlotDetails) {
    localStorage.setItem('slotDetails', JSON.stringify(reqData));
    this.slotDetails$$.next(reqData);
  }

  public get slotDetails$(): Observable<SlotDetails> {
    console.log(!this.slotDetails$$.value?.selectedDate);
    if (!this.slotDetails$$.value?.selectedDate) {
      const slotDetails = localStorage.getItem('slotDetails');
      if (slotDetails) {
        console.log('inn');
        this.slotDetails$$.next(JSON.parse(slotDetails));
      }
    }

    return this.slotDetails$$.asObservable();
  }

  public setBasicDetails(reqData) {
    localStorage.setItem('basicDetails', JSON.stringify(reqData));
    this.basicDetails$$.next(reqData);
  }

  public get basicDetails$(): Observable<any> {
    const basicDetails = localStorage.getItem('basicDetails');
    if (basicDetails) {
      return of(JSON.parse(basicDetails));
    }
    return of({});
  }

  public resetDetails(clearAppointmentId: boolean = false) {
    if (clearAppointmentId) {
      localStorage.removeItem('appointmentId');
    }
    localStorage.removeItem('basicDetails');
    localStorage.removeItem('examDetails');
    localStorage.removeItem('slotDetails');
    localStorage.removeItem('edit');
    localStorage.removeItem('appointmentDetails');
    this.examDetails$$.next({} as ExamDetails);
    this.slotDetails$$.next({} as SlotDetails);
    this.basicDetails$$.next({});
    // this.examDetails$$.next({});
    // this.slotDetails$$.next({});
    // this.basicDetails$$.next({});
  }

  public addAppointment(requestData): Observable<Appointment> {
    return this.http.post<BaseResponse<Appointment>>(`${environment.serverBaseUrl}/appointment`, requestData).pipe(
      map((response) => response.data),
      tap(() => this.refreshAppointment$$.next()),
    );
  }

  public get upcommingAppointment$(): Observable<Appointment[]> {
    return combineLatest([this.upcommingAppointments$$.pipe(startWith(''))]).pipe(switchMap(() => this.fetchAllUpcomingAppointment()));
  }

  private fetchAllUpcomingAppointment(): Observable<Appointment[]> {
    this.loaderSvc.activate();
    return this.http.get<BaseResponse<Appointment[]>>(`${environment.serverBaseUrl}/appointment/getallupcomingappointmentlist`).pipe(
      map((response) => response.data),
      tap(() => this.loaderSvc.deactivate()),
    );
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
    return this.http.get<BaseResponse<any[]>>(`${environment.serverBaseUrl}/doctor`).pipe(
      map((response) => response.data))
  }

  public get exams$(): Observable<Exam[]> {
    return combineLatest([this.refreshExams$$.pipe(startWith(''))]).pipe(switchMap(() => this.fetchAllExams()));
  }

  private fetchAllExams(): Observable<Exam[]> {
    this.loaderSvc.spinnerActivate()
    return this.http.get<BaseResponse<Exam[]>>(`${environment.serverBaseUrl}/common/getexams`).pipe(map((response) => response.data), tap(() => this.loaderSvc.spinnerDeactivate()));
  }

  public getExamByID(examID: number): Observable<Exam | undefined> {
    // return combineLatest([this.refreshExams$$.pipe(startWith(''))]).pipe(switchMap(() => of(this.examsDetails.find((exam) => +exam.id === +examID))));
    let queryParams = new HttpParams();
    queryParams = queryParams.append('id', examID);
    return this.http.get<BaseResponse<Exam>>(`${environment.serverBaseUrl}/exam/${examID}`).pipe(
      map((response) => response.data),
      tap(() => {
        this.refreshExams$$.next('');
      }),
    );
  }

  public cancelAppointment$(appointmentId: number): Observable<boolean> {
    return this.http.put<BaseResponse<boolean>>(`${environment.serverBaseUrl}/appointment/cancelappointment/${appointmentId}`, '').pipe(
      map((response) => response.data),
      tap(() => this.refreshAppointment$$.next()),
    );
  }

  public updateAppointment$(requestData) {
    const { appointmentId, ...restData } = requestData;
    return this.http
      .put<BaseResponse<number>>(`${environment.serverBaseUrl}/appointment/${appointmentId}`, restData)
      .pipe(map((response) => response.data));
  }

  public getSlots$(requestData: AppointmentSlotsRequestData): Observable<AppointmentSlot> {
    return this.http
      .post<BaseResponse<AppointmentSlot>>(`${environment.serverBaseUrl}/patientappointment/slots`, requestData)
      .pipe(map((res) => res?.data));
  }

  public getCalendarDays$(requestData: AppointmentDaysRequestData): Observable<AppointmentSlot[]> {
    return this.http
      .post<BaseResponse<AppointmentSlot[]>>(`${environment.serverBaseUrl}/patientappointment/days`, requestData)
      .pipe(map((res) => res?.data));
  }

  public getAppointmentByID$(appointmentID: number): Observable<Appointment> {
    // let queryParams = new HttpParams();
    // queryParams = queryParams.append('id', appointmentID);

    return combineLatest([this.refreshAppointment$$.pipe(startWith(''))]).pipe(
      switchMap(() => {
        return this.http.get<BaseResponse<Appointment>>(`${environment.serverBaseUrl}/appointment/${appointmentID}`).pipe(
          map((response) => {
            if (Array.isArray(response.data)) {
              return this.getAppointmentModified(response.data[0]);
            }
            return this.getAppointmentModified(response.data) as Appointment;
          }),
          catchError((e) => {
            console.log('error', e);
            return of({} as Appointment);
          }),
        );
      }),
    );
  }

  private getAppointmentModified(appointment: any): any {
    const examIdToRooms: { [key: number]: any[] } = {};
    const examIdToUsers: { [key: number]: any[] } = {};

    if (appointment.roomsDetail?.length) {
      appointment?.roomsDetail?.forEach((room) => {
        if (!examIdToRooms[+room.examId]) {
          examIdToRooms[+room.examId] = [];
        }
        examIdToRooms[+room.examId].push({ start: room.startedAt.slice(-8), end: room.endedAt.slice(-8), roomId: room.id });
      });
    }

    if (appointment.usersDetail?.length) {
      appointment?.usersDetail?.forEach((user) => {
        if (!examIdToUsers[+user.examId]) {
          examIdToUsers[+user.examId] = [];
        }
        examIdToUsers[+user.examId].push(user.id);
      });
    }

    let startedAt;
    let endedAt;

    const ap = {
      ...appointment,
      exams: appointment.exams.map((exam) => {
        if (exam.startedAt && (!startedAt || new Date(exam.startedAt) < startedAt)) {
          startedAt = new Date(exam.startedAt);
        }

        if (exam.endedAt && (!endedAt || new Date(exam.endedAt) > endedAt)) {
          endedAt = new Date(exam.endedAt);
        }

        return {
          ...exam,
          rooms: examIdToRooms[+exam.id],
          allUsers: exam?.users ?? [],
          users: examIdToUsers[+exam.id],
        };
      }),
    };

    ap.startedAt = startedAt;
    ap.endedAt = endedAt;

    return ap;
  }
}






















