import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'dfm-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  url!: string;
  isUserLoggedIn: boolean = false;
  constructor(private router: Router) { }
  
  ngOnInit(): void {
    this.url = this.router.url;
    this.isUserLoggedIn = Boolean(localStorage.getItem('user'))

    this.router.events.subscribe((data: any)=>{
      console.log('data: ', data.url);
      (data && data.url)? this.url = data.url: '';
    })
  }

}
