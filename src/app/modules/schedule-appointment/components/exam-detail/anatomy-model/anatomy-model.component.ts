import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, distinctUntilChanged, startWith, take, takeUntil } from 'rxjs';
import { ExamService } from 'src/app/core/services/exam.service';
import { ModalService } from 'src/app/core/services/modal.service';
import { ScheduleAppointmentService } from 'src/app/core/services/schedule-appointment.service';
import { DestroyableComponent } from 'src/app/shared/components/destroyable/destroyable.component';
import { Exam } from 'src/app/shared/models/exam.model';
import { NameValue } from 'src/app/shared/models/name-value.model';
import { BodyType } from 'src/app/shared/utils/const';

@Component({
  selector: 'dfm-anatomy-model',
  templateUrl: './anatomy-model.component.html',
  styleUrls: ['./anatomy-model.component.scss'],
})
export class AnatomyModelComponent extends DestroyableComponent implements OnInit, OnDestroy {
  constructor(
    private dialogSvc: ModalService,
    private fb: FormBuilder,
    public examSvc: ExamService,
    private scheduleAppointmentSvc: ScheduleAppointmentService,
  ) {
    super();
  }

  public filterForm!: FormGroup;
  @Input()
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

    this.filterForm
      .get('bodyStructure')
      ?.valueChanges.pipe(distinctUntilChanged(), takeUntil(this.destroy$$))
      .subscribe((value) => {
        if (value === 'bones') {
          this.filterForm.patchValue({ gender: 'male', side: 'front' }, { emitEvent: false, onlySelf: true });
          this.examSvc.selectedBodyType$$.next(BodyType.Skeleton);
          this.examSvc.selectedBodyType$$.next(BodyType.Skeleton);
        }
      });

    this.filterForm
      .get('gender')
      ?.valueChanges.pipe(distinctUntilChanged(), takeUntil(this.destroy$$))
      .subscribe((value) => {
        if (value === 'male') {
          this.examSvc.selectedBodyType$$.next(BodyType.Male);
        } else {
          this.examSvc.selectedBodyType$$.next(BodyType.Female);
        }
      });
  }

  public close() {
    this.dialogSvc.close();
  }

  public onExamSelect(value: string) {
    this.examSvc.filterExams$.pipe(take(1)).subscribe((allExams) => {
      const exam = allExams?.find((val: any) => val.value === value) as Exam;
      this.examSvc.addExam(exam.bodyPart + ` [${exam.bodyType}]`, exam, true);
      this.addExamForm.get('exam')?.reset();
    });
  }

  public override ngOnDestroy(): void {
    super.ngOnDestroy();
  }
}




