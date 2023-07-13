import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ExamService } from 'src/app/core/services/exam.service';

@Component({
  selector: 'dfm-organ-male-front-model',
  templateUrl: './organ-male-front-model.component.html',
  styleUrls: ['./organ-male-front-model.component.scss'],
})
export class OrganMaleFrontModelComponent implements OnDestroy {
  constructor(public examSvc: ExamService) {}

  private openedElement!: any;
  private clearTimeout!: any;
  public clickTest(name: string) {
    console.log(name);
  }
  public onMouseLeave(element: any, isFromModal: boolean = false) {
    if (this.clearTimeout) clearTimeout(this.clearTimeout);
    this.clearTimeout = setTimeout(() => {
      if (element !== this.openedElement) {
        element.closeMenu();
      }
    }, 100);
    if (isFromModal) {
      clearTimeout(this.clearTimeout);
      element.closeMenu();
      this.openedElement = undefined;
    }
  }
  public onMouseEnter(element: any) {
    this.openedElement = element;
  }
  ngOnDestroy(): void {
    clearTimeout(this.clearTimeout);
  }
}

