import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'dfm-basic-detail',
  templateUrl: './basic-detail.component.html',
  styleUrls: ['./basic-detail.component.scss']
})
export class BasicDetailComponent implements OnInit {
  displayBasicDetails: boolean = false;
  basicDetailsForm!: FormGroup;
  public firstName = new FormControl();
  public lastName = new FormControl();
  public email = new FormControl();
  public phone = new FormControl();
  constructor(private authService: AuthService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.displayBasicDetails =   Boolean(localStorage.getItem('user'))
    this.authService.isLoggedInUser.subscribe((user: boolean) => {
      (user === true)? this.displayBasicDetails = false : this.displayBasicDetails = true;
    })
  }

}
