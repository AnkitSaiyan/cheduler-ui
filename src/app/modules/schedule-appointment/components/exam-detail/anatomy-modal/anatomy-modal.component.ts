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
  constructor(private dialogSvc: ModalService, private fb: FormBuilder, public examSvc: ExamService) {}

  public filterForm!: FormGroup;

  public addExamForm!: FormGroup;

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

    this.examSvc.getExams().pipe(take(1)).subscribe();
  }

  public clickTest(name: string) {
    console.log(name);
  }

  public close() {
    this.dialogSvc.close();
  }

  public itemKey(item: any) {
    return item as any;
  }
}

















