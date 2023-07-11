import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from 'src/app/core/services/auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {combineLatest, Observable, take, takeUntil} from 'rxjs';
import {ScheduleAppointmentService} from '../../../../core/services/schedule-appointment.service';
import {DestroyableComponent} from '../../../../shared/components/destroyable/destroyable.component';

@Component({
  selector: 'dfm-basic-detail',
  templateUrl: './basic-detail.component.html',
  styleUrls: ['./basic-detail.component.scss'],
})
export class BasicDetailComponent extends DestroyableComponent implements OnInit, OnDestroy {
  // displayBasicDetails: boolean = false;
  public basicDetailsForm!: FormGroup;

  public isLoggedIn$!: Observable<boolean>;

  public editData: any;

  private EMAIL_REGEX: RegExp = /(.+)@(.+){1,}\.(.+){2,}/;

  public patientSSN= new FormControl('');

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
    this.authService.authUser$.subscribe(console.log);
    combineLatest([this.authService.authUser$, this.scheduleAppointmentSvc.basicDetails$])
      .pipe(takeUntil(this.destroy$$))
      .subscribe(([userDetail, basicDetails]) => {
        const formData = userDetail
          ? {
              patientFname: userDetail?.givenName,
              patientLname: userDetail?.surname,
              patientEmail: userDetail.email,
              patientTel: userDetail.properties?.['extension_PhoneNumber'],
              socialSecurityNumber: userDetail.socialSecurityNumber,
            }
          : basicDetails;

        this.createForm(formData);
        setTimeout(() => {
        if (userDetail) {
            this.basicDetailsForm.patchValue({
              patientFname: userDetail?.givenName,
              patientLname: userDetail?.surname,
              patientTel: userDetail.properties?.['extension_PhoneNumber'],
              patientEmail: userDetail.email,
              socialSecurityNumber: userDetail.socialSecurityNumber,
            });
            Object.keys(this.basicDetailsForm.controls).forEach((control) => this.basicDetailsForm.get(control)?.disable());
          }
          if(userDetail?.socialSecurityNumber){
            this.patientSSN.setValue(userDetail.socialSecurityNumber);
            this.patientSSN.disable();
          }else{
            this.patientSSN.setValue(basicDetails.socialSecurityNumber ?? "");
          }
        }, 0);
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

  public saveBasicDetails() {
    if (this.basicDetailsForm.invalid) {
      return;
    }

    if (this.editData) {
      this.editData.patientFname = this.basicDetailsForm.controls['patientFname'].value;
      this.editData.patientLname = this.basicDetailsForm.controls['patientLname'].value;
      this.editData.patientTel = this.basicDetailsForm.controls['patientTel'].value;
      this.editData.patientEmail = this.basicDetailsForm.controls['patientEmail'].value;
      this.editData.socialSecurityNumber = this.basicDetailsForm.controls['socialSecurityNumber'].value;
      localStorage.setItem('appointmentDetails', JSON.stringify(this.editData));
    }

    this.scheduleAppointmentSvc.setBasicDetails({...this.basicDetailsForm.value, socialSecurityNumber: this.patientSSN.value });
    this.router.navigate(['../confirm'], { relativeTo: this.route, replaceUrl: true });
  }

  public logInUser() {
    this.authService.loginWithRedirect().pipe(take(1)).subscribe();
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

  private createForm(basicDetails, isDisable = false) {
    console.log(basicDetails);
    this.basicDetailsForm = this.fb.group({
      patientFname: [{ value: basicDetails?.patientFname, disabled: isDisable }, [Validators.required]],
      patientLname: [{ value: basicDetails?.patientLname, disabled: isDisable }, [Validators.required]],
      patientTel: [{ value: basicDetails?.patientTel, disabled: isDisable }, [Validators.required]],
      patientEmail: [{ value: basicDetails?.patientEmail, disabled: isDisable }, [Validators.required]],
      socialSecurityNumber: [{ value: basicDetails?.socialSecurityNumber, disabled: isDisable }],
    });

  }
}
