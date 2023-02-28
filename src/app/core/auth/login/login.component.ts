import { DestroyableComponent } from '../../../shared/components/destroyable/destroyable.component';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ModalService } from '../../services/modal.service';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';
import { filter, take } from 'rxjs';

@Component({
  selector: 'dfm-login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.scss'],
})
export class LoginComponent extends DestroyableComponent implements OnInit, OnDestroy {
  public isPassword = new FormControl();
  ipType: any = 'password';
  items: any = [
    {
      name: 'EN',
      value: 'EN',
      description: '',
    },
    {
      name: 'NL',
      value: 'NL',
      description: '',
    },
  ];

  constructor(private authService: AuthService, private router: Router, private modalService: ModalService) {
    super();
  }

  public ngOnInit() {}

  public override ngOnDestroy() {
    super.ngOnDestroy();
  }

  logInUser() {
    // this.authService.isLoggedInUser.next(true);
    this.authService
      .login$()
      .pipe()
      .subscribe(() => {
        this.router.navigate(['/dashboard']);
      });
  }
  public forgotPassword() {
    const modalRef = this.modalService.open(ForgotPasswordComponent);
    modalRef.closed
      .pipe(
        filter((res: boolean) => res),
        take(1),
      )
      .subscribe(() => {});
  }
}
