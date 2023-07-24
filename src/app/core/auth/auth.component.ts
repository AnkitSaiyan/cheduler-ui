import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthService} from '../services/auth.service';
import {map, Observable, takeUntil, tap} from "rxjs";
import {RouterStateService} from "../services/router-state.service";
import {DestroyableComponent} from "../../shared/components/destroyable/destroyable.component";

@Component({
  selector: 'dfm-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent extends DestroyableComponent implements OnInit, OnDestroy {
  public isLoggedIn$!: Observable<boolean>;

  public title: string = 'Login';

  public subTitle1: string = 'Get access to your appointments';
  public subTitle2: string = 'and test history'

  constructor(private authService: AuthService, private router: Router, private routerStateSvc: RouterStateService) {
    super();
  }

  public ngOnInit(): void {
    this.routerStateSvc.listenForUrlChange$().pipe(takeUntil(this.destroy$$)).subscribe((url) => {
      switch (url.split('/')[2]) {
        case 'login':
          this.title = 'Login';
          this.subTitle1 = 'Get access to your appointments';
          this.subTitle2 = 'and test history'
          break;
        case 'register':
          this.title = 'Looks like you are new here';
          this.subTitle1 = 'Register with your email';
          this.subTitle2 = 'to get started'
          break;
      }
    });
    this.isLoggedIn$ = this.authService.isLoggedIn$.pipe(tap((isLoggedIn) => {
      if (isLoggedIn) {

        this.router.navigate(['/dashboard']);
      }
    }));
  }

  public override ngOnDestroy() {
    super.ngOnDestroy();
  }
}

