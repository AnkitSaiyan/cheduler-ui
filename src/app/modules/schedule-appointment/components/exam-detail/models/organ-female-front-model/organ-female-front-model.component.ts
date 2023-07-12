import { Component, OnInit } from '@angular/core';
import { ExamService } from 'src/app/core/services/exam.service';

@Component({
  selector: 'dfm-organ-female-front-model',
  templateUrl: './organ-female-front-model.component.html',
  styleUrls: ['./organ-female-front-model.component.scss'],
})
export class OrganFemaleFrontModelComponent implements OnInit {
  constructor(public examSvc: ExamService) {}

  ngOnInit() {}
}


