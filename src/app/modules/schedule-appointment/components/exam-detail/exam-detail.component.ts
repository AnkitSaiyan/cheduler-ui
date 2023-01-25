import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'dfm-exam-detail',
  templateUrl: './exam-detail.component.html',
  styleUrls: ['./exam-detail.component.scss'],
})
export class ExamDetailComponent implements OnInit {
  examForm!: FormGroup;
  displayRemoveLogo: boolean = false;
  items: any = [
    {
      name: 'Aanpasing steunzolen',
      value: 'Aanpasing steunzolen',
      discription: 'Aanpasing steunzolen',
    },
    {
      name: 'Levering steunzolen',
      value: 'Levering steunzolen',
      discription: 'Levering steunzolen',
    },
    {
      name: 'Maatname',
      value: 'Maatname',
      discription: 'Maatname',
    },
  ];

  physician: any = [
    {
      name: 'physician1',
      value: 'physician1',
      description: 'physician1',
    },
    {
      name: 'physician2',
      value: 'physician2',
      description: 'physician2',
    },
    {
      name: 'physician3',
      value: 'physician3',
      description: 'physician3',
    },
  ];
  displayExamDetails: boolean = false;
  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.examForm = this.fb.group({
      exams: this.fb.array([this.newExam()]),
    });
  }

  ngOnInit(): void {
    this.authService.isLoggedInUser.subscribe((user: boolean) => {
      user === true ? (this.displayExamDetails = false) : (this.displayExamDetails = true);
    });
    this.displayExamDetails = !Boolean(localStorage.getItem('user'));
  }

  examCount(): FormArray {
    return this.examForm.get('exams') as FormArray;
  }
  
  newExam(): FormGroup {
    return this.fb.group({
      examName: new FormControl('')
    })
  }

  addExam() {
    console.log('newExam(): ', this.examForm.controls['exams']['value'][0].examName);
    console.log("Adding a exam");
    this.examCount().push(this.newExam());
    this.displayRemoveLogo = true;

  }
  
  removeExam(i: number) {
    if (this.examCount().length > 1) {
      this.examCount().removeAt(i);
    }
  }

  searchInput(physycianName: string) {
    console.log('physycianName: ', physycianName);
  }

  resetForm() {
    this.examForm.reset();
  }
}
