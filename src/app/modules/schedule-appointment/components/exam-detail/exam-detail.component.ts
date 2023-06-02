import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, debounceTime, filter, first, map, takeUntil } from 'rxjs';
import { LoaderService } from 'src/app/core/services/loader.service';
import { ScheduleAppointmentService } from '../../../../core/services/schedule-appointment.service';
import { DestroyableComponent } from '../../../../shared/components/destroyable/destroyable.component';
import { NameValue } from '../../../../shared/models/name-value.model';
import { ExamDetails } from '../../../../shared/models/local-storage-data.model';

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

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private scheduleAppointmentSvc: ScheduleAppointmentService,
    private cdr: ChangeDetectorRef,
    public loaderSvc: LoaderService,
  ) {
    super();
    this.siteDetails$$ = new BehaviorSubject<any[]>([]);
  }

  public ngOnInit(): void {
    this.siteDetails$$.next(JSON.parse(localStorage.getItem('siteDetails') || '{}')?.data);

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
          return exams.map((exam) => {
            this.examIdsToUncombinables.set(+exam.id, new Set(exam.uncombinables));
            return {
              name: exam.name,
              value: exam.id,
              description: exam.instructions,
            };
          });
        }),
        takeUntil(this.destroy$$),
      )
      .subscribe({
        next: (exams) => this.filteredExams$$.next(exams),
      });
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
  }

  private createForm(examDetails?, isEdit?) {
    this.examForm = this.fb.group({
      physician: [examDetails?.physician ? examDetails.physician : '', []],
      exams: this.fb.array([], Validators.required),
      comments: [examDetails?.comments ?? examDetails.comments, []],
      uncombinableError: [false, []],
    });

    if (!isEdit) {
      const fa = this.examForm.get('exams') as FormArray;
      if (examDetails && examDetails?.exams?.length) {
        examDetails.exams.forEach((exam) => {
          fa.push(this.newExam(+exam));
        });
      } else {
        fa.push(this.newExam());
      }
    }
  }

  public examCount(): FormArray {
    return this.examForm.get('exams') as FormArray;
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

  public saveExamDetails() {
    // this.editData = {};
    if (this.examForm.invalid) {
      this.examForm.markAllAsTouched();
      return;
    }

    if (this.examCount().controls.some((control) => control.get('uncombinableError')?.value)) {
      return;
    }

    const examDetails = {
      ...this.examForm.value,
      exams: this.examForm.value.exams.map((exam) => exam.exam),
    } as ExamDetails;

    if (this.editData) {
      this.editData.physicianId = this.examForm.controls['physician'].value;
      this.editData.doctorId = this.examForm.controls['physician'].value;
      this.editData.comments = this.examForm.controls['comments'].value;
      const exams: any = [];
      this.examForm.value.exams.forEach((element) => {
        const previousExam = this.editData.exams?.find(({ id }) => id === element.exam);
        if (previousExam) {
          exams.push({ ...previousExam });
        } else {
          exams.push({ id: element.exam });
        }
      });
      this.editData.exams = exams;
      localStorage.setItem('appointmentDetails', JSON.stringify(this.editData));
    }

    this.scheduleAppointmentSvc.setExamDetails(examDetails);

    this.router.navigate(['../slot'], { relativeTo: this.route, replaceUrl: true });
  }

  // public removeSelectedItems(items: any) {
  //   console.log(
  //     this.examForm.value?.exams.map((value) => value.exam),
  //     items,
  //   );
  //   return items;
  // }

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
