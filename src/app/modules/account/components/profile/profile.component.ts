import {Component, OnDestroy, OnInit} from '@angular/core';
import {DestroyableComponent} from "../../../../shared/components/destroyable/destroyable.component";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {NotificationDataService} from "../../../../core/services/notification-data.service";
import { take, takeUntil} from "rxjs";
import { AuthService } from 'src/app/core/services/auth.service';
import { UserManagementService } from 'src/app/core/services/user-management.service';

@Component({
  selector: 'dfm-account',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent extends DestroyableComponent implements OnInit, OnDestroy {
  isrevokedPermission: boolean = false;
  public userForm!: FormGroup;
  private EMAIL_REGEX: RegExp = /^([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;

  private userId!: string;

  constructor(
    private notificationSvc: NotificationDataService,
    private fb: FormBuilder,
    private authService: AuthService,
    private userManagementSvc: UserManagementService,
  ) {
    super();
  }

  public ngOnInit(): void {
    this.authService.authUser$.pipe(takeUntil(this.destroy$$)).subscribe((userDetail) => {
      this.userId = userDetail?.id!;
      this.createForm({
        patientFname: userDetail?.givenName,
        patientLname: userDetail?.surname,
        patientEmail: userDetail?.email,
        patientTel: userDetail?.properties?.['extension_PhoneNumber'],
        socialSecurityNumber: userDetail?.socialSecurityNumber,
      });
    });
  }

  private createForm(userDetails) {
    this.userForm = this.fb.group({
      givenName: [{ value: userDetails?.patientFname, disabled: false }, [Validators.required]],
      surname: [{ value: userDetails?.patientLname, disabled: false }, [Validators.required]],
      phone: [{ value: userDetails?.patientTel, disabled: false }, [Validators.required]],
      email: [{ value: userDetails?.patientEmail, disabled: true }, [Validators.required]],
      socialSecurityNumber: [{ value: userDetails?.patientEmail, disabled: false }],
    });
  }

  public saveDetails() {
    if (this.userForm.invalid) {
      return;
    }

    const { phone, ...rest } = this.userForm.value;

    this.userManagementSvc
      .patchUserProperties(this.userId, { properties: { extension_PhoneNumber: phone, ...rest } })
      .pipe(take(1))
      .subscribe(() => {
        this.notificationSvc.showNotification('Details saved successfully');
      });

  }
  public handleEmailInput(e: Event): void {
    const inputText = (e.target as HTMLInputElement).value;

    if (!inputText) {
      return;
    }

    if (!this.EMAIL_REGEX.exec(inputText)) {
      this.userForm.get('email')?.setErrors({
        email: true,
      });
    } else {
      this.userForm.get('email')?.setErrors(null);
    }
  }
}













