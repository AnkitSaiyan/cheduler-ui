import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest, filter, Observable, of, switchMap, take, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { ScheduleAppointmentService } from 'src/app/core/services/schedule-appointment.service';
import { DestroyableComponent } from 'src/app/shared/components/destroyable/destroyable.component';
import { ModalService } from '../../../../core/services/modal.service';
import { ConfirmActionModalComponent, DialogData } from '../../../../shared/components/confirm-action-modal/confirm-action-modal.component';
import { NotificationDataService } from 'src/app/core/services/notification-data.service';
import { Router } from '@angular/router';
import { ExamDetails } from 'src/app/shared/models/local-storage-data.model';
import { LoaderService } from 'src/app/core/services/loader.service';

@Component({
  selector: 'dfm-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.scss'],
})
export class AppointmentComponent extends DestroyableComponent implements OnInit, OnDestroy {
  viewAll: boolean = false;

  public isAppointemntScheduled: boolean = true;

  public isLoggedIn$!: Observable<boolean>;

  private appointments$$: BehaviorSubject<any[]>;

  public filteredAppointments$$: BehaviorSubject<any[] | null>;

  private completedAppointments$$: BehaviorSubject<any[]>;

  public filteredCompletedAppointments$$: BehaviorSubject<any[] | null>;

  monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  constructor(
    private scheduleAppointmentService: ScheduleAppointmentService,
    private authSvc: AuthService,
    private modalSvc: ModalService,
    private notificationSvc: NotificationDataService,
    private scheduleAppointmentSvc: ScheduleAppointmentService,
    private router: Router,
    public loaderSvc: LoaderService,
  ) {
    super();
    this.appointments$$ = new BehaviorSubject<any[]>([]);
    this.filteredAppointments$$ = new BehaviorSubject<any[] | null>(null);
    this.completedAppointments$$ = new BehaviorSubject<any[]>([]);
    this.filteredCompletedAppointments$$ = new BehaviorSubject<any[] | null>(null);
    this.scheduleAppointmentService.resetDetails(true);
    localStorage.removeItem('appointmentDetails');
  }

  ngOnInit(): void {
    this.isLoggedIn$ = this.authSvc.isLoggedIn$;
    this.scheduleAppointmentService.upcommingAppointment$.pipe(takeUntil(this.destroy$$)).subscribe((appointments) => {
      if (!appointments['0']) {
        this.isAppointemntScheduled = false;
        return;
      }
      this.isAppointemntScheduled = true;
      this.appointments$$.next(appointments);
      this.filteredAppointments$$.next(appointments);
    });

    this.scheduleAppointmentService.completedAppointment$.pipe(takeUntil(this.destroy$$)).subscribe((completedAppointments) => {
      if (!completedAppointments['0']) {
        this.isAppointemntScheduled = false;
        return;
      }
      this.isAppointemntScheduled = true;
      this.completedAppointments$$.next(completedAppointments);
      this.filteredCompletedAppointments$$.next(completedAppointments);
    });
  }

  monthName(date) {
    const d = new Date(date);
    return this.monthNames[d.getMonth()];
  }

  cancelAppointment(id: number) {
    const modalRef = this.modalSvc.open(ConfirmActionModalComponent, {
      data: {
        bodyText: 'Are you sure you want to cancel this appointment',
      } as DialogData,
    });

    modalRef.closed
      .pipe(
        filter((res: boolean) => res),
        switchMap(() => {
          if (id) {
            return this.scheduleAppointmentSvc.cancelAppointment$(+id);
          }
          return of({});
        }),
        take(1),
      )
      .subscribe((res) => {
        if (res) {
          this.notificationSvc.showNotification('Appointment canceled successfully');
          this.ngOnInit();
        }
      });
  }

  editAppointment(item: any) {
    // const examDetails = {};
    // examDetails['appointmentId'] = item['id'];
    this.scheduleAppointmentService
      .getAppointmentByID$(item.id)
      .pipe(takeUntil(this.destroy$$))
      .subscribe((appointment) => {
        const editData = appointment;
        const exams: ExamDetails = {
          exams: editData['exams'] ? editData['exams'].map((exam) => exam.id) : [],
          physician: editData['doctorId'] ? editData['doctorId'] : '',
          comments: editData['comments'] ? editData['comments'] : '',
        };
        this.scheduleAppointmentSvc.setExamDetails(exams);
        localStorage.setItem('appointmentDetails', JSON.stringify(appointment));
        localStorage.setItem('appointmentId', item.id);
        localStorage.setItem('edit', 'true');
        this.scheduleAppointmentService.editDetails$$.next({ isEdit: true, id: item.id });
        this.router.navigate(['/dashboard/schedule/slot']);
      });
  }
}














