import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'dfm-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  loginUserAppointment = new BehaviorSubject<boolean>(false);   
  url!: string;
  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  scheduleUserAppoointment(){
    this.loginUserAppointment.next(true);
    this.router.navigate(['/schedule-appointment/exam']);
  }
}
