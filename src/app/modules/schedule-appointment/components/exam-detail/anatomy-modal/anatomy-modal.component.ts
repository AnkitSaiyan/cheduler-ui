import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalService } from 'src/app/core/services/modal.service';

@Component({
  selector: 'dfm-anatomy-modal',
  templateUrl: './anatomy-modal.component.html',
  styleUrls: ['./anatomy-modal.component.scss'],
})
export class AnatomyModalComponent implements OnInit {
  constructor(private dialogSvc: ModalService, private fb: FormBuilder) {}

  public filterForm!: FormGroup;

  public selectedExam: any = {};

  public filter = [
    {
      name: 'Gender',
      formName: 'gender',
      children: [
        {
          name: 'Male',
          value: 'male',
        },
        {
          name: 'Female',
          value: 'female',
        },
      ],
    },
    {
      name: 'Body Structure',
      formName: 'bodyStructure',
      children: [
        {
          name: 'Bones',
          value: 'bones',
        },
        {
          name: 'Organs',
          value: 'organs',
        },
      ],
    },
    {
      name: 'Side',
      formName: 'side',
      children: [
        {
          name: 'Front',
          value: 'front',
        },
        {
          name: 'Back',
          value: 'back',
        },
      ],
    },
  ];

  ngOnInit() {
    this.filterForm = this.fb.group({
      gender: ['male', [Validators.required]],
      bodyStructure: ['bones', [Validators.required]],
      side: ['front', [Validators.required]],
    });
  }

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




