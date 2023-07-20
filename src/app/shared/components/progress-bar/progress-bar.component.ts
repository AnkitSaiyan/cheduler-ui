import {Component, OnDestroy, OnInit} from '@angular/core';
import {DestroyableComponent} from "../destroyable/destroyable.component";
import {RouterStateService} from "../../../core/services/router-state.service";
import {takeUntil} from "rxjs";

@Component({
  selector: 'dfm-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss'],
})
export class ProgressBarComponent extends DestroyableComponent implements OnInit, OnDestroy {
  public url!: string;

  public urlObj = {
    'referral-physician': 0,
    exam: 1,
    slot: 2,
    'basic-details': 3,
    confirm: 4,
  };

  public status: string = '';

  constructor(private routerStateSvc: RouterStateService) {
    super();
  }

  public ngOnInit(): void {
    this.routerStateSvc.listenForUrlChange$().pipe(takeUntil(this.destroy$$)).subscribe((url) => {
      const urlArr = url.split('/');
      if (urlArr?.length) {
        this.url = urlArr[urlArr.length - 1];
      }
    });

    this.routerStateSvc.listenForQueryParamsChanges$().pipe(takeUntil(this.destroy$$)).subscribe((queryParams) => {
      this.status = queryParams['s'];
    });
  }

  public override ngOnDestroy() {
    super.ngOnDestroy();
  }
}
