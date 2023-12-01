import {Component, OnDestroy} from '@angular/core';
import {FormControl} from '@angular/forms';
import {DestroyableComponent} from '../../../shared/components/destroyable/destroyable.component';
import { ScheduleAppointmentService } from '../../services/schedule-appointment.service';

@Component({
  selector: 'dfm-login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.scss'],
})
export class LoginComponent extends DestroyableComponent implements OnDestroy {
  public isPassword = new FormControl();

  ipType: any = 'password';

  items: any = [
    {
      name: 'EN',
      value: 'EN',
      description: '',
    },
    {
      name: 'NL',
      value: 'NL',
      description: '',
    },
  ];

  constructor(
    private scheduleAppointmentSvc: ScheduleAppointmentService,
  ) {
    super();
  }

  public override ngOnDestroy() {
    super.ngOnDestroy();
  }

  resetAppointmentData() {
    this.scheduleAppointmentSvc.resetDetails(true);
  }

  logInUser() {
    console.log("No function");
  }
}
