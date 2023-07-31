import { Component, OnDestroy, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs';
import { ExamService } from 'src/app/core/services/exam.service';
import { AnatomyMatMenu } from 'src/app/shared/components/anatomy-mat-menu/anatomy-mat-menu';
import { BodyMaleBack } from 'src/app/shared/utils/anatomy.enum';
import { BodyType } from 'src/app/shared/utils/const';

@Component({
  selector: 'dfm-organ-male-back-model',
  templateUrl: './organ-male-back-model.component.html',
  styleUrls: ['./organ-male-back-model.component.scss'],
})
export class OrganMaleBackModelComponent extends AnatomyMatMenu<BodyMaleBack> implements OnDestroy {
  public category = BodyMaleBack;
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




