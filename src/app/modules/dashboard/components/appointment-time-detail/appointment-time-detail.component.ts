import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'dfm-appointment-slot',
  templateUrl: './appointment-time-detail.component.html',
  styleUrls: ['./appointment-time-detail.component.scss'],
})
export class AppointmentTimeDetailComponent implements OnInit {
  displayAppointmentDetails: boolean = false;
  days: string[] = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  months: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  timeSlots: string[] = ['10:30-10:45', '11:00-11:15', '11:45 -00:00','11:30-11:45', '00:15-00:30',];
  timeSlots1: string[] = ['13:00-13:15', '13:30-13:45', '14:00-14:15','13:15-13:30', '13:30-13:50'];
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

    this.getDaysInMonth(this.currentMonth, this.currentYear);
    this.displayAppointmentDetails = Boolean(localStorage.getItem('user'));

    this.authService.isLoggedInUser.subscribe((user: boolean) => {
      user === true ? (this.displayAppointmentDetails = false) : (this.displayAppointmentDetails = true);
    });

    this.displayAppointmentDetails = !Boolean(localStorage.getItem('user'));
    this.days.forEach((day: string, index: number) => {
      if (day === this.firstDayOfMonth) {
        this.dayStartCount = index;
      }
    });
  }

  getNextMonth() {
    this.currentMonth >= 0 && this.currentMonth < 11 ? (this.currentMonth += 1) : (this.currentMonth = 11);

    this.firstDayOfMonth = new Date(this.currentYear, this.currentMonth, 1);
    this.firstDayOfMonth = this.days[this.firstDayOfMonth.getDay()];

    this.days.forEach((day: string, index: number) => {
      if (day === this.firstDayOfMonth) {
        this.dayStartCount = index;
      }
    });

    this.months.forEach((month: string, index: number) => {
      this.months[index];
      if (this.currentMonth === index) {
        this.getDaysInMonth(index, this.currentYear);
        this.displayMonth = this.months[index];
      }
    });
  }

  getPreviousMonth() {
    this.currentMonth && this.currentMonth >= 0 ? (this.currentMonth -= 1) : (this.currentMonth = 0);

    this.firstDayOfMonth = new Date(this.currentYear, this.currentMonth, 1);
    this.firstDayOfMonth = this.days[this.firstDayOfMonth.getDay()];

    this.days.forEach((day: string, index: number) => {
      if (day === this.firstDayOfMonth) {
        this.dayStartCount = index;
      }
    });

    this.months.forEach((month: string, index: number) => {
      this.months[index];
      if (this.currentMonth === index) {
        this.getDaysInMonth(index, this.currentYear);
        this.displayMonth = this.months[index];
      }
    });
  }

  getCurrentYear() {
    this.currentYear = new Date().getFullYear();
  }

  getDaysInMonth(month, year) {
    this.totalDaysInMonth = new Date(year, month + 1, 0).getDate();
    this.calculateTotalDays(this.totalDaysInMonth);
  }

  calculateTotalDays(monthCount?) {
    let now;
    let totalDay;

    if (monthCount) {
      now = new Date();
      totalDay = monthCount;
    }
    now = new Date();
    this.totalDays = [];
    for (let i = 1; i <= Number(monthCount); i++) {
      i === 9 ? (this.isHoliday = true) : (this.isHoliday = false);
      this.totalDays.push(i);
    }
  }

  showTimeSlot(dayCount) {
    if (dayCount) {
      this.selectedDate = dayCount;
      this.isTimeSlotAvailable = true;
    }
  }

  highLightTime(slots) {
    this.setSelectedSlot = slots;
  }
}
