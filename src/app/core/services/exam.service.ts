import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ExamService {
  public exams = [
    { id: 1, value: ['MRI', 'CT scan'], category: 'Skull' },
    { id: 2, value: ['MRI', 'X-ray'], category: 'Spine' },
    { id: 3, value: ['MRI', 'X-ray'], category: 'Sacrum' },
    { id: 4, value: ['X-ray', 'Ultrasound'], category: 'Pelvis' },
    { id: 5, value: ['X-ray', 'CT scan'], category: 'Ribs' },
    { id: 6, value: ['X-ray', 'CT scan'], category: 'Sternum' },
    { id: 7, value: ['X-ray', 'CT scan'], category: 'Clavicle' },
    { id: 8, value: ['X-ray', 'CT scan'], category: 'Scapula' },
    { id: 9, value: ['X-ray', 'CT scan'], category: 'Humerus' },
    { id: 10, value: ['X-ray', 'CT scan'], category: 'Radius' },
    { id: 11, value: ['X-ray', 'CT scan'], category: 'Ulna' },
    { id: 12, value: ['X-ray', 'CT scan'], category: 'Hand' },
    { id: 13, value: ['X-ray', 'CT scan'], category: 'Femur' },
    { id: 14, value: ['X-ray', 'CT scan'], category: 'Patella' },
    { id: 15, value: ['X-ray', 'CT scan'], category: 'Tibia' },
    { id: 16, value: ['X-ray', 'CT scan'], category: 'Fibula' },
    { id: 17, value: ['X-ray', 'CT scan'], category: 'Foot' },
    { id: 18, value: ['X-ray', 'CT scan'], category: 'Carpals' },
    { id: 19, value: ['X-ray', 'CT scan'], category: 'Metacarpals' },
    { id: 20, value: ['X-ray', 'CT scan'], category: 'Hand Phalanges' },
    { id: 21, value: ['X-ray', 'CT scan'], category: 'Calcaneus' },
    { id: 22, value: ['X-ray', 'CT scan'], category: 'Talus' },
    { id: 23, value: ['X-ray', 'CT scan'], category: 'Tarsals' },
    { id: 24, value: ['X-ray', 'CT scan'], category: 'Metatarsals' },
    { id: 25, value: ['X-ray', 'CT scan'], category: 'Foot Phalanges' },
  ];

  public separator = ' :;: ';

  public selectedExam: any = {};

  constructor() {}

  public exams$$ = new BehaviorSubject<{}>({});

  public getExams(): Observable<any> {
    return of(
      this.exams.reduce((acc, curr) => {
        return { ...acc, [curr.category]: { ...curr } };
      }, {}),
    ).pipe(
      tap((value) => {
        this.exams$$.next(value);
      }),
    );
  }
  public addExam(category: string, exam: string) {
    console.log(category, exam);

    if (category === 'All') {
      category = exam.split(this.separator)[0];
      exam = exam.split(this.separator)[1];
    }

    console.log(category, exam);

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







































