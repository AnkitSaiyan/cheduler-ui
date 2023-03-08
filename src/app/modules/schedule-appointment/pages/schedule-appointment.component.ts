import {Component, OnInit} from '@angular/core';
import {RouterStateService} from "../../../core/services/router-state.service";
import {DestroyableComponent} from "../../../shared/components/destroyable/destroyable.component";
import {takeUntil} from "rxjs";

@Component({
  selector: 'dfm-schedule-appointment',
  templateUrl: './schedule-appointment.component.html',
  styleUrls: ['./schedule-appointment.component.scss']
})
export class ScheduleAppointmentComponent extends DestroyableComponent implements OnInit, DestroyableComponent {
  public url!: string;

  public status!: string;

  constructor(private routerStateSvc: RouterStateService) {
    super();

    this.routerStateSvc.listenForQueryParamsChanges$().pipe(takeUntil(this.destroy$$)).subscribe((queryParams) => {
      if (queryParams) {
        this.status = queryParams['s'];
      }

      console.log(queryParams)
    });
  }

  public ngOnInit(): void {
    this.routerStateSvc.listenForUrlChange$().pipe(takeUntil(this.destroy$$)).subscribe((url) => {
      console.log(url)
      this.url = url
    });
  }

  public override ngOnDestroy() {
    super.ngOnDestroy();
  }

}
