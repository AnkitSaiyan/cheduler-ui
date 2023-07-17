import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { BehaviorSubject, combineLatest, map, Observable, of, switchMap, tap } from 'rxjs';
import { BodyMaleBack, BodyMaleFront, Skeleton } from 'src/app/shared/utils/anatomy.enum';

@Injectable({
  providedIn: 'root',
})
export class ExamService {
  public exams = [
    { id: 1, value: ['MRI', 'CT scan'], category: Skeleton.Skull },
    { id: 2, value: ['MRI', 'X-ray'], category: Skeleton.Spine },
    { id: 3, value: ['MRI', 'X-ray'], category: Skeleton.Sacrum },
    { id: 4, value: ['X-ray', 'Ultrasound'], category: Skeleton.Pelvis },
    { id: 5, value: ['X-ray', 'CT scan'], category: Skeleton.Ribs },
    { id: 6, value: ['X-ray', 'CT scan'], category: Skeleton.Sternum },
    { id: 7, value: ['X-ray', 'CT scan'], category: Skeleton.ClavicleRt },
    { id: 8, value: ['X-ray', 'CT scan'], category: Skeleton.ClavicleLt },
    { id: 9, value: ['X-ray', 'CT scan'], category: Skeleton.ScapulaRt },
    { id: 10, value: ['X-ray', 'CT scan'], category: Skeleton.ScapulaLt },
    { id: 11, value: ['X-ray', 'CT scan'], category: Skeleton.HumerusRt },
    { id: 12, value: ['X-ray', 'CT scan'], category: Skeleton.HumerusLt },
    { id: 13, value: ['X-ray', 'CT scan'], category: Skeleton.RadiusRt },
    { id: 14, value: ['X-ray', 'CT scan'], category: Skeleton.RadiusLt },
    { id: 15, value: ['X-ray', 'CT scan'], category: Skeleton.HandLt },
    { id: 16, value: ['X-ray', 'CT scan'], category: Skeleton.FemurRt },
    { id: 17, value: ['X-ray', 'CT scan'], category: Skeleton.CalcaneusLt },
    { id: 18, value: ['X-ray', 'CT scan'], category: Skeleton.MetacarpalsRt },
    { id: 19, value: ['X-ray', 'CT scan'], category: Skeleton.HandPhalangesLt },
    { id: 20, value: ['X-ray', 'CT scan'], category: Skeleton.FootPhalangesRt },
    { id: 21, value: ['X-ray', 'CT scan'], category: Skeleton.CarpalsRt },
    { id: 22, value: ['X-ray', 'CT scan'], category: Skeleton.TalusLt },
    { id: 23, value: ['X-ray', 'CT scan'], category: Skeleton.TibiaRt },
    { id: 24, value: ['X-ray', 'CT scan'], category: Skeleton.TibiaLt },
    { id: 25, value: ['X-ray', 'CT scan'], category: Skeleton.FemurLt },
    { id: 26, value: ['X-ray', 'CT scan'], category: BodyMaleFront.Chest },
    { id: 27, value: ['X-ray', 'CT scan'], category: BodyMaleFront.Neck },
    { id: 28, value: ['X-ray', 'CT scan'], category: BodyMaleFront.Head },
    { id: 29, value: ['X-ray', 'CT scan'], category: BodyMaleFront.Pelvis },
    { id: 30, value: ['X-ray', 'CT scan'], category: BodyMaleFront.ShoulderLt },
    { id: 31, value: ['X-ray', 'CT scan'], category: BodyMaleFront.ShoulderRt },
    { id: 32, value: ['X-ray', 'CT scan'], category: BodyMaleFront.Abdomen },
    { id: 34, value: ['X-ray', 'CT scan'], category: BodyMaleFront.AnkleLt },
  ];

  public separator = ' :;: ';

  public selectedExam: any = {};

  constructor() {}

  public exams$$ = new BehaviorSubject<{}>({});
  public allExams$$ = new BehaviorSubject<{ name: string; value: string; category: string }[]>([]);
  public selectedCategory$$ = new BehaviorSubject<string>('');

  public get filterExams$$(): any {
    return combineLatest([this.selectedCategory$$, this.allExams$$]).pipe(
      switchMap(() => this.allExams$$),
      map((value) => value.filter(({ category }) => (this.selectedCategory$$.value ? category === this.selectedCategory$$.value : true))),
    );
  }

  public setCategory(category: BodyMaleFront | BodyMaleBack | any) {
    this.selectedCategory$$.next(category);
  }

  public getExams(): Observable<any> {
    const allExams: { name: string; value: string; category: string }[] = [];
    return of(
      this.exams.reduce((acc, curr) => {
        allExams.push(
          ...curr.value.map((value) => ({
            name: curr.category + ' - ' + value,
            value: curr.category.toLocaleLowerCase() + this.separator + value,
            category: curr.category,
          })),
        );
        return { ...acc, [curr.category]: { ...curr } };
      }, {}),
    ).pipe(
      tap((value) => {
        this.exams$$.next(value);
        this.allExams$$.next([...allExams]);
      }),
    );
  }

  public addExam(category: BodyMaleFront | BodyMaleBack | any, exam: string) {
    if (this.selectedExam[category]) {
      if (this.selectedExam[category].find((value) => value === exam)) {
        this.selectedExam[category] = [...this.selectedExam[category].filter((value) => value !== exam)];
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































































