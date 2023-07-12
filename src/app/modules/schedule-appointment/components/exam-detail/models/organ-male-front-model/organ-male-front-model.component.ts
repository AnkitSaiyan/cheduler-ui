import { Component, Input, OnInit } from '@angular/core';
import { ExamService } from 'src/app/core/services/exam.service';

@Component({
  selector: 'dfm-organ-male-front-model',
  templateUrl: './organ-male-front-model.component.html',
  styleUrls: ['./organ-male-front-model.component.scss'],
})
export class OrganMaleFrontModelComponent implements OnInit {
  constructor(public examSvc: ExamService) {}

  ngOnInit() {}
  public clickTest(name: string) {
    console.log(name);
  }
}

