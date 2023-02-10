import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ScheduleAppointmentService } from '../../../../core/services/schedule-appointment.service';
import { BehaviorSubject, filter, map, switchMap, takeUntil } from 'rxjs';
import { DestroyableComponent } from '../../../../shared/components/destroyable/destroyable.component';

@Component({
  selector: 'dfm-exam-detail',
  templateUrl: './exam-detail.component.html',
  styleUrls: ['./exam-detail.component.scss'],
})
export class ExamDetailComponent extends DestroyableComponent implements OnInit, OnDestroy {
  examForm!: FormGroup;
  displayRemoveLogo: boolean = false;
  displayExamDetails: boolean = false;

  public filteredPhysicians$$: BehaviorSubject<any[]>;
  public filteredExams$$: BehaviorSubject<any[]>;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private scheduleAppointmentSvc: ScheduleAppointmentService,
  ) {
    super();
    this.filteredPhysicians$$ = new BehaviorSubject<any[]>([]);
    this.filteredExams$$ = new BehaviorSubject<any[]>([]);
  }

  public ngOnInit(): void {
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
        map((exams) => exams.map(({ name, id }) => ({ name, value: id }))),
        takeUntil(this.destroy$$),
      )
      .subscribe((exams) => {
        console.log('exams: ', exams);
        this.filteredExams$$.next(exams);
      });

    this.scheduleAppointmentSvc.examDetails$.pipe(takeUntil(this.destroy$$)).subscribe((examDetails) => {
      this.createForm(examDetails);
    });

    this.authService.isLoggedInUser.subscribe((user: boolean) => {
      user === true ? (this.displayExamDetails = false) : (this.displayExamDetails = true);
    });
    this.displayExamDetails = !Boolean(localStorage.getItem('user'));
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
  }

  private createForm(examDetails?) {
    this.examForm = this.fb.group({
      physician: [examDetails?.physician ?? examDetails.physician, [Validators.required]],
      exams: this.fb.array([]),
      comments: [examDetails?.comments ?? examDetails.comments, []],
    });

    const fa = this.examForm.get('exams') as FormArray;

    if (examDetails && examDetails?.exams?.length) {
      console.log(examDetails);
      examDetails.exams.forEach((exam) => {
        fa.push(this.newExam(exam));
      });
    } else {
      fa.push(this.newExam());
    }
  }

  public examCount(): FormArray {
    return this.examForm.get('exams') as FormArray;
  }

  private newExam(exam?): FormGroup {
    return this.fb.group({
      examName: [exam?.id, [Validators.required]],
    });
  }

  public addExam() {
    console.log('newExam(): ', this.examForm.controls['exams']['value'][0].examName);
    console.log('Adding a exam');
    this.examCount().push(this.newExam());
    this.displayRemoveLogo = true;
  }

  public removeExam(i: number) {
    if (this.examCount().length > 1) {
      this.examCount().removeAt(i);
    }
  }

  public searchInput(physycianName: string) {
    console.log('physycianName: ', physycianName);
  }

  public resetForm() {
    this.examForm.reset();
  }

  public saveExamDetails() {

    if (this.examForm.valid) {
      
      console.log('function called 156');

      this.examForm.value.exams.map((selectedExam) =>
        this.filteredExams$$.pipe(map((response) => response)).subscribe((examData) => {
          const exams = {
            id: selectedExam?.examName,
            exam: examData.find((item) => {
              return item?.value === selectedExam.examName;
            })?.name,
            doctorId: this.examForm.controls["physician"].value
          };
          console.log('exams: ', exams);
          this.scheduleAppointmentSvc.setExamDetails(exams);

        }),
      );

      this.router.navigate(['../slot'], { relativeTo: this.route });
    }
  }
}
