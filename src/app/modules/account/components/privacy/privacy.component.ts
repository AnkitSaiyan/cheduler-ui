import {Component, OnInit} from '@angular/core';
import {
  ConfirmActionModalComponent, DialogData
} from "../../../../shared/components/confirm-action-modal/confirm-action-modal.component";
import { filter, Observable, of, switchMap, take } from 'rxjs';
import { ModalService } from '../../../../core/services/modal.service';
import { NotificationDataService } from '../../../../core/services/notification-data.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { UserManagementService } from 'src/app/core/services/user-management.service';

@Component({
  selector: 'dfm-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.scss'],
})
export class PrivacyComponent implements OnInit {
  public isRevokedPermission: boolean = false;

  public allPermits$: Observable<any> = of(null);

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

  public checkRevokeStatus(tenantId: string) {
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
      .subscribe(() => {
        this.isRevokedPermission = true;
        this.notificationSvc.showNotification('Revoke permits successfully');
        return this.isRevokedPermission;
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
        switchMap(() => this.authService.logout$()),
        take(1),
      )
      .subscribe(() => {
        this.notificationSvc.showNotification('Account deleted successfully');
      });
  }
}












