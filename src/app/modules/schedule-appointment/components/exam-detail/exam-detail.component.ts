import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'dfm-exam-detail',
  templateUrl: './exam-detail.component.html',
  styleUrls: ['./exam-detail.component.scss'],
})
export class ExamDetailComponent implements OnInit {
  examForm!: FormGroup;
  public examName = new FormControl('', []);
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

  physician: any=[
    {
      name: 'physician1',
      value: 'physician1',
      description: 'physician1'
    },
    {
      name: 'physician2',
      value: 'physician2',
      description: 'physician2'
    },
    {
      name: 'physician3',
      value: 'physician3',
      description: 'physician3'
    },
  ]
  constructor(private fb: FormBuilder) {
    this.examForm = this.fb.group({
      credentials: this.fb.array([]),
    });
  }

  ngOnInit(): void {
  }

  examCount() : FormArray {  
    return this.examForm.get("credentials") as FormArray  
  }  

  addExam(){
    console.log("examName", this.examName.value);
    
  }

  getControls(){
    return (this.examForm.controls['credentials'] as FormArray).controls;
  }

  addCreds() {
    this.getControls().push(this.fb.group({
      examName: '',
    }));
  }

  removeExam(i: number) {
   this.examCount().removeAt(i);
  }

  searchInput(physycianName: string) {
    console.log('physycianName: ', physycianName);

  }
}

