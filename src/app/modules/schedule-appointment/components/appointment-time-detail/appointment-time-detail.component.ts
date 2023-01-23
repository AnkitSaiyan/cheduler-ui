import { Component, OnInit} from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'dfm-appointment-time-detail',
  templateUrl: './appointment-time-detail.component.html',
  styleUrls: ['./appointment-time-detail.component.scss'],
})
export class AppointmentTimeDetailComponent implements OnInit {
  displayAppointmentDetails: boolean = false;
  days: string[] = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  months: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  timeSlots: string[] = ['10:30A.M-10:45A.M', '11:00A.M-11:15A.M', '11:45 A.M -12:00P.M']
  timeSlots1: string[]= ['01:00P.M-01:15P.M', '01:30 P.M-01:45P.M', '02:00 P.M-02:15P.M']
  currentDate = new Date();
  currentMonth: number = this.currentDate.getMonth();
  displayMonth: string = this.months[this.currentDate.getMonth()];
  currentYear: number = this.currentDate.getFullYear();
  totalDaysInMonth!: number;
  totalDays: number[] = [];
  isTimeSlotAvailable: boolean = false;
  isHoliday: boolean = false;
  isHighLightTime: boolean = false;
  firstDayOfMonth: any = new Date(this.currentYear, this.currentMonth, 1);
  dayStartCount!: number;
  selectedDate: number = 0;
  setSelectedSlot: string = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.firstDayOfMonth = this.days[this.firstDayOfMonth.getDay()];
    console.log('this.firstDayOfMonth: ', this.firstDayOfMonth);
    this.getDaysInMonth(this.currentMonth, this.currentYear);
    this.displayAppointmentDetails = Boolean(localStorage.getItem('user'))

    this.authService.isLoggedInUser.subscribe((user: boolean) => {
      user === true ? (this.displayAppointmentDetails = false) : (this.displayAppointmentDetails = true);
    });

    this.displayAppointmentDetails = !Boolean(localStorage.getItem('user'));
    this.days.forEach((day: string, index: number)=>{
      if(day === this.firstDayOfMonth){
        this.dayStartCount = index;
      }
    })
    console.log('this.dayStartCount: ', this.dayStartCount);
  }

  getNextMonth() {
    this.currentMonth >= 0 && this.currentMonth < 11 ? (this.currentMonth += 1) : (this.currentMonth = 11);
    console.log('this.currentMonth: ', this.currentMonth);
    this.firstDayOfMonth = new Date(this.currentYear, this.currentMonth, 1);
    this.firstDayOfMonth = this.days[this.firstDayOfMonth.getDay()];

    console.log('this.firstDayOfMonth: 52 ', this.firstDayOfMonth);
    
    this.days.forEach((day: string, index: number)=>{
      console.log('day: ', day);
      if(day === this.firstDayOfMonth){
        this.dayStartCount = index;
        console.log('this.dayStartCount: ', this.dayStartCount);
      }
    })

    this.months.forEach((month: string, index: number) => {
      this.months[index];
      if (this.currentMonth === index) {
        console.log('this.months[index]: ', this.months[index]);
        this.getDaysInMonth(index, this.currentYear);
        this.displayMonth = this.months[index];
      }
    });
  }

  getPreviousMonth() {
    this.currentMonth && this.currentMonth >= 0 ? (this.currentMonth -= 1) : (this.currentMonth = 0);

    this.firstDayOfMonth = new Date(this.currentYear, this.currentMonth, 1);
    this.firstDayOfMonth = this.days[this.firstDayOfMonth.getDay()];
    
    this.days.forEach((day: string, index: number)=>{
      if(day === this.firstDayOfMonth){
        this.dayStartCount = index;
      }
    })

    this.months.forEach((month: string, index: number) => {
      this.months[index];
      if (this.currentMonth === index) {
        console.log('this.months[index]: ', this.months[index]);
        this.getDaysInMonth(index, this.currentYear);
        this.displayMonth = this.months[index];
      }
    });
    console.log('this.PreviousMonth: ', this.currentMonth);

  }

  getCurrentYear() {
    this.currentYear = new Date().getFullYear();
    console.log('this.currentYear: ', this.currentYear);
  }

  getDaysInMonth(month, year) {
    console.log('year: ', year);
    console.log('month: ', month);
    this.totalDaysInMonth = new Date(year, month + 1, 0).getDate();
    this.calculateTotalDays(this.totalDaysInMonth);
  }

  calculateTotalDays(monthCount?) {
    console.log('monthCount: ', monthCount);
    let now;
    let totalDay;

    if (monthCount) {
      now = new Date();
      totalDay = monthCount;
    }
    now = new Date();
    this.totalDays = [];
    for (let i = 1; i <= Number(monthCount); i++) {
      (i === 9 )? this.isHoliday = true: this.isHoliday = false;
      this.totalDays.push(i);
    }
  }

  showTimeSlot(dayCount) {
    if (dayCount) {
      this.selectedDate = dayCount;
      this.isTimeSlotAvailable = true;
    }
  }

  highLightTime(slots){
    this.setSelectedSlot = slots;
  }
  
}
