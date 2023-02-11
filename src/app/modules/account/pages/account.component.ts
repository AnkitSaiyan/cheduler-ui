import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {NotificationService} from 'diflexmo-angular-design';
import {filter, take, takeUntil} from 'rxjs';
import {ModalService} from 'src/app/core/services/modal.service';
import {NotificationDataService} from 'src/app/core/services/notification-data.service';
import {
  ConfirmActionModalComponent
} from 'src/app/shared/components/confirm-action-modal/confirm-action-modal.component';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ScheduleAppointmentService} from "../../../core/services/schedule-appointment.service";
import {DestroyableComponent} from "../../../shared/components/destroyable/destroyable.component";

export interface DialogData {
  titleText: string;
  bodyText: string;
  confirmButtonText: string;
  cancelButtonText: string;
}

@Component({
  selector: 'dfm-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent extends DestroyableComponent implements OnInit, OnDestroy {
  isrevokedPermission: boolean = false;
  public userForm!: FormGroup;

  constructor(
    private modalSvc: ModalService,
    private notificationSvc: NotificationDataService,
    private router: Router,
    private fb: FormBuilder,
    private scheduleAppointmentSvc: ScheduleAppointmentService
  ) {
    super();
  }

  public ngOnInit(): void {
    this.scheduleAppointmentSvc.basicDetails$.pipe(takeUntil(this.destroy$$)).subscribe((userDetails) => {
      this.createForm(userDetails);
    });
  }

  private createForm(userDetails?) {
    this.userForm = this.fb.group({
      firstname: [userDetails?.firstname, [Validators.required]],
      lastname: [userDetails?.lastname, []],
      email: [userDetails?.email, [Validators.required]],
      phone: [userDetails?.phone, [Validators.required]],
    })
  }

  checkRevokeStatus() {
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
        this.isrevokedPermission = true;
        this.notificationSvc.showNotification('Absence deleted successfully');
        return this.isrevokedPermission;
      });
  }

  displayDeletePopup() {
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

  public saveDetails() {
    if (this.userForm.invalid) {
      return;
    }

    this.scheduleAppointmentSvc.setBasicDetails(this.userForm.value);
    this.notificationSvc.showNotification('Details saved successfully');
  }
}
