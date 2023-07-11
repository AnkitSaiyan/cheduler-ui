import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'dfm-skeleton-model',
  templateUrl: './skeleton-model.component.html',
  styleUrls: ['./skeleton-model.component.scss'],
})
export class SkeletonModelComponent implements OnInit {
  @Input() exams: any = [];
  constructor() {}

  ngOnInit() {}

  public test2(i: number) {
    return i as any;
  }
}

