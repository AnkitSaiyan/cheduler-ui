import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'dfm-core',
  templateUrl: './core.component.html',
  styleUrls: ['./core.component.scss']
})
export class CoreComponent implements OnInit {
  displaySidebar: boolean = false;
  url!: string;

  constructor(private authService: AuthService, private router: Router) { }

  public ngOnInit(): void {
    this.url = this.router.url;
    console.log('this.displaySidebar: ', this.displaySidebar);
    this.authService.isLoggedInUser.subscribe((user: boolean) => {
      user ? this.displaySidebar = true : this.displaySidebar = false;
    })
    this.displaySidebar = Boolean(localStorage.getItem('user'))

    this.router.events.subscribe((data: any)=>{
      console.log('data: ', data.url);
      (data && data.url)? this.url = data.url: '';
    })
  }

  public checkUrl() {
    this.router.events.subscribe((data: any) => {
      console.log('data: ', data.url);
      (data && data.url) ? this.url = data.url : '';
    })
  }

  public logOut(){
    this.authService.logout$();
  }
}
