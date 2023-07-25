import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, debounceTime, filter, first, map, take, takeUntil } from 'rxjs';
import { ExamService } from 'src/app/core/services/exam.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { ModalService } from 'src/app/core/services/modal.service';
import { Exam } from 'src/app/shared/models/exam.model';
import { BodyType } from 'src/app/shared/utils/const';
import { ScheduleAppointmentService } from '../../../../core/services/schedule-appointment.service';
import { DestroyableComponent } from '../../../../shared/components/destroyable/destroyable.component';
import { ExamDetails } from '../../../../shared/models/local-storage-data.model';
import { NameValue } from '../../../../shared/models/name-value.model';
import { AnatomyModelComponent } from './anatomy-model/anatomy-model.component';

@Component({
  selector: 'dfm-exam-detail',
  templateUrl: './exam-detail.component.html',
  styleUrls: ['./exam-detail.component.scss'],
})
export class ExamDetailComponent extends DestroyableComponent implements OnInit, OnDestroy {
  public examForm!: FormGroup;

  public filteredPhysicians$$ = new BehaviorSubject<NameValue[] | null>(null);

  public filteredExams$$ = new BehaviorSubject<NameValue[] | null>(null);

  public siteDetails$$: BehaviorSubject<any>;

  private editData: any;

  private examIdsToUncombinables = new Map<number, Set<number>>();

  public addExamForm!: FormGroup;

