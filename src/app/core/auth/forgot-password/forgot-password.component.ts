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
  template: `
    <div #content class="bg-white rounded-4 confirm-action-modal">
      <div class="modal-header">
        <h5 class="modal-title">{{ dialogData.titleText }}</h5>
        <dfm-button-icon color="tertiary-gray" icon="x-close" (click)="close(false)"></dfm-button-icon>
      </div>

      <div class="modal-body">
        <p class="dfm-m-0">{{ dialogData.bodyText }}</p>
        <dfm-input [formControl]="forgotPasswordControl" size="md" placeholder="Enter Email"></dfm-input>
      </div>

      <div class="modal-footer">
        <dfm-button color="secondary" size="md" (click)="close(false)">{{ dialogData.cancelButtonText }}</dfm-button>
        <dfm-button color="primary" size="md" (click)="close(true)">{{ dialogData.confirmButtonText }}</dfm-button>
      </div>
    </div>
  `,
  styles: [
    `
      @media (max-width: 680px) {
        .confirm-action-modal {
          margin: auto 16px;
        }

        dfm-button {
          height: 44px;
          flex: 1;
        }
      }
    `,
  ],
})
export class ForgotPasswordComponent extends DestroyableComponent implements OnInit, OnDestroy {
  public dialogData: DialogData = {
    confirmButtonText: 'Proceed',
    cancelButtonText: 'Cancel',
    titleText: 'Forgot Password Confirmation',
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
