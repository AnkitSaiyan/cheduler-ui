import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'dfm-body-parts',
  templateUrl: './body-parts.component.html',
  styleUrls: ['./body-parts.component.scss'],
})
export class BodyPartsComponent implements OnInit {
  public formGroup!: FormGroup;

  public number = [1];

  public bodyIdToName = {
    1: 'Head',
    2: 'Chest',
    3: 'Arms',
  };

  public exams = {
    Head: [
      {
        value: 101,
        name: 'Eye exam',
      },
      {
        value: 102,
        name: 'Hearing exam',
      },
      {
        value: 103,
        name: 'Nose exam',
      },
    ],
    Chest: [
      {
        value: 201,
        name: 'Chest X-ray',
      },
      {
        value: 202,
        name: 'EKG',
      },
      {
        value: 203,
        name: 'Echocardiogram',
      },
    ],
    Arms: [
      {
        value: 301,
        name: 'MRI of the arm',
      },
      {
        value: 302,
        name: 'X-ray of the arm',
      },
      {
        value: 303,
        name: 'Ultrasound of the arm',
      },
    ],
  };

  public bodyParts: any[] = [];

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.bodyParts = Object.keys(this.exams).map((name, value) => ({ name, value: value + 1 }));
    this.createForm();
  }

  private createForm(): void {
    this.formGroup = this.fb.group({
      eamGroup: this.fb.array([]),
    });
  }
}
