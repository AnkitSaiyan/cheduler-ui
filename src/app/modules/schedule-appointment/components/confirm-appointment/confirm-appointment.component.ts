import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

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
  constructor() { }
  
  ngOnInit(): void {
  }
  displayValue(value: any){

    console.log('value: ', value);

  }
}
