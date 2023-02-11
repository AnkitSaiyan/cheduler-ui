import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {AuthService} from 'src/app/core/services/auth.service';
import {DestroyableComponent} from '../../../../shared/components/destroyable/destroyable.component';
import {ScheduleAppointmentService} from '../../../../core/services/schedule-appointment.service';
import {ActivatedRoute, Router} from '@angular/router';
import {BehaviorSubject, filter, map, switchMap, take, takeUntil} from 'rxjs';
import {ModalService} from '../../../../core/services/modal.service';
import {
  ConfirmActionModalComponent,
  DialogData
} from '../../../../shared/components/confirm-action-modal/confirm-action-modal.component';
import {NotificationDataService} from 'src/app/core/services/notification-data.service';

@Component({
  selector: 'dfm-confirm-appointment',
  templateUrl: './confirm-appointment.component.html',
  styleUrls: ['./confirm-appointment.component.scss'],
})
export class ConfirmAppointmentComponent extends DestroyableComponent implements OnInit, OnDestroy {
  public referDoctorCheckbox = new FormControl('', []);
  public consentCheckbox = new FormControl('', []);

  public basicDetails!: any;

  public examDetails!: any;

  public slotDetails!: any;

  public isConfirmed = false;

  public isCanceled = false;

  public isEdited = false;

  public examIdToName: { [key: number]: { name: string; info: string } } = {};

  public exams$$ = new BehaviorSubject<any>(null);

  appointmentId: any;

  constructor(
    private authService: AuthService,
    private scheduleAppointmentSvc: ScheduleAppointmentService,
    private router: Router,
    private route: ActivatedRoute,
    private modalSvc: ModalService,
    private notificationSvc: NotificationDataService,
  ) {
    super();
  }

  public ngOnInit(): void {
    this.router.navigate([], {
      queryParams: null,
    });

    this.scheduleAppointmentSvc.examDetails$.pipe(takeUntil(this.destroy$$)).subscribe((examDetails) => {
      console.log('examDetails: ', examDetails);
      this.examDetails = examDetails;
    });

    this.scheduleAppointmentSvc.exams$
      .pipe(takeUntil(this.destroy$$))
      .subscribe((exams) => {
        exams.filter((exam) => this.examDetails?.exams?.indexOf((exam.id)) !== -1).forEach((exam) => {
          this.examIdToName[+exam.id] = {name: exam.name, info: exam.info};
        });
        this.exams$$.next(exams);
      });

    this.scheduleAppointmentSvc.basicDetails$.pipe(takeUntil(this.destroy$$)).subscribe((basicDetails) => {
      this.basicDetails = basicDetails;
    });

    this.scheduleAppointmentSvc.slotDetails$.pipe(takeUntil(this.destroy$$)).subscribe((slotDetails) => {
      this.slotDetails = slotDetails;
    });
  }

  public override ngOnDestroy() {
    super.ngOnDestroy();
  }

  displayValue(value: any) {
    console.log('value: ', value);
  }

  public checkBoxStatus() {
    return !(Boolean(this.referDoctorCheckbox.value) && Boolean(this.consentCheckbox.value));
  }

  public confirmAppointment() {
    this.router.navigate([], {
      queryParams: {
        c: true,
      },
    });
    // this.authService.isPending.next(this.isPending);
    this.scheduleAppointmentSvc.basicDetails$.subscribe((basicDetail: any) => {
      console.log('basicDetail: ', basicDetail);
      this.basicDetails = basicDetail;
    });
    this.scheduleAppointmentSvc.examDetails$.subscribe((examDetail: any) => {
      console.log('examDetail: ', examDetail);
      this.examDetails = examDetail;
    });
    this.scheduleAppointmentSvc.slotDetails$.subscribe((timeSlot: any) => {
      console.log('timeSlot: ', timeSlot);
      this.slotDetails = timeSlot;
    });
    console.log('this.slotDetails: ', this.slotDetails);

    console.log('this.examDetails: ', this.examDetails);
    console.log('this.basicDetails: ', this.basicDetails);

    const requestData = {
      ...this.basicDetails,
      ...this.examDetails,
      ExamList: [this.examDetails.id],
      StartedAt: '10-10-2021',
    };

    console.log('requestData: ', requestData);

    if (requestData) {
      this.scheduleAppointmentSvc
        .addAppointment(requestData)
        .pipe(
          map((response) => {
            console.log('response', response);
            this.appointmentId = response.id;
            localStorage.setItem('appointmentId', this.appointmentId);
            return response;
          }),
        )
        .subscribe(() => {
          this.isConfirmed = true;
          this.notificationSvc.showNotification(`Appointment added successfully`);
        });
    }
  }

  editAppointment() {
    this.isConfirmed = true;
    this.isEdited = true;
    if (!this.appointmentId) {
      this.appointmentId = localStorage.getItem('appointmentId');
    }

    const requestData = {
      ...this.basicDetails,
      ...this.examDetails,
      ExamList: [this.examDetails.id],
      StartedAt: '10-10-2021',
      appointmentId: this.appointmentId ? this.appointmentId : '',
    };

    console.log('requestData: ', requestData);

    if (requestData) {
      this.scheduleAppointmentSvc
        .updateAppointment$(requestData)
        .pipe(map((response) => response))
        .subscribe(() => {
          this.isConfirmed = true;
          this.notificationSvc.showNotification(`Appointment updated successfully`);
        });
    }
  }

  public cancelAppointment() {
    const modalRef = this.modalSvc.open(ConfirmActionModalComponent, {
      data: {
        bodyText: 'Are you sure you want to cancel this appointment',
      } as DialogData,
    });

    modalRef.closed
      .pipe(
        filter((res: boolean) => res),
        switchMap(() => this.scheduleAppointmentSvc.cancelAppointment$(this.appointmentId)),
        take(1),
      )
      .subscribe((result) => {
        if (result) {
          this.isCanceled = true;
          this.isConfirmed = false;
          this.notificationSvc.showNotification('Appointment canceled successfully');
        }
      });
  }
}
