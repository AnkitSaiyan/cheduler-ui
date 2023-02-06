import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {Observable} from "rxjs";
import {AuthService} from "../../../../core/services/auth.service";

@Component({
  selector: 'dfm-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
  public isLoggedIn$!: Observable<boolean>

  constructor(private authSvc: AuthService) { }

  ngOnInit(): void {
    this.isLoggedIn$ = this.authSvc.isLoggedIn$;
  }

}
