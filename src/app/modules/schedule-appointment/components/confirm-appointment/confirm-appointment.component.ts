import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {AuthService} from 'src/app/core/services/auth.service';
import {DestroyableComponent} from '../../../../shared/components/destroyable/destroyable.component';
import {ScheduleAppointmentService} from '../../../../core/services/schedule-appointment.service';
import {ActivatedRoute, Router} from '@angular/router';
import {BehaviorSubject, filter, combineLatest, of, switchMap, take, takeUntil} from 'rxjs';
import {ModalService} from '../../../../core/services/modal.service';
import {
  ConfirmActionModalComponent,
  DialogData
} from '../../../../shared/components/confirm-action-modal/confirm-action-modal.component';
import {NotificationDataService} from 'src/app/core/services/notification-data.service';
import {DatePipe} from "@angular/common";
import {Appointment} from "../../../../shared/models/appointment.model";
import {ExamDetails, SlotDetails} from "../../../../shared/models/local-storage-data.model";

@Component({
  selector: 'dfm-confirm-appointment',
  templateUrl: './confirm-appointment.component.html',
  styleUrls: ['./confirm-appointment.component.scss'],
})
export class ConfirmAppointmentComponent extends DestroyableComponent implements OnInit, OnDestroy {
  public referDoctorCheckbox = new FormControl('', []);
  public consentCheckbox = new FormControl('', []);

  public basicDetails!: any;

  public examDetails!: ExamDetails;

  public slotDetails!: SlotDetails;


  public examIdToName: { [key: number]: { name: string; info: string } } = {};

  public exams$$ = new BehaviorSubject<any>(null);

  public appointment$$ = new BehaviorSubject<Appointment | null>(null);

  public appointmentId$$ = new BehaviorSubject<number | null>(null);

  public loading$$ = new BehaviorSubject(true);

  public slots: string[] = []

  constructor(
    private authService: AuthService,
    private scheduleAppointmentSvc: ScheduleAppointmentService,
    private router: Router,
    private route: ActivatedRoute,
    private modalSvc: ModalService,
    private notificationSvc: NotificationDataService,
    private datePipe: DatePipe,
  ) {
    super();
  }

  public ngOnInit(): void {
    const appointmentId = localStorage.getItem('appointmentId');
    if (appointmentId) {
      this.appointmentId$$.next(+appointmentId);
    }

    combineLatest([this.appointmentId$$]).pipe(
      switchMap(([id]) => {
        if (id) {
          return this.scheduleAppointmentSvc.getAppointmentByID$(+id);
        }
        return of({});
      }),
      takeUntil(this.destroy$$)
    ).subscribe((appointment) => {
      this.appointment$$.next(appointment as Appointment);

      this.router.navigate([], {
        queryParams: this.appointment$$.value?.id ? {c: true} : null,
        replaceUrl: true
      });

      this.loading$$.next(false);

      console.log(appointment);
    }, (err) => {
      this.loading$$.next(false);
      this.appointment$$.next(null);
    });


    this.scheduleAppointmentSvc.examDetails$.pipe(takeUntil(this.destroy$$)).subscribe((examDetails) => {
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
      if (slotDetails.selectedSlots) {
        const slotValues = Object.values(slotDetails.selectedSlots);

        if (slotValues?.length) {
          this.slots = slotValues.map((slot) => (slot as string).split('-')?.map((time) => time.slice(0, -3)).join(' - '))
        }
      }
    });
  }

  public override ngOnDestroy() {
    super.ngOnDestroy();
  }

  public checkBoxStatus() {
    return !(Boolean(this.referDoctorCheckbox.value) && Boolean(this.consentCheckbox.value));
  }

  public confirmAppointment() {
    // this.router.navigate([], {
    //   queryParams: {
    //     c: true,
    //   },
    // });

    const requestData = {
      ...this.basicDetails,
      doctorId: this.examDetails.physician,
      examList: this.examDetails.exams,
      startedAt: this.datePipe.transform(this.slotDetails.selectedDate, 'yyyy-MM-dd')
    };

    console.log('requestData: ', requestData);

    if (requestData) {
      this.scheduleAppointmentSvc
        .addAppointment(requestData)
        .pipe(takeUntil(this.destroy$$))
        .subscribe((res) => {
          localStorage.setItem('appointmentId', res?.id.toString());
          this.appointmentId$$.next(res?.id);
          this.notificationSvc.showNotification(`Appointment added successfully`)
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
        switchMap(() => {
          if (this.appointment$$.value?.id) {
            return this.scheduleAppointmentSvc.cancelAppointment$(+this.appointment$$.value.id)
          }
          return of({});
        }),
        take(1),
      )
      .subscribe((res) => {
        if (res) {
          this.notificationSvc.showNotification('Appointment canceled successfully');
        }
      });
  }
}
