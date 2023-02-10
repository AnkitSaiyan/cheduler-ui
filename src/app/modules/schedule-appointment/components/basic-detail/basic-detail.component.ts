import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from 'src/app/core/services/auth.service';
import {ScheduleAppointmentService} from "../../../../core/services/schedule-appointment.service";
import {ActivatedRoute, Router} from "@angular/router";
import {DestroyableComponent} from "../../../../shared/components/destroyable/destroyable.component";
import {takeUntil} from "rxjs";

@Component({
  selector: 'dfm-basic-detail',
  templateUrl: './basic-detail.component.html',
  styleUrls: ['./basic-detail.component.scss']
})
export class BasicDetailComponent extends DestroyableComponent implements OnInit, OnDestroy {
  displayBasicDetails: boolean = false;
  public basicDetailsForm!: FormGroup;
  authSvc: any;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private scheduleAppointmentSvc: ScheduleAppointmentService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    super();
  }

  ngOnInit(): void {
    this.createForm();
    this.scheduleAppointmentSvc.basicDetails$.pipe(takeUntil(this.destroy$$)).subscribe((basicDetails) => {
      if (basicDetails) {
        this.createForm(basicDetails);
      }
    });
    this.displayBasicDetails = Boolean(localStorage.getItem('user'))
    this.authService.isLoggedInUser.subscribe((user: boolean) => {
      (user === true) ? this.displayBasicDetails = false : this.displayBasicDetails = true;
    })
  }

  private createForm(basicDetails?) {
    this.basicDetailsForm = this.fb.group({
      firstname: [basicDetails?.firstname, [Validators.required]],
      lastname: [basicDetails?.lastname, []],
      phone: [basicDetails?.phone, [Validators.required]],
      email: [basicDetails?.email, [Validators.required]]
    })
  }

  public saveBasicDetails() {
    if (this.basicDetailsForm.invalid) {
      return;
    }

    this.scheduleAppointmentSvc.setBasicDetails(this.basicDetailsForm.value);
    this.router.navigate(['../confirm'], {relativeTo: this.route});
  }
  logInUser(){
    this.authSvc.login$().pipe().subscribe(() => {
      this.router.navigate(['/dashboard']);
    });
  }
}
