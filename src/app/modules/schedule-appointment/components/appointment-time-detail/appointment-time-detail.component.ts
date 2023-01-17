import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'dfm-appointment-time-detail',
  templateUrl: './appointment-time-detail.component.html',
  styleUrls: ['./appointment-time-detail.component.scss'],
})
export class AppointmentTimeDetailComponent implements OnInit {
  displayAppointmentDetails: boolean = false;
  days: string[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  months: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  currentDate = new Date();
  currentMonth: number = this.currentDate.getMonth();
  displayMonth: string = this.months[this.currentDate.getMonth()];
  currentYear: number = this.currentDate.getFullYear();
  totalDaysInMonth!: number;
  totalDays: number[] = [];
  isTimeSlotAvailable: boolean = false;
  
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.calculateTotalDays();
    this.authService.isLoggedInUser.subscribe((user: boolean) => {
      user === true ? (this.displayAppointmentDetails = false) : (this.displayAppointmentDetails = true);
    });
  }


  getNextMonth() {
    (this.currentMonth >=0 && this.currentMonth <11)  ? this.currentMonth += 1 : this.currentMonth = 11;

    console.log('this.NextMonth: ', this.currentMonth); 
    this.months.forEach((month: string, index: number)=>{
      this.months[index]
      if (this.currentMonth === index) {
        console.log('this.months[index]: ', this.months[index]);
        this.displayMonth = this.months[index]
      }
    })
  }

  getPreviousMonth() {
    (this.currentMonth && this.currentMonth >=0)? this.currentMonth -= 1 : this.currentMonth = 0;

    this.months.forEach((month: string, index: number)=>{
      this.months[index]
      if (this.currentMonth === index) {
        console.log('this.months[index]: ', this.months[index]);
        this.displayMonth = this.months[index]
      }
    })
    console.log('this.PreviousMonth: ', this.currentMonth);
  }

  getCurrentYear() {
    this.currentYear = new Date().getFullYear();
    console.log('this.currentYear: ', this.currentYear);
  }


  getDaysInMonth(month, year) {
    console.log('year: ', year);
    console.log('month: ', month);
    this.totalDaysInMonth = new Date(year, month, 0).getDate();
    this.calculateTotalDays(this.totalDaysInMonth)
  }

  calculateTotalDays(monthCount?) {
    let now;
    let totalDay;

    if (monthCount) {      
      now = new Date();
      totalDay = monthCount
    }
    now = new Date();
    totalDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    for (let i = 1; i <= Number(totalDay); i++) {
      this.totalDays.push(i);
    }
    console.log('this.totalDays: ', this.totalDays);
  }

  showTimeSlot(dayCount){
    if(dayCount === 21){
      this.isTimeSlotAvailable = true;
    }
  }
}
