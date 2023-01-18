import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'dfm-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
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
