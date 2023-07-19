import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, take, takeUntil } from 'rxjs';
import { ExamService } from 'src/app/core/services/exam.service';
import { ModalService } from 'src/app/core/services/modal.service';
import { NameValue } from 'src/app/shared/models/name-value.model';

@Component({
  selector: 'dfm-anatomy-model',
  templateUrl: './anatomy-model.component.html',
  styleUrls: ['./anatomy-model.component.scss'],
})
export class AnatomyModelComponent implements OnInit {
  constructor(private dialogSvc: ModalService, private fb: FormBuilder, public examSvc: ExamService) {}

  public filterForm!: FormGroup;

  public addExamForm!: FormGroup;

  public filter = [
    {
      name: 'Body Structure',
      formName: 'bodyStructure',
      children: [
        {
          name: 'Body',
          value: 'organs',
        },
        {
          name: 'Bones',
          value: 'bones',
        },
      ],
    },
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
      bodyStructure: ['organs', [Validators.required]],
      side: ['front', [Validators.required]],
    });

    this.addExamForm = this.fb.group({
      exam: [null, []],
      comments: ['', []],
    });

    this.filterForm.get('bodyStructure')?.valueChanges.subscribe((value) => {
      if (value === 'bones') {
        this.filterForm.patchValue({ gender: 'male', side: 'front' }, { emitEvent: false, onlySelf: true });
      }
    });

    this.examSvc.getExams().pipe(take(1)).subscribe();
  }

  public clickTest(name: string) {
    console.log(name);
  }

  public close() {
    this.dialogSvc.close();
  }

  public onExamSelect(value: string) {
    const [category, exam] = value.split(this.examSvc.separator);
    this.examSvc.addExam(category as any, exam, true);
    this.addExamForm.get('exam')?.reset();
  }
}



















