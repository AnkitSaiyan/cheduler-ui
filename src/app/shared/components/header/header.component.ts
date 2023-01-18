import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'dfm-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  items: any = [
    {
      name: 'EN',
      value: 'EN',
      discription: '',
    },
    {
      name: 'NL',
      value: 'NL',
      discription: '',
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
