import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoggedInUser = new BehaviorSubject<boolean>(false);
  constructor() { }

  userLoginCheck(){
    let userLoggedIn = Boolean(localStorage.getItem('user'));
    return !userLoggedIn;
  }
}
