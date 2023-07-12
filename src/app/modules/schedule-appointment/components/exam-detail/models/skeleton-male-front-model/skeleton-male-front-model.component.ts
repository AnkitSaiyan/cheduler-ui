import { Component, Input, OnInit } from '@angular/core';
import { ExamService } from 'src/app/core/services/exam.service';

@Component({
  selector: 'dfm-skeleton-male-front-model',
  templateUrl: './skeleton-male-front-model.component.html',
  styleUrls: ['./skeleton-male-front-model.component.scss'],
})
export class SkeletonMaleFrontModelComponent implements OnInit {
  constructor(public examSvc: ExamService) {}

  ngOnInit() {}

  public test2(i: number) {
    return i as any;
  }
}

