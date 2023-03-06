import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { DestroyableComponent } from '../../../../shared/components/destroyable/destroyable.component';
import { ScheduleAppointmentService } from '../../../../core/services/schedule-appointment.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, combineLatest, filter, Observable, of, switchMap, take, takeUntil } from 'rxjs';
import { ModalService } from '../../../../core/services/modal.service';
import { ConfirmActionModalComponent, DialogData } from '../../../../shared/components/confirm-action-modal/confirm-action-modal.component';
import { NotificationDataService } from 'src/app/core/services/notification-data.service';
import { DatePipe } from '@angular/common';
import { Appointment } from '../../../../shared/models/appointment.model';
import { ExamDetails, SlotDetails } from '../../../../shared/models/local-storage-data.model';
import { AppointmentStatus } from '../../../../shared/models/status';

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

  public isLoggedIn$!: Observable<boolean>;

  public slots: string[] = [];

  public appointmentStatusEnum = AppointmentStatus;

  siteDetails$$: BehaviorSubject<any>;

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
    this.siteDetails$$ = new BehaviorSubject<any[]>([]);
  }

  public ngOnInit(): void {
    this.siteDetails$$.next(JSON.parse(localStorage.getItem('siteDetails') || '{}'));

    const appointmentId = localStorage.getItem('appointmentId');
    if (appointmentId) {
      this.appointmentId$$.next(+appointmentId);
    }

    this.isLoggedIn$ = this.authService.isLoggedIn$;

    combineLatest([this.appointmentId$$])
      .pipe(
        switchMap(([id]) => {
          if (id) {
            return this.scheduleAppointmentSvc.getAppointmentByID$(+id);
          }
          return of({} as Appointment);
        }),
        takeUntil(this.destroy$$),
      )
      .subscribe(
        (appointment) => {
          this.appointment$$.next(appointment as Appointment);

          if (appointment?.id) {
            let s: string;
            switch (appointment.approval) {
              case AppointmentStatus.Cancelled:
                s = 'c';
                break;
              case AppointmentStatus.Approved:
                s = 'a';
                break;
              default:
                s = 'p';
            }

            this.router.navigate([], {
              queryParams: { s },
              replaceUrl: true,
            });
          }

          this.loading$$.next(false);

          console.log(appointment);
        },
        (err) => {
          this.loading$$.next(false);
          this.appointment$$.next(null);
        },
      );

    this.scheduleAppointmentSvc.examDetails$.pipe(takeUntil(this.destroy$$)).subscribe((examDetails) => {
      this.examDetails = examDetails;
    });

    this.scheduleAppointmentSvc.exams$.pipe(takeUntil(this.destroy$$)).subscribe((exams) => {
      exams
        .filter((exam) => this.examDetails?.exams?.indexOf(exam.id) !== -1)
        .forEach((exam) => {
          this.examIdToName[+exam.id] = { name: exam.name, info: exam.info };
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
          console.log(slotValues);
          this.slots = slotValues.map((slot) =>
            (slot['slot'] as string)
              .split('-')
              ?.map((time) => time.slice(0, -3))
              .join(' - '),
          );
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

    let time;
    const examList: any = [];
    console.log(this.slotDetails.selectedSlots);
    Object.keys(this.slotDetails.selectedSlots).forEach((res) => {
      time = Object.values(this.slotDetails.selectedSlots[res].slot.split('-')[0].split(':'));
      examList.push({
        examId: this.slotDetails.selectedSlots[res].examId,
        startedAt: `${this.datePipe.transform(this.slotDetails.selectedDate, 'yyyy-MM-dd')} ${time[0]}:${time[1]}`,
        endedAt: `${this.datePipe.transform(this.slotDetails.selectedDate, 'yyyy-MM-dd')} ${time[0]}:${time[1]}`,
        userList: this.slotDetails.selectedSlots[res].userList,
        roomList: this.slotDetails.selectedSlots[res].roomList,
      });
    });

    // console.log(time);
    const requestData = {
      ...this.basicDetails,
      doctorId: this.examDetails.physician,
      examDetails: examList,
    };
    if (requestData) {
      this.scheduleAppointmentSvc
        .addAppointment(requestData)
        .pipe(takeUntil(this.destroy$$))
        .subscribe((res) => {
          localStorage.setItem('appointmentId', res?.id.toString());
          this.appointmentId$$.next(res?.id);
          this.notificationSvc.showNotification(`Appointment added successfully`);
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
            return this.scheduleAppointmentSvc.cancelAppointment$(+this.appointment$$.value.id);
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
