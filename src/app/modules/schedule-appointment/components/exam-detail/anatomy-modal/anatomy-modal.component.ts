import { Component, OnInit } from '@angular/core';
import { ModalService } from 'src/app/core/services/modal.service';

@Component({
  selector: 'dfm-anatomy-modal',
  templateUrl: './anatomy-modal.component.html',
  styleUrls: ['./anatomy-modal.component.scss'],
})
export class AnatomyModalComponent implements OnInit {
  constructor(private dialogSvc: ModalService) {}

  public selectedExam: any = {};

  ngOnInit() {}

  public clickTest(name: string) {
    console.log(name);
  }

  public close() {
    this.dialogSvc.close();
  }

  public onExamSelect(category: string, exam: string) {
    if (this.selectedExam[category]) {
      if (this.selectedExam[category].find((value) => value === exam)) {
        this.selectedExam[category] = [...this.selectedExam[category].filter((value) => value !== exam)];
        if (!this.selectedExam[category].length) {
          delete this.selectedExam[category];
        }
      } else {
        this.selectedExam[category] = [...this.selectedExam[category], exam];
      }
    } else {
      this.selectedExam[category] = [exam];
    }
  }
}

