import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ScheduleAppointmentService } from '../../../../core/services/schedule-appointment.service';
import { BehaviorSubject, map, takeUntil } from 'rxjs';
import { DestroyableComponent } from '../../../../shared/components/destroyable/destroyable.component';
import { KeyValue } from '@angular/common';
import { NameValue } from '../../../../shared/models/name-value.model';
import { ExamDetails } from '../../../../shared/models/local-storage-data.model';

@Component({
  selector: 'dfm-exam-detail',
  templateUrl: './exam-detail.component.html',
  styleUrls: ['./exam-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExamDetailComponent extends DestroyableComponent implements OnInit, OnDestroy {
  public examForm!: FormGroup;
  public filteredPhysicians$$ = new BehaviorSubject<NameValue[] | null>(null);
  public filteredExams$$ = new BehaviorSubject<NameValue[] | null>(null);
  siteDetails$$: BehaviorSubject<any>;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private scheduleAppointmentSvc: ScheduleAppointmentService,
    private cdr: ChangeDetectorRef,
  ) {
    super();
    this.siteDetails$$ = new BehaviorSubject<any[]>([]);
  }

  public ngOnInit(): void {
    this.siteDetails$$.next(JSON.parse(localStorage.getItem('siteDetails') || '{}'));

    this.scheduleAppointmentSvc.examDetails$.pipe(takeUntil(this.destroy$$)).subscribe((examDetails) => {
      this.createForm(examDetails);
    });

    this.scheduleAppointmentSvc.physicians$
      .pipe(
        map((staff) => staff.map(({ firstname, id }) => ({ name: firstname, value: id }))),
        takeUntil(this.destroy$$),
      )
      .subscribe((staffs) => {
        this.filteredPhysicians$$.next(staffs);
      });

    this.scheduleAppointmentSvc.exams$
      .pipe(
        map((exams) => exams.map(({ name, id }) => ({ name: `${name}`, value: id }))),
        takeUntil(this.destroy$$),
      )
      .subscribe((exams) => this.filteredExams$$.next(exams));
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
  }

  private createForm(examDetails?) {
    console.log(examDetails);
    this.examForm = this.fb.group({
      physician: [+examDetails?.physician ?? '', [Validators.required]],
      exams: this.fb.array([]),
      comments: [examDetails?.comments ?? examDetails.comments, []],
    });

    const fa = this.examForm.get('exams') as FormArray;

    if (examDetails && examDetails?.exams?.length) {
      examDetails.exams.forEach((exam) => {
        fa.push(this.newExam(+exam));
      });
    } else {
      fa.push(this.newExam());
    }
  }

  public examCount(): FormArray {
    return this.examForm.get('exams') as FormArray;
  }

  private newExam(exam?: number): FormGroup {
    return this.fb.group({
      exam: [exam, [Validators.required]],
    });
  }

  public addExam() {
    this.examCount().push(this.newExam());
  }

  public removeExam(i: number) {
    if (this.examCount().length > 1) {
      this.examCount().removeAt(i);
    }
  }

  public searchInput(physycianName: string) {}

  public resetForm() {
    this.examForm.reset();
  }

  public saveExamDetails() {
    if (this.examForm.invalid) {
      return;
    }

    const examDetails = {
      ...this.examForm.value,
      exams: this.examForm.value.exams.map((exam) => exam.exam),
    } as ExamDetails;

    console.log(examDetails);

    this.scheduleAppointmentSvc.setExamDetails(examDetails);

    this.router.navigate(['../slot'], { relativeTo: this.route });
  }
}
