import {Component, OnDestroy, OnInit} from '@angular/core';
import {DestroyableComponent} from "../../../../shared/components/destroyable/destroyable.component";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ModalService} from "../../../../core/services/modal.service";
import {NotificationDataService} from "../../../../core/services/notification-data.service";
import {Router} from "@angular/router";
import {ScheduleAppointmentService} from "../../../../core/services/schedule-appointment.service";
import {filter, take, takeUntil} from "rxjs";
import {
  ConfirmActionModalComponent, DialogData
} from "../../../../shared/components/confirm-action-modal/confirm-action-modal.component";

@Component({
  selector: 'dfm-account',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent extends DestroyableComponent implements OnInit, OnDestroy {
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

  public saveDetails() {
    if (this.userForm.invalid) {
      return;
    }

    this.scheduleAppointmentSvc.setBasicDetails(this.userForm.value);
    this.notificationSvc.showNotification('Details saved successfully');
  }
}
