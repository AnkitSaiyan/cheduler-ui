import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'dfm-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  public isPassword = new FormControl();
  ipType: any = "password";
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

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  logInUser(){
    // this.authService.isLoggedInUser.next(true);
    localStorage.setItem('user', 'true');
    this.router.navigate(['/dashboard']);
  }
}
