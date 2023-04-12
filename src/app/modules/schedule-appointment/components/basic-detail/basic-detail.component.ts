import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { ScheduleAppointmentService } from '../../../../core/services/schedule-appointment.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DestroyableComponent } from '../../../../shared/components/destroyable/destroyable.component';
import { BehaviorSubject, combineLatest, Observable, takeUntil } from 'rxjs';
import { SiteSettings } from '../../../../shared/models/site-management.model';
import { filter } from 'lodash';

@Component({
  selector: 'dfm-basic-detail',
  templateUrl: './basic-detail.component.html',
  styleUrls: ['./basic-detail.component.scss'],
})
export class BasicDetailComponent extends DestroyableComponent implements OnInit, OnDestroy {
  // displayBasicDetails: boolean = false;
  public basicDetailsForm!: FormGroup;

  public isLoggedIn$!: Observable<boolean>;

  private EMAIL_REGEX: RegExp = /(.+)@(.+){1,}\.(.+){2,}/;

  public editData: any;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private scheduleAppointmentSvc: ScheduleAppointmentService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    super();
  }

  public ngOnInit(): void {
    combineLatest([this.authService.authUser$, this.scheduleAppointmentSvc.basicDetails$])
      .pipe(takeUntil(this.destroy$$))
      .subscribe(([userDetail, basicDetails]) => {
        const formData = userDetail
          ? {
              patientFname: userDetail?.givenName,
              patientLname: userDetail?.surname,
              patientEmail: userDetail.email,
              patientTel: userDetail.properties?.['extension_PhoneNumber'],
            }
          : basicDetails;
        this.createForm(formData, !!userDetail);
      });

    if (localStorage.getItem('appointmentDetails')) {
      this.editData = JSON.parse(localStorage.getItem('appointmentDetails') || '');
      if (this.editData) {
        this.basicDetailsForm.patchValue(this.editData);
      }
    }

    this.isLoggedIn$ = this.authService.isLoggedIn$;

    // this.displayBasicDetails = Boolean(localStorage.getItem('user'))
    // this.authService.isLoggedInUser.subscribe((user: boolean) => {
    //   (user === true) ? this.displayBasicDetails = false : this.displayBasicDetails = true;
    // })
  }

  private createForm(basicDetails, isDisable = false) {
    this.basicDetailsForm = this.fb.group({
      patientFname: [{ value: basicDetails?.patientFname, disabled: isDisable }, [Validators.required]],
      patientLname: [{ value: basicDetails?.patientLname, disabled: isDisable }, [Validators.required]],
      patientTel: [{ value: basicDetails?.patientTel, disabled: isDisable }, [Validators.required]],
      patientEmail: [{ value: basicDetails?.patientEmail, disabled: isDisable }, [Validators.required]],
    });
  }

  public saveBasicDetails() {
    if (this.basicDetailsForm.invalid) {
      return;
    }

    if (this.editData) {
      this.editData['patientFname'] = this.basicDetailsForm.controls['patientFname'].value;
      this.editData['patientLname'] = this.basicDetailsForm.controls['patientLname'].value;
      this.editData['patientTel'] = this.basicDetailsForm.controls['patientTel'].value;
      this.editData['patientEmail'] = this.basicDetailsForm.controls['patientEmail'].value;
      localStorage.setItem('appointmentDetails', JSON.stringify(this.editData));
    }

    this.scheduleAppointmentSvc.setBasicDetails(this.basicDetailsForm.value);
    this.router.navigate(['../confirm'], { relativeTo: this.route });
  }

  logInUser() {
    this.authService
      .login$()
      .pipe()
      .subscribe(() => {
        this.router.navigate(['/dashboard']);
      });
  }

  public handleEmailInput(e: Event): void {
    const inputText = (e.target as HTMLInputElement).value;

    if (!inputText) {
      return;
    }

    if (!inputText.match(this.EMAIL_REGEX)) {
      this.basicDetailsForm.get('patientEmail')?.setErrors({
        email: true,
      });
    } else {
      this.basicDetailsForm.get('patientEmail')?.setErrors(null);
    }
  }
}

















