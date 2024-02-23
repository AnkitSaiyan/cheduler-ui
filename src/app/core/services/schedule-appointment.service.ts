import { HttpBackend, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, combineLatest, map, Observable, of, startWith, Subject, switchMap, tap } from 'rxjs';
import {
  Appointment,
  AppointmentDaysRequestData,
  AppointmentSlot,
  AppointmentSlotsRequestData,
  ChangeStatusRequestData,
} from 'src/app/shared/models/appointment.model';
import { BaseResponse } from 'src/app/shared/models/base-response.model';
import { Exam } from 'src/app/shared/models/exam.model';
import { Physician } from 'src/app/shared/models/physician.model';
import { environment } from 'src/environments/environment';
import { ExamDetails, SlotDetails } from '../../shared/models/local-storage-data.model';
import { AuthService } from './auth.service';
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

  private upcomingAppointments$$ = new BehaviorSubject<any>({});

  private refreshPhysicians$$ = new BehaviorSubject<any>({});

  private refreshExams$$ = new BehaviorSubject<any>({});

  private refreshAppointment$$ = new Subject<void>();

  private httpWithInterceptor: HttpClient;

  private SubDomain: string = '';

  constructor(private http: HttpClient, private loaderSvc: LoaderService, private httpBackend: HttpBackend, private authSvc: AuthService) {
    this.httpWithInterceptor = new HttpClient(this.httpBackend);
    // eslint-disable-next-line prefer-destructuring
    this.SubDomain = window.location.host.split('.')[0];
  }

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
    if (!this.slotDetails$$.value?.selectedDate) {
      const slotDetails = localStorage.getItem('slotDetails');
      if (slotDetails) {
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
    localStorage.removeItem('referringDetails');
    localStorage.removeItem('gender');
    this.examDetails$$.next({} as ExamDetails);
    this.slotDetails$$.next({} as SlotDetails);
    this.basicDetails$$.next({});
  }

  public addAppointment(requestData): Observable<Appointment> {
    return (this.authSvc.isLoggedIn ? this.http : this.httpWithInterceptor)
      .post<BaseResponse<Appointment>>(`${environment.serverBaseUrl}/patientappointment/post`, requestData, {
        headers: { SubDomain: this.SubDomain },
      })
      .pipe(
        map((response) => response.data),
        tap(() => this.refreshAppointment$$.next()),
      );
  }

  public get upcomingAppointments$(): Observable<Appointment[]> {
    return combineLatest([this.upcomingAppointments$$.pipe(startWith(''))]).pipe(switchMap(() => this.fetchAllUpcomingAppointments()));
  }

  private fetchAllUpcomingAppointments(): Observable<Appointment[]> {
    this.loaderSvc.spinnerActivate();
    return this.http
      .get<BaseResponse<Appointment[]>>(`${environment.serverBaseUrl}/patientappointment/getallupcomingappointmentlist/${this.authSvc.userId}`)
      .pipe(
        map((response) => response.data),

        tap(() => {
          this.loaderSvc.spinnerDeactivate();
        }),
      );
  }

  public get completedAppointment$(): Observable<Appointment[]> {
    return combineLatest([this.upcomingAppointments$$.pipe(startWith(''))]).pipe(switchMap(() => this.fetchAllCompletedAppointments()));
  }

  private fetchAllCompletedAppointments(): Observable<Appointment[]> {
    return this.http
      .get<BaseResponse<Appointment[]>>(`${environment.serverBaseUrl}/patientappointment/getallcompletedappointmentlist/${this.authSvc.userId}`)
      .pipe(
        map((response) =>
          response.data.map((appointment) => ({
            ...appointment,
            exams: appointment.exams?.sort((a1: any, a2: any) => {
              const timeA = new Date(a1.startedAt);
              const timeB = new Date(a2.startedAt);
              return timeA.getTime() - timeB.getTime();
            }),
          })),
        ),
        map((data) => {
          const currentTime = new Date();
          return data.filter((item: any) => {
            const date = new Date(item?.exams[0]?.startedAt);
            return date.getTime() < currentTime.getTime();
          });
        }),
        tap(() => this.loaderSvc.spinnerDeactivate()),
      );
  }

  public get physicians$(): Observable<Physician[]> {
    return this.fetchAllPhysicians();
  }

  private fetchAllPhysicians(): Observable<any[]> {
    this.loaderSvc.spinnerActivate();
    return this.httpWithInterceptor
      .get<BaseResponse<any[]>>(`${environment.serverBaseUrl}/common/getdoctors`, {
        headers: { SubDomain: this.SubDomain },
      })
      .pipe(
        map((response) => response.data),
        tap(() => this.loaderSvc.spinnerDeactivate()),
      );
  }

  public get exams$(): Observable<Exam[]> {
    return this.fetchAllExams();
  }

  private fetchAllExams(): Observable<Exam[]> {
    this.loaderSvc.spinnerActivate();
    return this.httpWithInterceptor
      .get<BaseResponse<Exam[]>>(`${environment.serverBaseUrl}/common/getexams`, {
        headers: { SubDomain: this.SubDomain },
      })
      .pipe(
        map((response) => response?.data),
        tap(() => this.loaderSvc.spinnerDeactivate()),
      );
  }

  public getExamByID(examID: number): Observable<Exam | undefined> {
    return this.http.get<BaseResponse<Exam>>(`${environment.serverBaseUrl}/exam/${examID}`).pipe(
      map((response) => response.data),
      tap(() => {
        this.refreshExams$$.next('');
      }),
    );
  }

  public cancelAppointment$(appointmentId: number): Observable<boolean> {
    this.loaderSvc.activate();
    return this.http.put<BaseResponse<boolean>>(`${environment.serverBaseUrl}/patientappointment/cancelappointment/${appointmentId}`, '').pipe(
      map((response) => response.data),
      tap(() => {
        this.refreshAppointment$$.next();
        this.upcomingAppointments$$.next('');
        this.loaderSvc.deactivate();
      }),
    );
  }

  public cancelMultipleAppointment$(payload: ChangeStatusRequestData[]): Observable<boolean> {
    this.loaderSvc.activate();
    return this.http.put<BaseResponse<boolean>>(`${environment.serverBaseUrl}/patientappointment/updateappointmentstatus`, payload).pipe(
      map((response) => response.data),
      tap(() => {
        this.refreshAppointment$$.next();
        this.upcomingAppointments$$.next('');
        this.loaderSvc.deactivate();
      }),
    );
  }

  public updateAppointment$(requestData) {
    const { appointmentId, ...restData } = requestData;
    return (this.authSvc.isLoggedIn ? this.http : this.httpWithInterceptor)
      .put<BaseResponse<number>>(`${environment.serverBaseUrl}/patientappointment/put/${appointmentId}`, restData, {
        headers: { SubDomain: this.SubDomain },
      })
      .pipe(map((response) => response.data));
  }

  public getSlots$(requestData: AppointmentSlotsRequestData): Observable<AppointmentSlot> {
    return this.httpWithInterceptor
      .post<BaseResponse<AppointmentSlot>>(`${environment.serverBaseUrl}/patientappointment/slots`, requestData, {
        headers: { SubDomain: this.SubDomain },
      })
      .pipe(map((res) => res?.data));
  }

  public getCalendarDays$(requestData: AppointmentDaysRequestData): Observable<AppointmentSlot[]> {
    return this.httpWithInterceptor
      .post<BaseResponse<AppointmentSlot[]>>(`${environment.serverBaseUrl}/patientappointment/days`, requestData, {
        headers: { SubDomain: this.SubDomain },
      })
      .pipe(map((res) => res?.data));
  }

  public getAppointmentByID$(appointmentID: number): Observable<Appointment> {
    return (this.authSvc.isLoggedIn ? this.http : this.httpWithInterceptor)
      .get<BaseResponse<Appointment>>(`${environment.serverBaseUrl}/patientappointment/getbyid/${appointmentID}`, {
        headers: { SubDomain: this.SubDomain },
      })
      .pipe(
        map((response) => {
          if (Array.isArray(response.data)) {
            return this.getAppointmentModified(response.data[0]);
          }
          return this.getAppointmentModified(response.data) as Appointment;
        }),
        catchError((e) => {
          return of({} as Appointment);
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
