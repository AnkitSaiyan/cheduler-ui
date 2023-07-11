import { Component, Input, OnInit } from '@angular/core';
import { ExamService } from 'src/app/core/services/exam.service';

@Component({
  selector: 'dfm-skeleton-model',
  templateUrl: './skeleton-model.component.html',
  styleUrls: ['./skeleton-model.component.scss'],
})
export class SkeletonModelComponent implements OnInit {
  constructor(public examSvc: ExamService) {}

  ngOnInit() {}

  public test2(i: number) {
    return i as any;
  }
}



