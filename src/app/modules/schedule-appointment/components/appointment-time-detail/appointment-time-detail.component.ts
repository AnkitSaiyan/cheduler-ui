import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'dfm-appointment-time-detail',
  templateUrl: './appointment-time-detail.component.html',
  styleUrls: ['./appointment-time-detail.component.scss']
})
export class AppointmentTimeDetailComponent implements OnInit {
  displayAppointmentDetails: boolean = false;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.isLoggedInUser.subscribe((user: boolean) => {
      (user === true)? this.displayAppointmentDetails = false : this.displayAppointmentDetails = true;
    })
  }

}
