import {DestroyableComponent} from "../../../shared/components/destroyable/destroyable.component";
import {Component, OnDestroy, OnInit} from "@angular/core";
import {FormControl} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'dfm-login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.scss'],
})
export class LoginComponent extends DestroyableComponent implements OnInit, OnDestroy {
  public isPassword = new FormControl();
  ipType: any = "password";
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
    }
  ];

  constructor(private authService: AuthService, private router: Router) {
    super();
  }

  public ngOnInit() {
  }

  public override ngOnDestroy() {
    super.ngOnDestroy();
  }

  logInUser(){
    // this.authService.isLoggedInUser.next(true);
    localStorage.setItem('user', 'true');
    this.router.navigate(['/dashboard/overview']);
  }
}
