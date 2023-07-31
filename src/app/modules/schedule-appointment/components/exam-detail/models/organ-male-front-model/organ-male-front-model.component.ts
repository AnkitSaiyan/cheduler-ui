import { Component, OnDestroy } from '@angular/core';
import { ExamService } from 'src/app/core/services/exam.service';
import { AnatomyMatMenu } from 'src/app/shared/components/anatomy-mat-menu/anatomy-mat-menu';
import { BodyMaleFront } from 'src/app/shared/utils/anatomy.enum';
import { BodyType } from 'src/app/shared/utils/const';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'dfm-organ-male-front-model',
  templateUrl: './organ-male-front-model.component.html',
  styleUrls: ['./organ-male-front-model.component.scss'],
})
export class OrganMaleFrontModelComponent extends AnatomyMatMenu<BodyMaleFront> implements OnDestroy {
  constructor(public examSvc: ExamService) {
    super();
    this.examSvc.selectedCategory$$.pipe(takeUntil(this.destroy$$)).subscribe(res => {
      if (!res && this.previousElement) this.previousElement?.classList.remove('fill');
    });
  }
  public category = BodyMaleFront;
  public gender = BodyType;
  private previousElement!: HTMLElement;
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



















































