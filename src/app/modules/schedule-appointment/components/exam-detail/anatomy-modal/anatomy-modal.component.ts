import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, take, takeUntil } from 'rxjs';
import { ExamService } from 'src/app/core/services/exam.service';
import { ModalService } from 'src/app/core/services/modal.service';
import { NameValue } from 'src/app/shared/models/name-value.model';

@Component({
  selector: 'dfm-anatomy-modal',
  templateUrl: './anatomy-modal.component.html',
  styleUrls: ['./anatomy-modal.component.scss'],
})
export class AnatomyModalComponent implements OnInit {
  constructor(private dialogSvc: ModalService, private fb: FormBuilder, private examSvc: ExamService) {}

  public filterForm!: FormGroup;

  public addExamForm!: FormGroup;

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

  public bodyParts: any[] = [];

  public allexams: NameValue[] = [];

  public separator = ' :;: ';



  ngOnInit() {
    this.filterForm = this.fb.group({
      gender: ['male', [Validators.required]],
      bodyStructure: ['bones', [Validators.required]],
      side: ['front', [Validators.required]],
    });

    this.addExamForm = this.fb.group({
      exam: [null, []],
    });

    this.examSvc
      .getExams()
      .pipe(take(1))
      .subscribe((exams) => {
        console.log({ exams });
        this.bodyParts = Object.keys(exams).map((key) => {
          exams[key].forEach((exam) => this.allexams.push({ name: `${key} - ${exam.name}`, value: `${key}${this.separator}${exam.value}` }));
          return { name: key, value: key };
        });
      });
  }

  public clickTest(name: string) {
    console.log(name);
  }

  public close() {
    this.dialogSvc.close();
  }

  public onExamSelect(category: string, exam: string, resetForm = false) {
    console.log(category, exam);

    if (category === 'All') {
      category = exam.split(this.separator)[0];
      exam = exam.split(this.separator)[1];
    }

    console.log(category, exam);

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

    if (resetForm) {
      this.addExamForm.get('exam')?.reset();
    }
  }

  public isExamSelected(): boolean {
    return !!Object.keys(this.selectedExam).length;
  }
}










