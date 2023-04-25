import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, map, takeUntil } from 'rxjs';
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

  siteDetails$$: BehaviorSubject<any>;

  editData: any;

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
    // localStorage.removeItem('appointmentId');
  }

  public ngOnInit(): void {
    this.siteDetails$$.next(JSON.parse(localStorage.getItem('siteDetails') || '{}')?.data);
    this.scheduleAppointmentSvc.examDetails$.pipe(takeUntil(this.destroy$$)).subscribe((examDetails) => {
      if (localStorage.getItem('appointmentDetails')) {
        this.editData = JSON.parse(localStorage.getItem('appointmentDetails') || '');
        this.createForm(examDetails, true);
        console.log(this.editData);
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
        map((exams) => exams.map(({ name, id, instructions }) => ({ name: `${name}`, value: id, description: instructions }))),
        takeUntil(this.destroy$$),
      )
      .subscribe((exams) => this.filteredExams$$.next(exams));
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
  }

  private createForm(examDetails?, isEdit?) {
    this.examForm = this.fb.group({
      physician: [examDetails?.physician ? examDetails.physician : '', []],
      exams: this.fb.array([], Validators.required),
      comments: [examDetails?.comments ?? examDetails.comments, []],
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
    return this.fb.group({
      exam: [exam, [Validators.required]],
      info: [info, []],
      instructions: [this.filteredExams$$.value?.find((e) => +e.value === +e)?.description],
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

  public resetForm() {
    this.examForm.reset();
  }

  public saveExamDetails() {
    // this.editData = {};
    if (this.examForm.invalid) {
      this.examForm.markAllAsTouched();
      return;
    }

    const examDetails = {
      ...this.examForm.value,
      exams: this.examForm.value.exams.map((exam) => exam.exam),
    } as ExamDetails;

    if (this.editData) {
      this.editData.physicianId = this.examForm.controls['physician'].value;
      this.editData.comments = this.examForm.controls['comments'].value;
      const exams: any = [];
      this.examForm.value.exams.forEach((element) => {
        exams.push({ id: element.exam });
      });
      this.editData.exams = exams;
      localStorage.setItem('appointmentDetails', JSON.stringify(this.editData));
    }

    this.scheduleAppointmentSvc.setExamDetails(examDetails);

    this.router.navigate(['../slot'], { relativeTo: this.route, replaceUrl: true });
  }
}
