import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {Observable} from "rxjs";
import {AuthService} from "../../../core/services/auth.service";

@Component({
  selector: 'dfm-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  url!: string;
  public isUserLoggedIn$!: Observable<boolean>;
  constructor(private router: Router, private authSvc: AuthService) { }

  ngOnInit(): void {
    this.url = this.router.url;
    this.isUserLoggedIn$ = this.authSvc.isLoggedIn$;

    this.router.events.subscribe((data: any)=>{
      console.log('data: ', data.url);
      (data && data.url)? this.url = data.url: '';
    })
  }

}
