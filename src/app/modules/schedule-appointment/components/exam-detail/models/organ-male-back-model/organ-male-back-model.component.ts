import { Component, OnInit } from '@angular/core';
import { ExamService } from 'src/app/core/services/exam.service';

@Component({
  selector: 'dfm-organ-male-back-model',
  templateUrl: './organ-male-back-model.component.html',
  styleUrls: ['./organ-male-back-model.component.scss'],
})
export class OrganMaleBackModelComponent implements OnInit {
  constructor(public examSvc: ExamService) {}

  ngOnInit() {}
}


