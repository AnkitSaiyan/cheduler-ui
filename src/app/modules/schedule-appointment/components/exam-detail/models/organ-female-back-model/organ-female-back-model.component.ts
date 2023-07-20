import { Component, OnDestroy, OnInit } from '@angular/core';
import { ExamService } from 'src/app/core/services/exam.service';
import { AnatomyMatMenu } from 'src/app/shared/components/anatomy-mat-menu/anatomy-mat-menu';
import { BodyFemaleBack } from 'src/app/shared/utils/anatomy.enum';
import { BodyType } from 'src/app/shared/utils/const';

@Component({
  selector: 'dfm-organ-female-back-model',
  templateUrl: './organ-female-back-model.component.html',
  styleUrls: ['./organ-female-back-model.component.scss'],
})
export class OrganFemaleBackModelComponent extends AnatomyMatMenu<BodyFemaleBack> implements OnDestroy {
  public category = BodyFemaleBack;
  public gender = BodyType;
  constructor(public examSvc: ExamService) {
    super();
  }

  public override ngOnDestroy(): void {
    super.ngOnDestroy();
  }
}




