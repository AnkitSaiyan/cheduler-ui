import { Component, OnInit } from '@angular/core';
import { ExamService } from 'src/app/core/services/exam.service';

@Component({
  selector: 'dfm-organ-female-back-model',
  templateUrl: './organ-female-back-model.component.html',
  styleUrls: ['./organ-female-back-model.component.scss'],
})
export class OrganFemaleBackModelComponent implements OnInit {
  constructor(public examSvc: ExamService) {}

  ngOnInit() {}
}


