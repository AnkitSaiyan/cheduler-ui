import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'dfm-confirm-appointment',
  templateUrl: './confirm-appointment.component.html',
  styleUrls: ['./confirm-appointment.component.scss']
})
export class ConfirmAppointmentComponent implements OnInit {
  isPending: boolean = false;
  isCanceled:boolean = false;
  check1: boolean = false;
  check2: boolean = false;
  displayBasicDetails: boolean = false;
  constructor(private authService: AuthService) { }
  
  ngOnInit(): void {
    this.authService.isLoggedInUser.subscribe((user: boolean) => {
      (user === true)? this.displayBasicDetails = false : this.displayBasicDetails = true;
    })
    this.displayBasicDetails = !Boolean(localStorage.getItem('user'))
  }
  displayValue(value: any){
    console.log('value: ', value);
  }

  setPendingStatus(){
    // this.isPending = true;
    this.authService.isPending.next(true);
  }
}
