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
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'dfm-account',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent extends DestroyableComponent implements OnInit, OnDestroy {
  isrevokedPermission: boolean = false;
  public userForm!: FormGroup;
  private EMAIL_REGEX: RegExp = /(.+)@(.+){1,}\.(.+){2,}/;

  constructor(
    private modalSvc: ModalService,
    private notificationSvc: NotificationDataService,
    private router: Router,
    private fb: FormBuilder,
    private scheduleAppointmentSvc: ScheduleAppointmentService,
    private authService: AuthService,
  ) {
    super();
  }

  public ngOnInit(): void {
    this.authService.authUser$.pipe(takeUntil(this.destroy$$)).subscribe((userDetail) => {
      this.createForm({
        patientFname: userDetail?.givenName,
        patientLname: userDetail?.surname,
        patientEmail: userDetail?.email,
        patientTel: userDetail?.properties?.['extension_PhoneNumber'],
      });
    });
  }

  private createForm(userDetails) {
    this.userForm = this.fb.group({
      firstname: [{ value: userDetails?.patientFname, disabled: true }, [Validators.required]],
      lastname: [{ value: userDetails?.patientLname, disabled: true }, [Validators.required]],
      phone: [{ value: userDetails?.patientTel, disabled: true }, [Validators.required]],
      email: [{ value: userDetails?.patientEmail, disabled: true }, [Validators.required]],
    });
  }

  public saveDetails() {
    if (this.userForm.invalid) {
      return;
    }

    this.scheduleAppointmentSvc.setBasicDetails(this.userForm.value);
    this.notificationSvc.showNotification('Details saved successfully');
  }
  public handleEmailInput(e: Event): void {
    const inputText = (e.target as HTMLInputElement).value;

    if (!inputText) {
      return;
    }

    if (!inputText.match(this.EMAIL_REGEX)) {
      this.userForm.get('email')?.setErrors({
        email: true,
      });
    } else {
      this.userForm.get('email')?.setErrors(null);
    }
  }
}





