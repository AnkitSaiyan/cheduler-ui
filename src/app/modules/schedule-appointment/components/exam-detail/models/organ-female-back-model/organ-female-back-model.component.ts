import { Component, OnDestroy, OnInit } from '@angular/core';
import { ExamService } from 'src/app/core/services/exam.service';
import { AnatomyMatMenu } from 'src/app/shared/components/anatomy-mat-menu/anatomy-mat-menu';
import { BodyFemaleBack } from 'src/app/shared/utils/anatomy.enum';
import { takeUntil } from 'rxjs';
import { BodyType } from 'src/app/shared/utils/const';

@Component({
  selector: 'dfm-organ-female-back-model',
  templateUrl: './organ-female-back-model.component.html',
  styleUrls: ['./organ-female-back-model.component.scss'],
})
export class OrganFemaleBackModelComponent extends AnatomyMatMenu<BodyFemaleBack> implements OnDestroy {
  public category = BodyFemaleBack;
  public gender = BodyType;
  private previousElement!: HTMLElement;
  constructor(public examSvc: ExamService) {
    super();
    this.examSvc.selectedCategory$$.pipe(takeUntil(this.destroy$$)).subscribe(res => {
      if (!res && this.previousElement) this.previousElement?.classList.remove('fill');
    });
  }

  public override ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  public fillColor(ele:Event) {
    const element = ele.target as HTMLElement;
    element?.classList.toggle('fill');
    if (this.previousElement && this.previousElement?.id != element.id)
      this.previousElement?.classList.remove('fill');
    this.previousElement = element;
  }
}




