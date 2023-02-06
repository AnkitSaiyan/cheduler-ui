import {Component, OnInit} from '@angular/core';
import {takeUntil} from 'rxjs';
import {DestroyableComponent} from "../../../shared/components/destroyable/destroyable.component";
import {RouterStateService} from "../../../core/services/router-state.service";

@Component({
  selector: 'dfm-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent extends DestroyableComponent implements OnInit, DestroyableComponent {
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
