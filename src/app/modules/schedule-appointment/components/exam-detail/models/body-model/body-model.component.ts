import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'dfm-body-model',
  templateUrl: './body-model.component.html',
  styleUrls: ['./body-model.component.scss'],
})
export class BodyModelComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
  public clickTest(name: string) {
    console.log(name);
  }
}

