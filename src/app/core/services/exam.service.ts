import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ExamService {
  public exams = {
    Chest: [
      { name: 'Radiographic Studies (X-rays)', value: 'Radiographic Studies (X-rays)' },
      { name: 'Computerized Tomography (CT Scan)', value: 'Computerized Tomography (CT Scan)' },
      { name: 'Ventilation Perfusion Scan (Lung Scan, V/Q Scan)', value: 'Ventilation Perfusion Scan (Lung Scan, V/Q Scan)' },
      { name: 'Pulmonary Function Tests (PFTs)', value: 'Pulmonary Function Tests (PFTs)' },
      { name: 'Electrocardiogram (EKG)', value: 'Electrocardiogram (EKG)' },
      { name: 'Blood Testing', value: 'Blood Testing' },
    ],
    Head: [
      { name: 'Echoencephalography', value: 'Echoencephalography' },
      { name: 'Magnetoencephalography', value: 'Magnetoencephalography' },
      { name: 'Brain scanning', value: 'Brain scanning' },
      { name: 'Pneumoencephalography', value: 'Pneumoencephalography' },
    ],
    All: [],
  };

  constructor() {}

  public getExams(): Observable<any> {
    return of(this.exams);
  }
}