  private allExams$$ = new BehaviorSubject<Exam[]>([]);

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private scheduleAppointmentSvc: ScheduleAppointmentService,
    public loaderSvc: LoaderService,
    private modalSvc: ModalService,
    public examSvc: ExamService,
  ) {
    super();
    this.siteDetails$$ = new BehaviorSubject<any[]>([]);
    this.examSvc.resetExamValue();
  }

  public ngOnInit(): void {
    this.siteDetails$$.next(JSON.parse(localStorage.getItem('siteDetails') || '{}')?.data);

    this.addExamForm = this.fb.group({
      exam: [null, []],
      comments: ['', []],
    });

    this.scheduleAppointmentSvc.examDetails$.pipe(takeUntil(this.destroy$$)).subscribe({
      next: (examDetails) => {
        if (localStorage.getItem('appointmentDetails')) {
          this.editData = JSON.parse(localStorage.getItem('appointmentDetails') || '');

          this.createForm(examDetails, true);

          const examData = {
            comments: this.editData.comments,
            physician: this.editData.doctorId,
          };

          this.examForm.patchValue(examData);

          const items = this.examForm.get('exams') as FormArray;

          this.removeExam(0);

          this.editData.exams.forEach((element, index) => {
            this.addExam();
            items.at(index).patchValue({ exam: element.id });
            const exam = {
              name: element.name,
              value: element.id,
              description: element.instructions,
              bodyType: element.bodyType,
              bodyPart: element.bodyPart,
            };
            this.examSvc.addExam(exam.bodyPart + ' [' + exam.bodyType + ']', exam);
          });
        } else {
          this.createForm(examDetails, false);
        }
      },
    });

    this.scheduleAppointmentSvc.physicians$
      .pipe(
        map((staff) => staff.map(({ firstname, id }) => ({ name: firstname, value: id }))),
        takeUntil(this.destroy$$),
      )
      .subscribe({
        next: (staffs) => this.filteredPhysicians$$.next(staffs),
      });

    this.scheduleAppointmentSvc.exams$
      .pipe(
        first(),
        map((exams) => {
          return exams
            .filter((exam) => exam.bodyPart && exam.bodyType)
            .map((exam) => {
              this.examIdsToUncombinables.set(+exam.id, new Set(exam.uncombinables));
              return {
                name: exam.name,
                value: exam.id,
                description: exam.instructions,
                bodyType: exam.bodyType,
                bodyPart: exam.bodyPart,
              };
            });
        }),
        takeUntil(this.destroy$$),
      )
      .subscribe({
        next: (exams: any[]) => {
          this.allExams$$.next(exams);
          this.examSvc.setExam({ ...this.examModifiedData(exams) });
          this.filteredExams$$.next(exams);
        },
      });
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
  }

  private examModifiedData(exams: Exam[]): any {
    return exams.reduce(
      (acc, curr) => {
        if (acc[curr.bodyType]) {
          if (acc[curr.bodyType][curr.bodyPart]) {
            acc[curr.bodyType][curr.bodyPart] = [...acc[curr.bodyType][curr.bodyPart], curr];
          } else {
            acc[curr.bodyType][curr.bodyPart] = [curr];
          }
        } else {
          acc[curr.bodyType] = {};
          acc[curr.bodyType][curr.bodyPart] = [curr];
        }
        return acc;
      },
      { [BodyType.Female]: {}, [BodyType.Male]: {}, [BodyType.Skeleton]: {} },
    );
  }

  private createForm(examDetails?, isEdit?) {
    this.examForm = this.fb.group({
      physician: [examDetails?.physician ? examDetails.physician : '', []],
      exams: this.fb.array([], Validators.required),
      comments: [examDetails?.comments ?? examDetails.comments, []],
      uncombinableError: [false, []],
    });
    this.addExamForm.patchValue({
      comments: examDetails?.comments ? examDetails.comments : '',
    });

    if (!isEdit) {
      const fa = this.examForm.get('exams') as FormArray;
      if (examDetails && examDetails?.exams?.length) {
        examDetails.exams.forEach((exam) => {
          fa.push(this.newExam(+exam));
        });
        examDetails?.examsData.forEach((exam) => {
          this.examSvc.addExam(exam.bodyPart + ' [' + exam.bodyType + ']', exam);
        });
      } else {
        fa.push(this.newExam());
      }
    }
  }

  public examCount(): FormArray {
    return this.examForm.get('exams') as FormArray;
  }

  public openAnatomyModal() {
    const modalRef = this.modalSvc.open(AnatomyModelComponent, {
      options: {
        size: 'lg',
        centered: true,
        backdropClass: 'modal-backdrop-remove-mv',
      },
    });

    modalRef.closed
      .pipe(
        filter((res) => !!res),
        take(1),
      )
      .subscribe({
        next: (value) => {

        },
      });
  }

  private newExam(exam?: number, info?: string): FormGroup {
    const fg = this.fb.group({
      exam: [exam, [Validators.required]],
      info: [info, []],
      instructions: [this.filteredExams$$.value?.find((e) => +e.value === +e)?.description],
      uncombinableError: [false, []],
    });

    fg.get('exam')
      ?.valueChanges.pipe(
        debounceTime(0),
        filter((examID) => !!examID),
        takeUntil(this.destroy$$),
      )
      .subscribe({
        next: (examID) => this.validateUcombinableExams(),
      });

    return fg;
  }

  public addExam() {
    this.examCount().push(this.newExam());
  }

  public removeExam(i: number) {
    if (this.examCount().length > 1) {
      this.examCount().removeAt(i);
      this.validateUcombinableExams();
    }
  }

  public resetForm() {
    this.examForm.reset();
  }

  public isDisabled() {
    return !Object.values(this.examSvc.selectedExam)
      .flatMap((val) => val)
      .map((item: any) => item.value).length;
  }

  public saveExamDetails(isFromMobile: boolean = false) {
    // this.editData = {};
    if (isFromMobile && this.examForm.invalid) {
      this.examForm.markAllAsTouched();
      return;
    }

    if (isFromMobile && this.examCount().controls.some((control) => control.get('uncombinableError')?.value)) {
      return;
    }

    const selectedExams: any[] = Object.values(this.examSvc.selectedExam).flatMap((val) => val);
    const selectedExamIds = selectedExams?.map(({ value }: any) => value);
    if (!isFromMobile && !selectedExamIds.length) {
      return;
    }
    const examDetails = {
      ...this.examForm.value,
      comments: this.addExamForm.controls['comments']?.value,
      exams: isFromMobile ? this.examForm.value.exams.map((exam) => exam.exam) : selectedExamIds,
      examsData: selectedExams,
    } as ExamDetails;

    if (this.editData) {
      this.editData.physicianId = this.examForm.controls['physician'].value;
      this.editData.doctorId = this.examForm.controls['physician'].value;
      this.editData.comments = isFromMobile ? this.examForm.controls['comments'].value : this.addExamForm.controls['comments'].value;
      const exams: any = [];
      if (isFromMobile) {
        this.examForm.value.exams.forEach((element) => {
          const previousExam = this.editData.exams?.find(({ id }) => id === element.exam);
          if (previousExam) {
            exams.push({ ...previousExam });
          } else {
            exams.push({ id: element.exam });
          }
        });
        this.editData.exams = exams;
      } else {
        selectedExams?.forEach((exam) => {
          const previousExam = this.editData.exams?.find(({ id }) => id === exam.value);
          if (previousExam) {
            exams.push({ ...previousExam });
          } else {
            exams.push({ ...exam, id: exam.value });
          }
        });
        this.editData.exams = exams;
      }
      localStorage.setItem('appointmentDetails', JSON.stringify(this.editData));
    }

    this.scheduleAppointmentSvc.setExamDetails(examDetails);

    this.router.navigate(['../slot'], { relativeTo: this.route, replaceUrl: true });
  }

  private validateUcombinableExams() {
    const { controls } = this.examForm.get('exams') as FormArray;
    const errorControls: AbstractControl[] = [];

    if (controls.length === 1) {
      controls[0].patchValue({ uncombinableError: false });
      return;
    }

    for (let i = 0; i < controls.length - 1; i++) {
      for (let j = i + 1; j < controls.length; j++) {
        if (
          this.examIdsToUncombinables.get(+controls[i].value.exam)?.has(+controls[j].value.exam) ||
          this.examIdsToUncombinables.get(+controls[j].value.exam)?.has(+controls[i].value.exam)
        ) {
          errorControls.push(controls[i], controls[j]);
        }

        if (
          !this.examIdsToUncombinables.get(+controls[i].value.exam)?.has(+controls[j].value.exam) &&
          !this.examIdsToUncombinables.get(+controls[j].value.exam)?.has(+controls[i].value.exam)
        ) {
          controls[i].patchValue({ uncombinableError: false });
          controls[j].patchValue({ uncombinableError: false });
        }
      }
    }

    errorControls.forEach((control) => control.patchValue({ uncombinableError: true }));
  }
}
