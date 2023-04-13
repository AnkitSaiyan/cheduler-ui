import {Component, OnDestroy} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Router} from '@angular/router';
import {DestroyableComponent} from '../../../shared/components/destroyable/destroyable.component';
import {AuthService} from '../../services/auth.service';
import {ModalService} from '../../services/modal.service';

@Component({
  selector: 'dfm-login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.scss'],
})
export class LoginComponent extends DestroyableComponent implements OnDestroy {
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

  public override ngOnDestroy() {
    super.ngOnDestroy();
  }

  logInUser() {
  }
}
