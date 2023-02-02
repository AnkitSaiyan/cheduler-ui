import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from 'src/app/core/services/auth.service';
import {Location} from '@angular/common';
import {take} from 'rxjs';

@Component({
  selector: 'dfm-sub-header',
  templateUrl: './sub-header.component.html',
  styleUrls: ['./sub-header.component.scss']
})
export class SubHeaderComponent implements OnInit {
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
  displayRegisterButton: boolean = false;
  url!: string;

  constructor(private authService: AuthService, private router: Router, private _location: Location) {
  }

  ngOnInit(): void {
    this.authService.isLoggedInUser.subscribe((user: boolean) => {
      this.displayRegisterButton = user;
    })

    this.displayRegisterButton = Boolean(localStorage.getItem('user'))
    this.url = this.router.url;
    this.router.events.subscribe((data: any) => {
      console.log('data: ', data.url);
      (data && data.url) ? this.url = data.url : '';
    })
    console.log('this.url: ', this.url);
  }

  back() {
    this.authService.isPending.pipe(take(1)).subscribe((pendingStatus: boolean) => {
      if (this.url === '/schedule-appointment/confirm-appointment' && pendingStatus) {
        this.router.navigate(['/schedule-appointment/overview']);
      } else {
        this._location.back();
      }
    })
  }

  checkDisplayHeader() {
    if (!this.displayRegisterButton) {
      this.router.navigate(['/']);
    }
  }

  public navigateToHome() {
    this.authService.isLoggedIn$.pipe().subscribe((isLoggedIn) => {
      if (isLoggedIn) {
        this.router.navigate(['/dashboard']);
      } else {
        this.router.navigate(['/']);
      }
    })
  }
}
