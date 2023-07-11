import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

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

  constructor() {}

  public getExams(): Observable<any> {
    return of(
      this.exams.reduce((acc, curr) => {
        return { ...acc, [curr.category]: { ...curr } };
      }, {}),
    );
  }
}



