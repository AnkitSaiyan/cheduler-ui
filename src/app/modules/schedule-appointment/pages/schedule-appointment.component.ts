import { Component, OnInit } from '@angular/core';
import { RouterStateService } from '../../../core/services/router-state.service';
import { DestroyableComponent } from '../../../shared/components/destroyable/destroyable.component';
import { Observable, combineLatest, filter, map, pairwise, takeUntil, tap } from 'rxjs';
import { ScheduleAppointmentService } from '../../../core/services/schedule-appointment.service';
import { Router, RoutesRecognized } from '@angular/router';
import { LandingService } from 'src/app/core/services/landing.service';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'dfm-schedule-appointment',
  templateUrl: './schedule-appointment.component.html',
  styleUrls: ['./schedule-appointment.component.scss'],
})
export class ScheduleAppointmentComponent extends DestroyableComponent implements OnInit, DestroyableComponent {
  public url!: string;

  public status!: string;

  public siteSetting: any;

  public isLoggedIn$!: Observable<boolean>;

  public userName$!: Observable<string | undefined>;

  constructor(private routerStateSvc: RouterStateService, private scheduleAppointmentSvc: ScheduleAppointmentService, private router: Router, private landingService: LandingService, private authSvc: AuthService) {
    super();

    this.routerStateSvc
      .listenForQueryParamsChanges$()
      .pipe(takeUntil(this.destroy$$))
      .subscribe((queryParams) => {
        if (queryParams) {
          this.status = queryParams['s'];
        }
      });
  }

  public ngOnInit(): void {

    this.landingService.siteDetails$
      .pipe(
        map((details) => {
          this.siteSetting = details?.data;
          localStorage.setItem('siteDetails', JSON.stringify(details));
        }),
    ).subscribe();
    
    this.isLoggedIn$ = this.authSvc.isLoggedIn$;
    this.userName$ = this.authSvc.authUser$.pipe(map((user) => user?.displayName));

    combineLatest([this.routerStateSvc.listenForUrlChange$(), this.scheduleAppointmentSvc.examDetails$])
      .pipe(takeUntil(this.destroy$$))
      .subscribe(([url, examDetails]) => {

        if (url.includes('confirm') && !Object.keys(examDetails).length) {
          this.router.navigate(['/', 'dashboard'], {
            replaceUrl: true,
            queryParams: null,
          });
        }
        this.url = url;
      });
  }

  public override ngOnDestroy() {
    super.ngOnDestroy();
  }
}
