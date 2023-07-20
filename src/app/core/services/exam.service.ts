import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, map, Observable, switchMap } from 'rxjs';
import { BodyMaleBack, BodyMaleFront } from 'src/app/shared/utils/anatomy.enum';
import { BodyType } from 'src/app/shared/utils/const';

@Injectable({
  providedIn: 'root',
})
export class ExamService {
  public selectedExam: any = {};
  private allExams$$ = new BehaviorSubject<any>(null);
  public selectedCategory$$ = new BehaviorSubject<string>('');
  public selectedGender$$ = new BehaviorSubject<string | undefined>(undefined);
  constructor() {}

  public get filterExams$(): any {
    return combineLatest([this.selectedCategory$$, this.allExams$$, this.selectedGender$$]).pipe(
      switchMap(() => this.allExams$$),
      map((value) => {
        if (this.selectedCategory$$.value && this.selectedGender$$.value) {
          return value[this.selectedGender$$.value][this.selectedCategory$$.value];
        }
        if (this.selectedGender$$.value) {
          return Object.values(value[this.selectedGender$$.value]).flatMap((val) => val);
        }
        return Object.values(value[BodyType.Male]).flatMap((val) => val);
      }),
    );
  }

  public setCategory(category: BodyMaleFront | BodyMaleBack | any, gender?: BodyType) {
    this.selectedGender$$.next(gender);
    this.selectedCategory$$.next(category);
  }

  public setExam(exams: any) {
    console.log(exams, 'exam');
    this.allExams$$.next(exams);
  }

  public getExams$(): Observable<any> {
    return this.allExams$$.asObservable();
  }

  public get allExams(): any {
    return this.allExams$$.value;
  }

  public addExam(category: any, exam: any, onlyAdd: boolean = false) {
    if (this.selectedExam[category]) {
      if (onlyAdd && this.selectedExam[category].find((value) => value.value === exam.value)) {
        return;
      }
      if (!onlyAdd && this.selectedExam[category].find((value) => value.value === exam.value)) {
        this.selectedExam[category] = [...this.selectedExam[category].filter((value) => value.value !== exam.value)];
        if (!this.selectedExam[category].length) {
          delete this.selectedExam[category];
        }
      } else {
        this.selectedExam[category] = [...this.selectedExam[category], exam];
      }
    } else {
      this.selectedExam[category] = [exam];
    }
  }

  public isExamSelected(): boolean {
    return !!Object.keys(this.selectedExam).length;
  }
  public removeExam(exam: any) {}
  public get examFormValue() {
    return this.selectedExam;
  }
}
































































































































