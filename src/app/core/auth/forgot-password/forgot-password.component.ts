import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { NotificationType } from 'diflexmo-angular-design';
import { takeUntil } from 'rxjs';
import { ModalService } from 'src/app/core/services/modal.service';
import { DestroyableComponent } from 'src/app/shared/components/destroyable/destroyable.component';
import { NotificationDataService } from '../../services/notification-data.service';

export interface DialogData {
  titleText: string;
  bodyText: string;
  confirmButtonText: string;
  cancelButtonText: string;
}

@Component({
  selector: 'dfm-forgot-password',
  templateUrl: `forgot-password.component.html`,
  styles: [
    `
      .reset-password-container {
        margin: auto 0;
        padding: 0 16px;
      }
    `,
  ],
})
export class ForgotPasswordComponent extends DestroyableComponent implements OnInit, OnDestroy {
  public dialogData: DialogData = {
    confirmButtonText: 'Proceed',
    cancelButtonText: 'Cancel',
    titleText: 'Forgot Password',
    bodyText: 'Please enter your email address to continue',
  };
  public forgotPasswordControl = new FormControl('', Validators.required);

  constructor(private dialogSvc: ModalService, private notificationService: NotificationDataService) {
    super();
  }

  public ngOnInit() {

  }

  public override ngOnDestroy() {
    super.ngOnDestroy();
  }

  public close(result: boolean) {
    if (result){
        if(this.forgotPasswordControl.invalid){
            this.notificationService.showNotification("Please enter email first",NotificationType.WARNING)
            return;
        }
    }
    this.dialogSvc.close(result);
  }
}
