import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ExamService } from 'src/app/core/services/exam.service';
import { AnatomyMatMenu } from 'src/app/shared/components/anatomy-mat-menu/anatomy-mat-menu';
import { BodyMaleFront } from 'src/app/shared/utils/anatomy.enum';
import { BodyType } from 'src/app/shared/utils/const';

@Component({
  selector: 'dfm-organ-male-front-model',
  templateUrl: './organ-male-front-model.component.html',
  styleUrls: ['./organ-male-front-model.component.scss'],
})
export class OrganMaleFrontModelComponent extends AnatomyMatMenu<BodyMaleFront> implements OnDestroy {
  constructor(public examSvc: ExamService) {
    super();
  }
  public category = BodyMaleFront;
  public gender = BodyType;
  public override ngOnDestroy(): void {
    super.ngOnDestroy();
  }
}



















































