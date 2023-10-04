import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, filter, map, Observable, switchMap } from 'rxjs';
import { BodyMaleBack, BodyMaleFront } from 'src/app/shared/utils/anatomy.enum';
import { BodyType, SELECTED_EXAM } from 'src/app/shared/utils/const';
import { BodyPartService } from './body-part.service';

@Injectable({
  providedIn: 'root',
})
export class ExamService {
  public selectedExam: any = {};
  private allExams$$ = new BehaviorSubject<any>(null);
  public selectedCategory$$ = new BehaviorSubject<string>('');
  public selectedBodyType$$ = new BehaviorSubject<string | undefined>(undefined);
  constructor(private bodyPartSvc: BodyPartService) {}

  public get filterExams$(): Observable<any[]> {
    return combineLatest([this.selectedCategory$$, this.allExams$$, this.selectedBodyType$$]).pipe(
      switchMap(() => this.allExams$$),
      filter(Boolean),
      map((value) => {
        if (this.selectedCategory$$.value && this.selectedBodyType$$.value) {
          return value[this.selectedBodyType$$.value][this.selectedCategory$$.value] ?? [];
        }
        if (this.selectedBodyType$$.value) {
          return value[this.selectedBodyType$$.value + 'AllExam'] ?? [];
        }
        return value?.[BodyType.Male + 'AllExam'] ?? [];
      }),
    );
  }

  public setCategory(category: BodyMaleFront | BodyMaleBack | any, bodyType?: BodyType) {
    this.selectedBodyType$$.next(bodyType);
    this.selectedCategory$$.next(category);
  }

  public get selectedCategory() {
    return this.selectedCategory$$?.value?.length ? this.bodyPartSvc.getBodyPartById(+this.selectedCategory$$.value).bodypartName + ' ' : '';
  }

  public setExam(exams: any) {
    this.allExams$$.next(exams);
  }

  public resetExamValue() {
    this.selectedExam = {};
    this.selectedCategory$$.next('');
    this.selectedBodyType$$.next(undefined);
  }

  public getExams$(): Observable<any> {
    return this.allExams$$.asObservable();
  }

  public get allExams(): any {
    return this.allExams$$.value;
  }

  public addExam(categoryType: any, exam: any, onlyAdd: boolean = false) {
    let category = categoryType;
    if (!this.bodyPartSvc.getBodyPartById(+categoryType?.split(' ')?.[0])?.bodypartName) {
      category = SELECTED_EXAM;
    }
    let isExamExist = false;
    Object.entries(this.selectedExam).forEach(([key, exams]: [any, any]) => {
      exams.forEach((item) => {
        if (item.value === exam.value) {
          this.selectedExam[key] = [...this.selectedExam[key].filter((value) => value.value !== exam.value)];
          if (!this.selectedExam[key].length) {
            delete this.selectedExam[key];
          }
          isExamExist = true;
        }
      });
    });
    if (isExamExist) {
      return;
    }
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

  public remove(category: any, exam: any) {
    this.selectedExam[category] = [...this.selectedExam[category].filter((value) => value.value !== exam.value)];
    if (!this.selectedExam[category].length) {
      delete this.selectedExam[category];
    }
  }

  public isExamSelected(examId?: string | number): boolean {
    if (examId) {
      return Object.values(this.selectedExam)?.some((exams: any) => {
        return exams?.some((item) => item.value === examId);
      });
    }
    return !!Object.keys(this.selectedExam).length;
  }
  public removeExamByGender(gender: BodyType) {
    Object.keys(this.selectedExam).forEach((key: string) => {
      if (key.includes(gender) || key.includes(SELECTED_EXAM)) {
        delete this.selectedExam[key];
      }
    });
  }
  public get examFormValue() {
    return this.selectedExam;
  }
}
















































































































































































