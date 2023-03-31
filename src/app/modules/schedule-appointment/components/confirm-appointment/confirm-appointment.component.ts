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
import { SiteSettings } from '../../../../shared/models/site-management.model';
import { LandingService } from '../../../../core/services/landing.service';

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

  public siteDetails$$: BehaviorSubject<SiteSettings>;

  public editData: any;

  public edit: boolean = false;

  public isEdit$$ = new BehaviorSubject<boolean>(false);

  public isButtonDisable$$ = new BehaviorSubject<boolean>(false);

  constructor(
    private authService: AuthService,
    private scheduleAppointmentSvc: ScheduleAppointmentService,
    private router: Router,
    private route: ActivatedRoute,
    private modalSvc: ModalService,
    private notificationSvc: NotificationDataService,
    private datePipe: DatePipe,
    private landingSvc: LandingService,
  ) {
    super();
    this.siteDetails$$ = new BehaviorSubject<any>(null);
    if (localStorage.getItem('edit')) {
      this.isEdit$$.next(true);
    }
  }

  public ngOnInit(): void {
    this.siteDetails$$.next(JSON.parse(localStorage.getItem('siteDetails') || '{}')?.data);

    if (localStorage.getItem('appointmentDetails')) {
      this.editData = JSON.parse(localStorage.getItem('appointmentDetails') || '');
      if (this.editData) {
        this.edit = true;
      }
    }

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
          localStorage.setItem('appointmentDetails', JSON.stringify(appointment));

          if (appointment?.id && !this.isEdit$$.value) {
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
          this.slots = slotValues.map((slot) =>
            (slot['slot'] as string)
              .split('-')
              ?.map((time) => time.slice(0, -3))
              .join(' - '),
          );
        }
      }
    });

    // if (localStorage.getItem('appointmentId') && localStorage.getItem('edit')) {
    //   this.confirmAppointment();
    // }
  }

  public override ngOnDestroy() {
    super.ngOnDestroy();
  }

  public checkBoxStatus() {
    if (this.siteDetails$$.value?.doctorReferringConsent === 1) {
      return !this.referDoctorCheckbox.value && !this.consentCheckbox.value;
    }

    return !this.consentCheckbox.value;
  }

  public confirmAppointment() {
    // this.router.navigate([], {
    //   queryParams: {
    //     c: true,
    //   },
    // });

    this.isButtonDisable$$.next(true);

    const selectedTimeSlot = this.slotDetails.selectedSlots;
    const combinableSelectedTimeSlot = { ...Object.values(selectedTimeSlot)[0] };
    delete combinableSelectedTimeSlot.userList;
    delete combinableSelectedTimeSlot.roomList;
    delete combinableSelectedTimeSlot.slot;

    const requestData: any = {
      ...this.basicDetails,
      doctorId: this.examDetails.physician,
      date: this.dateDistributedToString(this.dateToDateDistributed(this.slotDetails.selectedDate ?? new Date())),
      slot: combinableSelectedTimeSlot?.exams?.length
        ? combinableSelectedTimeSlot
        : {
            examId: 0,
            start: '',
            end: '',
            exams: Object.keys(this.slotDetails.selectedSlots).map((examID) => {
              const examDetails = {
                examId: +examID,
                rooms: selectedTimeSlot[+examID]?.roomList ?? [],
                users: selectedTimeSlot[+examID]?.userList ?? [],
              };

              if (selectedTimeSlot[+examID]) {
                const time = selectedTimeSlot[+examID].slot.split('-');
                const start = time[0].split(':');
                const end = time[1].split(':');

                examDetails['start'] = selectedTimeSlot[+examID]?.examStart ?? `${start[0]}:${start[1]}:00`;
                examDetails['end'] = selectedTimeSlot[+examID]?.examEnd ?? `${end[0]}:${end[1]}:00`;
              } else {
                const time = selectedTimeSlot[0].slot.split('-');
                const start = time[0].split(':');
                const end = time[1].split(':');

                examDetails['start'] = selectedTimeSlot[0]?.examStart ?? `${start[0]}:${start[1]}:00`;
                examDetails['end'] = selectedTimeSlot[0]?.examEnd ?? `${end[0]}:${end[1]}:00`;
              }

              return examDetails;
            }),
          },
    };

    if (requestData) {
      if (this.edit || localStorage.getItem('appointmentId')) {
        requestData['appointmentId'] = localStorage.getItem('appointmentId');
        this.scheduleAppointmentSvc
          .updateAppointment$({ ...requestData, fromPatient: true })
          .pipe(takeUntil(this.destroy$$))
          .subscribe(
            (res) => {
              // localStorage.setItem('appointmentId', res?['id'].toString());
              // this.appointmentId$$.next(res?['id']);
              localStorage.removeItem('appointmentDetails');
              this.notificationSvc.showNotification(`Appointment updated successfully`);
              // this.router.navigate(['/appointment']);
              localStorage.removeItem('edit');
              this.isEdit$$.next(false);
              this.isButtonDisable$$.next(false);
            },
            () => this.isButtonDisable$$.next(false),
          );
      } else {
        this.scheduleAppointmentSvc
          .addAppointment(requestData)
          .pipe(takeUntil(this.destroy$$))
          .subscribe(
            (res) => {
              localStorage.setItem('appointmentId', res?.id.toString());
              localStorage.removeItem('appointmentDetails');
              this.appointmentId$$.next(res?.id);
              this.notificationSvc.showNotification(`Appointment added successfully`);
              this.isButtonDisable$$.next(false);
            },
            () => this.isButtonDisable$$.next(false),
          );
      }
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
          this.scheduleAppointmentSvc.resetDetails();
          this.notificationSvc.showNotification('Appointment cancelled successfully');
        }
      });
  }

  private dateDistributedToString(date: any, separator = '-'): string {
    return `${date.year}${separator}${date.month}${separator}${date.day}`;
  }

  private dateToDateDistributed(date: Date): any {
    if (!date) {
      return {};
    }

    return {
      year: new Date(date).getFullYear(),
      month: new Date(date).getMonth() + 1,
      day: new Date(date).getDate(),
    };
  }

  public onEdit() {
    localStorage.setItem('edit', 'true');
  }

  public onAddNewAppointment() {
    this.scheduleAppointmentSvc.resetDetails(true);
  }
}
























































