import { Component, OnInit } from '@angular/core';
import {map, Observable, take} from 'rxjs';
import { ScheduleAppointmentService } from 'src/app/core/services/schedule-appointment.service';
import { AuthService } from '../../../../core/services/auth.service';
import { LandingService } from '../../../../core/services/landing.service';

@Component({
  selector: 'dfm-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
})
export class OverviewComponent implements OnInit {
  public isLoggedIn$!: Observable<boolean>;

  public userName$!: Observable<string | undefined>;

  public siteSetting: any;

  constructor(private authSvc: AuthService, public sharedService: LandingService, private scheduleAppointmentSvc: ScheduleAppointmentService) {}

  public ngOnInit(): void {
    this.isLoggedIn$ = this.authSvc.isLoggedIn$;
    this.userName$ = this.authSvc.authUser$.pipe(map((user) => user?.displayName));

    this.sharedService.siteDetails$
      .pipe(
        map((exams) => {
          this.siteSetting = exams.data;
          localStorage.setItem('siteDetails', JSON.stringify(exams));
        }),
      )
      .subscribe();
  }

  removeEditStorage() {
    this.scheduleAppointmentSvc.resetDetails(true);
  }

  login() {
    this.authSvc.loginWithRedirect().pipe(take(1)).subscribe();
  }
}
