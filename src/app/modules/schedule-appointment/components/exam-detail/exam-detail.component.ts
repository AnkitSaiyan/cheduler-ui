import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'dfm-exam-detail',
  templateUrl: './exam-detail.component.html',
  styleUrls: ['./exam-detail.component.scss'],
})
export class ExamDetailComponent implements OnInit {
  items: any = [
    {
      examName: 'Aanpasing steunzolen',
    },
    {
      examName: 'Levering steunzolen',
    },
    {
      examName: 'Maatname',
    },
  ];
  constructor() {}

  ngOnInit(): void {}
}

