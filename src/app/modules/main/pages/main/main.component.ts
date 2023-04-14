import { Component, OnInit } from '@angular/core';
import { UserManagementService } from '../../../../core/services/user-management.service';
import { AuthService } from '../../../../core/services/auth.service';
import { take } from 'rxjs';

@Component({
  selector: 'dfm-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  constructor(private userManagementSvc: UserManagementService, private authSvc: AuthService) {}

  public ngOnInit(): void {
    const { userId } = this.authSvc;
    if (userId) {
      this.userManagementSvc.getAllPermits(userId).pipe(take(1)).subscribe();
    }
  }
}
