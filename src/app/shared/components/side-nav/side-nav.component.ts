import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../../core/services/auth.service";

@Component({
  selector: 'dfm-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss']
})
export class SideNavComponent implements OnInit {

  constructor(private authSvc: AuthService) { }

  public ngOnInit(): void {
  }

  public logout() {
    this.authSvc.logout$();
  }
}
