import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ExamService } from 'src/app/core/services/exam.service';
import { AnatomyMatMenu } from 'src/app/shared/components/anatomy-mat-menu/anatomy-mat-menu';
import { Skeleton } from 'src/app/shared/utils/anatomy.enum';

@Component({
  selector: 'dfm-skeleton-male-front-model',
  templateUrl: './skeleton-male-front-model.component.html',
  styleUrls: ['./skeleton-male-front-model.component.scss'],
})
export class SkeletonMaleFrontModelComponent extends AnatomyMatMenu<Skeleton> implements OnDestroy {
  public category = Skeleton;
  constructor(public examSvc: ExamService) {
    super();
  }

  public override ngOnDestroy(): void {
    super.ngOnDestroy();
  }
}

