import {Component, OnDestroy, OnInit} from '@angular/core';
import {DestroyableComponent} from "../destroyable/destroyable.component";

@Component({
  selector: 'dfm-sub-header',
  templateUrl: './sub-header.component.html',
  styleUrls: ['./sub-header.component.scss']
})
export class SubHeaderComponent extends DestroyableComponent implements OnInit, OnDestroy {
  constructor() {
    super();
  }

  public ngOnInit(): void {
  }

  public override ngOnDestroy() {
    super.ngOnDestroy();
  }
}
