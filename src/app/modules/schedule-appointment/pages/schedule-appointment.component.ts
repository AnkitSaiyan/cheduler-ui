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

  constructor(private routerStateSvc: RouterStateService) {
    super();
  }

  public ngOnInit(): void {
    this.routerStateSvc.listenForUrlChange$().pipe(takeUntil(this.destroy$$)).subscribe((url) => this.url = url);
  }

  public override ngOnDestroy() {
    super.ngOnDestroy();
  }

}
