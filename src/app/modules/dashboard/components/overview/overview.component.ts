import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'dfm-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
  loginUserAppointment = new BehaviorSubject<boolean>(false);   
  url!: string;
  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  scheduleUserAppoointment(){
    this.loginUserAppointment.next(true);
    this.router.navigate(['/dashboard/exam']);
  }
}
