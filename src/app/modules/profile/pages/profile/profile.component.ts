import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from 'diflexmo-angular-design';
import { filter, take } from 'rxjs';
import { ModalService } from 'src/app/core/services/modal.service';
import { NotificationDataService } from 'src/app/core/services/notification-data.service';
import { ConfirmActionModalComponent } from 'src/app/shared/components/confirm-action-modal/confirm-action-modal.component';

export interface DialogData {
  titleText: string;
  bodyText: string;
  confirmButtonText: string;
  cancelButtonText: string;
}

@Component({
  selector: 'dfm-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  isrevokedPermission: boolean = false;
  constructor(private modalSvc: ModalService, private notificationSvc: NotificationDataService, private router: Router) {}

  ngOnInit(): void {}

  checkRevokeStatus() {
    const modalRef = this.modalSvc.open(ConfirmActionModalComponent, {
      data: {
        titleText: 'Confirmation',
        bodyText: 'Are you sure you want to revoke  access to your personal information for this lab?',
        confirmButtonText: 'Proceed',
        cancelButtonText: 'Cancel',
      } as DialogData,
    });

    modalRef.closed
      .pipe(
        filter((res: boolean) => res),
        take(1),
      )
      .subscribe(() => {
        this.isrevokedPermission = true;
        this.notificationSvc.showNotification('Absence deleted successfully');
        return this.isrevokedPermission;
      });
  }

  displayDeletePopup() {
    const modalRef = this.modalSvc.open(ConfirmActionModalComponent, {
      data: {
        titleText: 'Confirmation',
        bodyText: 'Are you sure you want to delete your account?',
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
      } as DialogData,
    });

    modalRef.closed
      .pipe(
        filter((res: boolean) => res),
        take(1),
      )
      .subscribe(() => {
        this.notificationSvc.showNotification('Absence deleted successfully');
        this.router.navigate(['/auth/login']);
      });
  }
}
