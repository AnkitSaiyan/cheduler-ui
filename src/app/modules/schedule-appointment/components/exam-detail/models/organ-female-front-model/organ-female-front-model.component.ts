import { Component, OnDestroy, OnInit } from '@angular/core';
import { ExamService } from 'src/app/core/services/exam.service';
import { AnatomyMatMenu } from 'src/app/shared/components/anatomy-mat-menu/anatomy-mat-menu';
import { BodyFemaleFront } from 'src/app/shared/utils/anatomy.enum';

@Component({
  selector: 'dfm-organ-female-front-model',
  templateUrl: './organ-female-front-model.component.html',
  styleUrls: ['./organ-female-front-model.component.scss'],
})
export class OrganFemaleFrontModelComponent extends AnatomyMatMenu<BodyFemaleFront> implements OnDestroy {
  public category = BodyFemaleFront;
  constructor(public examSvc: ExamService) {
    super();
  }

  public override ngOnDestroy(): void {
    super.ngOnDestroy();
  }
}

