import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ExamService } from 'src/app/core/services/exam.service';

@Component({
  selector: 'dfm-organ-male-front-model',
  templateUrl: './organ-male-front-model.component.html',
  styleUrls: ['./organ-male-front-model.component.scss'],
})
export class OrganMaleFrontModelComponent implements OnDestroy {
  constructor(public examSvc: ExamService) {}
  private openedElement: { category: string; element: any }[] = [];
  private clearTimeout!: any;

  public onMouseLeave(element: any, category: string, isFromModal: boolean = false) {
    if (this.clearTimeout) clearTimeout(this.clearTimeout);
    this.openedElement.push({ category, element });

    this.clearTimeout = setTimeout(() => {
      this.openedElement = this.openedElement.filter((value) => {
        value.element.closeMenu();
        return false;
      });
    }, 100);
    if (isFromModal) {
      clearTimeout(this.clearTimeout);
      element.closeMenu();
    }
  }
  public onMouseEnter(element: any, category: string) {
    this.openedElement = this.openedElement.filter((value) => {
      if (value.category !== category) {
        value.element.closeMenu();
        return false;
      }
      if (value.category === category) return false;
      return true;
    });
  }
  ngOnDestroy(): void {
    clearTimeout(this.clearTimeout);
  }
}








































