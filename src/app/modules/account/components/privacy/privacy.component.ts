import {Component, OnInit} from '@angular/core';
import {filter, Observable, of, switchMap, take} from 'rxjs';
import {Router} from '@angular/router';
import {AuthService} from 'src/app/core/services/auth.service';
import {UserManagementService} from 'src/app/core/services/user-management.service';
import {NotificationDataService} from '../../../../core/services/notification-data.service';
import {ModalService} from '../../../../core/services/modal.service';
import {
  ConfirmActionModalComponent,
  DialogData
} from '../../../../shared/components/confirm-action-modal/confirm-action-modal.component';
import {Permits} from '../../../../shared/models/user-permits.model';

@Component({
  selector: 'dfm-privacy',
  styleUrls: ['./privacy.component.scss'],
  templateUrl: './privacy.component.html',
})
export class PrivacyComponent implements OnInit {
  public allPermits$: Observable<Permits[] | undefined> = of(undefined);

  constructor(
    private modalSvc: ModalService,
    private notificationSvc: NotificationDataService,
    private router: Router,
    private authService: AuthService,
    private userManagement: UserManagementService,
  ) {}

  ngOnInit(): void {
    this.allPermits$ = this.authService.authUser$.pipe(
      filter(Boolean),
      switchMap((user) => this.userManagement.getAllPermits(user.id)),
    );
  }

  public revokePermit(tenantId: string) {
    const modalRef = this.modalSvc.open(ConfirmActionModalComponent, {
      data: {
        bodyText: 'Areyousurewantorevokeaccess',
        confirmButtonText: 'Proceed',
      } as DialogData,
    });

    modalRef.closed
      .pipe(
        filter((res: boolean) => res),
        switchMap(() => this.authService.authUser$),
        switchMap((user) => this.userManagement.revokePermit(user?.id!, tenantId)),
        take(1),
      )
      .subscribe({
        next: () => this.notificationSvc.showNotification('Revoke permits successfully'),
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
          this.notificationSvc.showNotification('Account deleted successfully');
        }
      });
  }
}
