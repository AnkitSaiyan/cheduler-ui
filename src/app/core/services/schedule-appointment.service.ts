import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, of} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ScheduleAppointmentService {
  private examDetails$$ = new BehaviorSubject<any>({});

  private slotDetails$$ = new BehaviorSubject<any>({});

  private basicDetails$$ = new BehaviorSubject<any>({});

  constructor() {
  }

  public setExamDetails(reqData) {
    this.examDetails$$.next(reqData);
  }

  public get examDetails$(): Observable<any> {
    return this.examDetails$$.asObservable();
  }

  public setSlotDetails(reqData) {
    this.slotDetails$$.next(reqData);
  }

  public get slotDetails$(): Observable<any> {
    return this.slotDetails$$.asObservable();
  }

  public setBasicDetails(reqData) {
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
}
