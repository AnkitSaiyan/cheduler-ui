import { Component, OnInit, OnDestroy } from '@angular/core';
import { BehaviorSubject, filter, Observable, of, switchMap, take, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { UserManagementService } from 'src/app/core/services/user-management.service';
import { NotificationDataService } from '../../../../core/services/notification-data.service';
import { ModalService } from '../../../../core/services/modal.service';
import { ConfirmActionModalComponent, DialogData } from '../../../../shared/components/confirm-action-modal/confirm-action-modal.component';
import { Permits } from '../../../../shared/models/user-permits.model';
import { ScheduleAppointmentService } from 'src/app/core/services/schedule-appointment.service';
import { ChangeStatusRequestData } from 'src/app/shared/models/appointment.model';
import { Translate } from '../../../../shared/models/translate.model';
import { ShareDataService } from 'src/app/services/share-data.service';
import { DUTCH_BE, ENG_BE } from '../../../../shared/utils/const';
import { DestroyableComponent } from '../../../../shared/components/destroyable/destroyable.component';

@Component({
  selector: 'dfm-privacy',
  styleUrls: ['./privacy.component.scss'],
  templateUrl: './privacy.component.html',
})
export class PrivacyComponent extends DestroyableComponent implements OnInit, OnDestroy {
  public allPermits$: Observable<Permits[] | undefined> = of(undefined);
  private selectedLang!: string;
  private allUpcomingAppointment$$ = new BehaviorSubject<ChangeStatusRequestData[]>([]);

  constructor(
    private modalSvc: ModalService,
    private notificationSvc: NotificationDataService,
    private router: Router,
    private authService: AuthService,
    private userManagement: UserManagementService,
    private appointmentSvc: ScheduleAppointmentService,
    private shareDataSvc: ShareDataService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.allPermits$ = this.authService.authUser$.pipe(
      filter(Boolean),
      switchMap((user) => this.userManagement.getAllPermits(user.id)),
    );
    this.appointmentSvc.upcomingAppointments$.pipe(take(1)).subscribe((data) => {
      this.allUpcomingAppointment$$.next(data?.map(({ id }) => ({ id, status: 2 })));
    });
    this.shareDataSvc
      .getLanguage$()
      .pipe(takeUntil(this.destroy$$))
      .subscribe((lang) => {
        this.selectedLang = lang;
      });
  }

  public revokePermit(tenantId: string) {
    const modalRef = this.modalSvc.open(ConfirmActionModalComponent, {
      data: {
        bodyText: 'RevokeAccessConfirmationPopUp',
        confirmButtonText: 'Proceed',
      } as DialogData,
    });

    modalRef.closed
      .pipe(
        filter((res: boolean) => res),
        switchMap(() => this.appointmentSvc.cancelMultipleAppointment$(this.allUpcomingAppointment$$.value)),
        switchMap(() => this.authService.authUser$),
        switchMap((user) => this.userManagement.revokePermit(user?.id!, tenantId)),
        take(1),
      )
      .subscribe({
        next: () => this.notificationSvc.showNotification(Translate.Success.RevokePermits[this.selectedLang]),
      });
  }

  public displayDeletePopup() {
    this.modalSvc
      .open(ConfirmActionModalComponent, {
        data: {
          bodyText: 'Areyousurewanttodelete',
          confirmButtonText: 'Delete',
        } as DialogData,
      })
      .closed.pipe(
        filter((res: boolean) => res),
        switchMap(() => this.authService.authUser$),
        switchMap((user) => this.userManagement.deleteUser(user?.id!)),
        take(1),
      )
      .subscribe({
        next: () => {
          this.authService.logout();
          this.notificationSvc.showNotification(Translate.Success.AccountDeletedSuccessfully[this.selectedLang]);
        },
      });
  }

}
