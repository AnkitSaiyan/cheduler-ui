import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, distinctUntilChanged, startWith, take, takeUntil } from 'rxjs';
import { ExamService } from 'src/app/core/services/exam.service';
import { ModalService } from 'src/app/core/services/modal.service';
import { ScheduleAppointmentService } from 'src/app/core/services/schedule-appointment.service';
import { ConfirmActionModalComponent, DialogData } from 'src/app/shared/components/confirm-action-modal/confirm-action-modal.component';
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
    private modalSvc: ModalService,
  ) {
    super();
  }

  public filterForm!: FormGroup;
  @Input()
  public addExamForm!: FormGroup;

  public filter = [
    {
      name: 'BODY_STEUCTURE',
      formName: 'bodyStructure',
      click: false,
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
      click: true,
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
      click: false,
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

    this.filterForm.valueChanges.pipe(takeUntil(this.destroy$$)).subscribe(() => {
      this.examSvc.setCategory('');
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

  public async onGenderChange(event: any, value: string) {
    const previousValue = this.filterForm?.get('gender')?.value;
    if (
      value === previousValue ||
      !Object.keys(this.examSvc.selectedExam)?.some((val) => val.includes(value === 'male' ? BodyType.Female : BodyType.Male))
    ) {
      this.filterForm?.get('gender')?.setValue(value);
      this.addExamForm.get('exam')?.setValue('');
      return;
    }
    event.preventDefault();
    let confirm = await this.showConfirm();
    if (!confirm) {
      return;
    }
    this.examSvc.removeExamByGender(value === 'male' ? BodyType.Female : BodyType.Male);
    this.filterForm?.get('gender')?.setValue(value);
    this.addExamForm.get('exam')?.setValue('');
  }

  private showConfirm(): Promise<Boolean> {
    return new Promise((resolve) => {
      const modalRef = this.modalSvc.open(ConfirmActionModalComponent, {
        data: {
          titleText: 'Confirmation',
          bodyText: 'Are you sure you want to switch the gender? Warning: Switching will discard the previously added exams',
          confirmButtonText: 'Proceed',
        } as DialogData,
      });
      modalRef.closed.pipe(take(1)).subscribe({
        next: (result) => resolve(result),
      });
    });
  }
}


































