import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {AuthService} from 'src/app/core/services/auth.service';
import {DestroyableComponent} from "../../../../shared/components/destroyable/destroyable.component";
import {ScheduleAppointmentService} from "../../../../core/services/schedule-appointment.service";
import {ActivatedRoute, Router} from "@angular/router";
import {takeUntil} from "rxjs";

@Component({
  selector: 'dfm-confirm-appointment',
  templateUrl: './confirm-appointment.component.html',
  styleUrls: ['./confirm-appointment.component.scss'],
})
export class ConfirmAppointmentComponent extends DestroyableComponent implements OnInit, OnDestroy {
  public referDoctorCheckbox = new FormControl('', []);
  public consentCheckbox = new FormControl('', []);
  displayBasicDetails: boolean = false;

  public basicDetails!: any;

  public examDetails!: any;

  public slotDetails!: any;

  public isConfirmed = false;

  public isCanceled = false;

  constructor(
    private authService: AuthService,
    private scheduleAppointmentSvc: ScheduleAppointmentService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    super();
  }

  public ngOnInit(): void {
    this.router.navigate([], {
      queryParams: null
    })

    this.scheduleAppointmentSvc.basicDetails$.pipe(takeUntil(this.destroy$$)).subscribe((basicDetails) => {
      this.basicDetails = basicDetails;
    });

    this.scheduleAppointmentSvc.examDetails$.pipe(takeUntil(this.destroy$$)).subscribe((examDetails) => {
      this.examDetails = examDetails;
    });

    this.scheduleAppointmentSvc.slotDetails$.pipe(takeUntil(this.destroy$$)).subscribe((slotDetails) => {
      this.slotDetails = slotDetails;
    });

    this.authService.isLoggedInUser.subscribe((user: boolean) => {
      user === true ? (this.displayBasicDetails = false) : (this.displayBasicDetails = true);
    });

    this.displayBasicDetails = !Boolean(localStorage.getItem('user'));
  }

  public override ngOnDestroy() {
    super.ngOnDestroy();
  }


  displayValue(value: any) {
    console.log('value: ', value);
  }

  public checkBoxStatus() {
    return !(Boolean(this.referDoctorCheckbox.value) && Boolean(this.consentCheckbox.value));
  }

  public confirmAppointment() {
    this.isConfirmed = true;
    this.router.navigate([], {
      queryParams: {
        c: true,
      }
    })
    // this.authService.isPending.next(this.isPending);
  }
}
