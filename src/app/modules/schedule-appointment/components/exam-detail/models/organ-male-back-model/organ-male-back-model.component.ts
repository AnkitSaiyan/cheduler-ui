import { Component, OnDestroy, OnInit } from '@angular/core';
import { ExamService } from 'src/app/core/services/exam.service';
import { AnatomyMatMenu } from 'src/app/shared/components/anatomy-mat-menu/anatomy-mat-menu';
import { BodyMaleBack } from 'src/app/shared/utils/anatomy.enum';

@Component({
  selector: 'dfm-organ-male-back-model',
  templateUrl: './organ-male-back-model.component.html',
  styleUrls: ['./organ-male-back-model.component.scss'],
})
export class OrganMaleBackModelComponent extends AnatomyMatMenu<BodyMaleBack> implements OnDestroy {
  public category = BodyMaleBack;
  constructor(public examSvc: ExamService) {
    super();
  }

  public override ngOnDestroy(): void {
    super.ngOnDestroy();
  }
}

