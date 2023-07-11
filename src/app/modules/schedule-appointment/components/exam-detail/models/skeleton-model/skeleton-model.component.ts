import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'dfm-skeleton-model',
  templateUrl: './skeleton-model.component.html',
  styleUrls: ['./skeleton-model.component.scss'],
})
export class SkeletonModelComponent implements OnInit {
  constructor() {}

  public bodyPart: any = ['skull' as any, 'spine', 'sacrum'];

  public test = 'skull' as any;

  ngOnInit() {}

  public test2(i: number) {
    return i as any;
  }
}

