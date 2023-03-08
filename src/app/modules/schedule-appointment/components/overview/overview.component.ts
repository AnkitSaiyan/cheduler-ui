import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { AuthService } from '../../../../core/services/auth.service';
import { LandingService } from '../../../../core/services/landing.service';

@Component({
  selector: 'dfm-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
})
export class OverviewComponent implements OnInit {
  public isLoggedIn$!: Observable<boolean>;

  public siteSetting: any;

  constructor(private authSvc: AuthService, public sharedService: LandingService) {}

  ngOnInit(): void {
    // localStorage.removeItem('examDetails');
    this.sharedService.siteDetails$
      .pipe(
        map((exams) => {
          this.siteSetting = exams['data'];
          localStorage.setItem('siteDetails', JSON.stringify(exams));
          // this.sharedService.siteFooterDetails$$.next(exams);
        }),
      )
      .subscribe();
    this.isLoggedIn$ = this.authSvc.isLoggedIn$;
  }
}
