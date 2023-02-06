import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from 'src/app/core/services/auth.service';
import {Location} from '@angular/common';
import {take, takeUntil} from 'rxjs';
import {DestroyableComponent} from "../destroyable/destroyable.component";
import {RouterStateService} from "../../../core/services/router-state.service";

@Component({
  selector: 'dfm-sub-header',
  templateUrl: './sub-header.component.html',
  styleUrls: ['./sub-header.component.scss']
})
export class SubHeaderComponent extends DestroyableComponent implements OnInit, OnDestroy {
  items: any = [
    {
      name: 'EN',
      value: 'EN',
      discription: '',
    },
    {
      name: 'NL',
      value: 'NL',
      discription: '',
    }
  ];

  constructor() {
    super();
  }

  public ngOnInit(): void {
  }

  public override ngOnDestroy() {
    super.ngOnDestroy();
  }
}
