import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'dfm-referral-physician',
  templateUrl: './referral-physician.component.html',
  styleUrls: ['./referral-physician.component.scss'],
})
export class ReferralPhysicianComponent implements OnInit {
  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {}

  public saveReferralPhysicianDetail() {
    this.router.navigate(['../exam'], { relativeTo: this.route, replaceUrl: true });
  }
}

