import {Component, OnInit} from '@angular/core';
import {
  ConfirmActionModalComponent, DialogData
} from "../../../../shared/components/confirm-action-modal/confirm-action-modal.component";
import {filter, take} from "rxjs";
import {ModalService} from "../../../../core/services/modal.service";
import {NotificationDataService} from "../../../../core/services/notification-data.service";
import {Router} from "@angular/router";

@Component({
  selector: 'dfm-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.scss']
})
export class PrivacyComponent implements OnInit {
  public isRevokedPermission: boolean = false;

  constructor(
    private modalSvc: ModalService,
    private notificationSvc: NotificationDataService,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
  }

  public checkRevokeStatus() {
    const modalRef = this.modalSvc.open(ConfirmActionModalComponent, {
      data: {
        bodyText: 'Are you sure you want to revoke  access to your personal information for this lab?',
        confirmButtonText: 'Proceed',
      } as DialogData,
    });

    modalRef.closed
      .pipe(
        filter((res: boolean) => res),
        take(1),
      )
      .subscribe(() => {
        this.isRevokedPermission = true;
        this.notificationSvc.showNotification('Absence deleted successfully');
        return this.isRevokedPermission;
      });
  }

  public displayDeletePopup() {
    const modalRef = this.modalSvc.open(ConfirmActionModalComponent, {
      data: {
        bodyText: 'Are you sure you want to delete your account?',
        confirmButtonText: 'Delete',
      } as DialogData,
    });

    modalRef.closed
      .pipe(
        filter((res: boolean) => res),
        take(1),
      )
      .subscribe(() => {
        this.notificationSvc.showNotification('Account deleted successfully');
        localStorage.clear();
        this.router.navigate(['/auth/login']);
      });
  }

}
