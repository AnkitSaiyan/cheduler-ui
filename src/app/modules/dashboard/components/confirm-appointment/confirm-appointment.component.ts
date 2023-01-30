import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'dfm-confirm-appointment',
  templateUrl: './confirm-appointment.component.html',
  styleUrls: ['./confirm-appointment.component.scss'],
})
export class ConfirmAppointmentComponent implements OnInit {
  isPending: boolean = false;
  isCanceled: boolean = false;
  check1 = new FormControl('', []);
  check2 = new FormControl('', []);
  displayBasicDetails: boolean = false;
  
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.isLoggedInUser.subscribe((user: boolean) => {
      user === true ? (this.displayBasicDetails = false) : (this.displayBasicDetails = true);
    });
    this.displayBasicDetails = !Boolean(localStorage.getItem('user'));
  }
  displayValue(value: any) {
    console.log('value: ', value);
  }

  checkBoxStatus() {
    return !(Boolean(this.check1.value) && Boolean(this.check2.value));
  }

  setPendingStatus() {
    console.log("called");
    this.isPending = true;
    this.authService.isPending.next(this.isPending);
  }
}
