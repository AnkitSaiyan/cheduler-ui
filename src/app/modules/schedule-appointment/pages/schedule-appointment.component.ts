import { Component, OnInit } from '@angular/core';
import { RouterStateService } from '../../../core/services/router-state.service';
import { DestroyableComponent } from '../../../shared/components/destroyable/destroyable.component';
import { combineLatest, filter, pairwise, takeUntil } from 'rxjs';
import { ScheduleAppointmentService } from '../../../core/services/schedule-appointment.service';
import { Router, RoutesRecognized } from '@angular/router';

@Component({
  selector: 'dfm-schedule-appointment',
  templateUrl: './schedule-appointment.component.html',
  styleUrls: ['./schedule-appointment.component.scss'],
})
export class ScheduleAppointmentComponent extends DestroyableComponent implements OnInit, DestroyableComponent {
  public url!: string;

  public status!: string;

  constructor(private routerStateSvc: RouterStateService, private scheduleAppointmentSvc: ScheduleAppointmentService, private router: Router) {
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
    this.router.events
      .pipe(
        filter((e) => e instanceof RoutesRecognized),
        pairwise(),
      )
      .subscribe((event: any[]) => {
        console.log(event[0].urlAfterRedirects);
      });

    combineLatest([this.routerStateSvc.listenForUrlChange$(), this.scheduleAppointmentSvc.basicDetails$])
      .pipe(takeUntil(this.destroy$$))
      .subscribe(([url, basicDetails]) => {
        console.log(url.includes('confirm'), Object.keys(basicDetails).length, basicDetails);

        if (url.includes('confirm') && !Object.keys(basicDetails).length) {
          // this.router.navigate(['/', 'dashboard'], {
          //   replaceUrl: true,
          //   queryParams: null,
          // });
        }
        this.url = url;
      });
  }

  public override ngOnDestroy() {
    super.ngOnDestroy();
  }
}
