import {Component, OnDestroy, OnInit} from '@angular/core';
import {DestroyableComponent} from "../destroyable/destroyable.component";
import {BehaviorSubject, takeUntil} from "rxjs";
import {LandingService} from "../../../core/services/landing.service";

@Component({
  selector: 'dfm-sub-header',
  templateUrl: './sub-header.component.html',
  styleUrls: ['./sub-header.component.scss']
})
export class SubHeaderComponent extends DestroyableComponent implements OnInit, OnDestroy {
  public info$$: BehaviorSubject<any>;

  constructor(private landingService: LandingService) {
    super();
    this.info$$ = new BehaviorSubject<any>(null);
  }

  public ngOnInit(): void {
    this.landingService.siteDetails$.pipe(takeUntil(this.destroy$$)).subscribe((res) => {
      this.info$$.next(JSON.parse(res['data'].introductoryText));
    });
  }

  public override ngOnDestroy() {
    super.ngOnDestroy();
  }
}
