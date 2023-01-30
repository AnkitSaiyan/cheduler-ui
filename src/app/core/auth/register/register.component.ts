import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {AuthService} from "../../services/auth.service";

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

  constructor(private router : Router, private authSvc: AuthService) { }

  ngOnInit(): void {
  }

  logInUser(){
    this.authSvc.login$().pipe().subscribe(() => {
      this.router.navigate(['/dashboard']);
    });
  }

}
