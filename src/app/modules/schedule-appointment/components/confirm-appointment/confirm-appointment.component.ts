import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { DestroyableComponent } from '../../../../shared/components/destroyable/destroyable.component';
import { ScheduleAppointmentService } from '../../../../core/services/schedule-appointment.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, combineLatest, filter, Observable, of, switchMap, take, takeUntil, tap } from 'rxjs';
import { ModalService } from '../../../../core/services/modal.service';
import { ConfirmActionModalComponent, DialogData } from '../../../../shared/components/confirm-action-modal/confirm-action-modal.component';
import { NotificationDataService } from 'src/app/core/services/notification-data.service';
import { DatePipe } from '@angular/common';
import { Appointment } from '../../../../shared/models/appointment.model';
import { ExamDetails, SlotDetails } from '../../../../shared/models/local-storage-data.model';
import { AppointmentStatus } from '../../../../shared/models/status';
import { SiteSettings } from '../../../../shared/models/site-management.model';
import { LandingService } from '../../../../core/services/landing.service';
import { UserManagementService } from 'src/app/core/services/user-management.service';
import { AuthUser } from '../../../../shared/models/user.model';
import { Translate } from 'src/app/shared/models/translate.model';
import { ShareDataService } from 'src/app/services/share-data.service';
import { DUTCH_BE, ENG_BE} from '../../../../shared/utils/const';
import {UtcToLocalPipe} from "../../../../shared/pipes/utc-to-local.pipe";

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
  public examIdToName: { [key: number]: { name: string; info: string; instructions: string } } = {};
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
  public isConsentGiven$$ = new BehaviorSubject<boolean>(false);
  private authUser: AuthUser | undefined;
  private selectedLang!: string;
  private appointmentRefresh$$ = new BehaviorSubject<undefined>(undefined);

  constructor(
    private authService: AuthService,
    private scheduleAppointmentSvc: ScheduleAppointmentService,
    private router: Router,
    private route: ActivatedRoute,
    private modalSvc: ModalService,
    private notificationSvc: NotificationDataService,
    private datePipe: DatePipe,
    private landingSvc: LandingService,
    private userManagementSvc: UserManagementService,
    private shareDataSvc: ShareDataService,
    private utcToLocalPipe: UtcToLocalPipe,
  ) {
    super();
    this.siteDetails$$ = new BehaviorSubject<any>(null);

    if (localStorage.getItem('edit')) {
      this.isEdit$$.next(true);
    }

    this.authService.authUser$
      .pipe(
        tap((user) => (this.authUser = user)),
        takeUntil(this.destroy$$),
        filter(Boolean),
        switchMap((user) => this.userManagementSvc.getAllPermits(user?.id)),
      )
      .subscribe((permits) => {
        this.isConsentGiven$$.next(!!permits.find(({ tenantId }) => tenantId === this.userManagementSvc.tenantId));
      });
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

    combineLatest([this.appointmentId$$, this.appointmentRefresh$$])
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
          if (Object.keys(appointment)?.length) {
            this.appointment$$.next(appointment as Appointment);
            localStorage.setItem('appointmentDetails', JSON.stringify(appointment));
          }

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
          this.examIdToName[+exam.id] = { name: exam.name, info: exam.info, instructions: exam.instructions ?? '' };
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
        } else if (this.editData?.exams) {
          this.slots = [...this.editData.exams].map((exam) => {
            const start = this.dateTo24TimeString(exam.startedAt);
            const end = this.dateTo24TimeString(exam.endedAt);
            return `${start}-${end}`;
          });
        }
      }
    });

    // if (localStorage.getItem('appointmentId') && localStorage.getItem('edit')) {
    //   this.confirmAppointment();
    // }
    this.shareDataSvc
      .getLanguage$()
      .pipe(takeUntil(this.destroy$$))
      .subscribe((lang) => {
        this.selectedLang = lang;
      });
  }

  public override ngOnDestroy() {
    super.ngOnDestroy();
  }

  public checkBoxStatus() {
    if (this.siteDetails$$.value?.doctorReferringConsent === 1) {
      if (this.isConsentGiven$$.value) return false;
      return !this.referDoctorCheckbox.value && !this.consentCheckbox.value;
    }

    if (this.isConsentGiven$$.value && this.referDoctorCheckbox.value) {
      return false;
    }

    return !(this.consentCheckbox.value && this.referDoctorCheckbox.value);
  }

  public confirmAppointment2() {
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
      ...(this.authUser?.id
        ? {
            patientAzureId: this.authUser.id,
            patientFname: null,
            patientLname: null,
            patientEmail: null,
            patientTel: null,
            socialSecurityNumber: null,
          }
        : this.basicDetails),
      doctorId: this.examDetails.physician,
      comments: this.examDetails?.comments,
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
      ...(localStorage.getItem('appointmentId')
        ? {
            fromPatient: true,
            appointmentId: localStorage.getItem('appointmentId'),
          }
        : {}),
    };

    let observable: Observable<any>;

    if (requestData) {
      if (localStorage.getItem('appointmentId')) {
        observable = this.scheduleAppointmentSvc.updateAppointment$(requestData);
      } else {
        observable = this.scheduleAppointmentSvc.addAppointment(requestData);
      }

      observable.pipe(takeUntil(this.destroy$$)).subscribe({
        next: (res) => {
          let successMsg = `Appointment added successfully`;

          if (localStorage.getItem('appointmentId')) {
            // on update
            localStorage.removeItem('appointmentDetails');
            successMsg = `Appointment updated successfully`;
            localStorage.removeItem('edit');
            this.isEdit$$.next(false);
          } else {
            // on add new
            this.appointmentId$$.next(res?.id);
          }

          this.notificationSvc.showNotification(successMsg);
          this.isButtonDisable$$.next(false);
        },
        error: (err) => {
          this.notificationSvc.showNotification(err.error?.message);
          this.isButtonDisable$$.next(false);
        },
      });

      if (!this.isConsentGiven$$.value && this.authUser) {
        this.userManagementSvc
          .createPropertiesPermit(this.authUser.id, this.userManagementSvc.tenantId)
          .pipe(takeUntil(this.destroy$$))
          .subscribe({
            error: (err) => this.notificationSvc.showNotification(err.error?.message),
          });
      }
    }
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

    let requestData: any = {
      ...(this.authUser?.id
        ? {
            patientAzureId: this.authUser.id,
            patientFname: null,
            patientLname: null,
            patientEmail: null,
            patientTel: null,
            socialSecurityNumber: null,
          }
        : this.basicDetails),
      doctorId: this.examDetails.physician,
      comments: this.examDetails?.comments,
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
      ...(localStorage.getItem('appointmentId')
        ? {
            fromPatient: true,
            appointmentId: localStorage.getItem('appointmentId'),
          }
        : {}),
    };
    if (this.landingSvc.siteSetting$$.value?.doctorReferringConsent === 1) {
      delete requestData.doctorId;
    }

    if (!requestData?.slot?.exams.length) {
      const exams = [...this.editData.exams].map((exam) => {
        const start = this.dateTo24TimeString(exam.startedAt);
        const end = this.dateTo24TimeString(exam.endedAt);
        const userList = exam.users?.filter((u) => +u.examId === +exam.id)?.map((u) => +u.id) || [];
        const roomList = [
          ...(exam.rooms
            ?.filter((r) => +r.examId === +exam.id)
            ?.map((r) => ({
              start: (r?.startedAt as string)?.slice(-8),
              end: (r?.endedAt as string)?.slice(-8),
              roomId: +r.id,
            })) || []),
        ];
        return { examId: exam.id, rooms: roomList, users: userList, start, end };
      });
      requestData.slot = { ...requestData?.slot, exams };
    }

    let timeZone = this.datePipe.transform(new Date(), 'ZZZZZ');

    if (timeZone && timeZone[0] === '+') {
      timeZone = timeZone.slice(1);
    }

    requestData = {
      ...requestData,
      patientTimeZone: timeZone ?? '',
    };

    if (requestData) {
      if (localStorage.getItem('appointmentId')) {
        requestData['appointmentId'] = localStorage.getItem('appointmentId');
        this.authService.isLoggedIn$
          .pipe(
            takeUntil(this.destroy$$),
            switchMap((isLoggedIn) =>
              this.scheduleAppointmentSvc.updateAppointment$(
                isLoggedIn
                  ? {
                      ...requestData,
                      patientFname: null,
                      patientLname: null,
                      patientEmail: null,
                      patientTel: null,
                      socialSecurityNumber: null,
                      fromPatient: true,
                    }
                  : { ...requestData, fromPatient: true },
              ),
            ),
          )
          .subscribe(
            (res) => {
              // localStorage.setItem('appointmentId', res?['id'].toString());
              // this.appointmentId$$.next(res?['id']);
              localStorage.removeItem('appointmentDetails');
              this.notificationSvc.showNotification(Translate.Success.AppointmentUpdatedSuccessfully[this.selectedLang]);
              // this.router.navigate(['/appointment']);
              localStorage.removeItem('edit');
              this.isEdit$$.next(false);
              this.isButtonDisable$$.next(false);
              this.createPermit();
              this.appointmentRefresh$$.next(undefined);
              this.router.navigate([], {
                queryParams: {
                  s: 'a',
                },
              });
            },
            () => this.isButtonDisable$$.next(false),
          );
      } else {
        this.authService.isLoggedIn$
          .pipe(
            takeUntil(this.destroy$$),
            switchMap((isLoggedIn) =>
              this.scheduleAppointmentSvc.addAppointment(
                isLoggedIn
                  ? {
                      ...requestData,
                      patientFname: null,
                      patientLname: null,
                      patientEmail: null,
                      patientTel: null,
                      socialSecurityNumber: null,
                    }
                  : { ...requestData },
              ),
            ),
          )
          .subscribe(
            (res) => {
              localStorage.setItem('appointmentId', res?.id.toString());
              localStorage.removeItem('appointmentDetails');
              this.appointmentId$$.next(res?.id);
              this.notificationSvc.showNotification(Translate.Success.AppointmentAddedSuccessfully[this.selectedLang]);
              this.isButtonDisable$$.next(false);
              this.appointmentRefresh$$.next(undefined);
              this.createPermit();
              this.router.navigate([], {
                queryParams: {
                  s: 'a',
                },
              });
            },
            () => this.isButtonDisable$$.next(false),
          );
      }
    }
  }

  public cancelAppointment() {
    const modalRef = this.modalSvc.open(ConfirmActionModalComponent, {
      data: {
        bodyText: 'AreYouSureYouWantToCancelThisAppointment',
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

  public onEdit() {
    localStorage.setItem('edit', 'true');
    localStorage.setItem('appointmentDetails', JSON.stringify(this.appointment$$.value));
  }

  public onAddNewAppointment() {
    this.scheduleAppointmentSvc.resetDetails(true);
    this.router.navigate(['../exam'], {
      relativeTo: this.route,
    });
  }

  private createPermit() {
    if (!this.isConsentGiven$$.value) {
      this.authService.authUser$
        .pipe(
          take(1),
          filter(Boolean),
          switchMap((user) => this.userManagementSvc.createPropertiesPermit(user.id, this.userManagementSvc.tenantId)),
        )
        .subscribe();
    }
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

  private dateTo24TimeString(date: Date): string {
    if (!date) {
      return '';
    }

    const newDate = new Date(date);

    const minutes = newDate.getMinutes().toString();

    return `${newDate.getHours()}:${minutes.length < 2 ? `0${minutes}` : minutes}:00`;
  }

  public getSlotsInLocal(slots: string[]): string[] {
    return slots.map((slot) => {
      const [start, end] = slot.split('-');
      return `${this.utcToLocalPipe.transform(start, true)}-${this.utcToLocalPipe.transform(end, true)}`;
    });
  }
}
