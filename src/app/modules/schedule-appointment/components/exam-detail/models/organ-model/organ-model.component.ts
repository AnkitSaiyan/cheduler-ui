import { Component, Input, OnInit } from '@angular/core';
import { ExamService } from 'src/app/core/services/exam.service';

@Component({
  selector: 'dfm-organ-model',
  templateUrl: './organ-model.component.html',
  styleUrls: ['./organ-model.component.scss'],
})
export class OrganModelComponent implements OnInit {
  constructor(public examSvc: ExamService) {}

  ngOnInit() {}
  public clickTest(name: string) {
    console.log(name);
  }
}

