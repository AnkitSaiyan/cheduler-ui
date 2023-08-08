import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalService } from 'src/app/core/services/modal.service';
import { DestroyableComponent } from '../destroyable/destroyable.component';
import { Observable, of, takeUntil, timer } from 'rxjs';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { LandingService } from 'src/app/core/services/landing.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { SignalRService } from 'src/app/core/services/signal-r.service';
import { NotificationDataService } from 'src/app/core/services/notification-data.service';
import { NotificationType } from 'diflexmo-angular-design';
import { Translate } from '../../models/translate.model';
import { ENG_BE } from '../../utils/const';

@Component({
  selector: 'dfm-qr-modal',
  template: `
    <div class="container">
      <h5 class="dfm-color-primary font-weight-high qr-heading">Scan QR code to upload referral note from Mobile device</h5>
      <ng-container *ngIf="!(img | async); else loaded">
        <div class="d-flex justify-content-center align-items-center w-full flex-1">
          <mat-spinner diameter="48"></mat-spinner>
        </div>
      </ng-container>
      <ng-template #loaded>
        <div *ngIf="counter" class="flex-1 d-flex justify-content-center mt-2">
          <img [src]="img | async" alt="QR" width="200px" />
        </div>
        <span class="flex-1 d-flex justify-content-center mb-2 gap-2 flex-column">
          <span *ngIf="counter" class="flex-1 justify-content-center dfm-color-primary d-flex">0{{ minutes }}:{{ seconds }}</span>
          <span *ngIf="!counter" class="flex-1 justify-content-center d-flex flex-column align-items-center dfm-gap-12">
            <img src="../../../../assets/images/qr-code.png" class="qr-expire-img" alt="QR" />
            <span>Your QR has been expired. Please generate a new QR.</span>
            <a class="dfm-color-primary" href="javascript:void(0);" (click)="getQR()">Generate new QR code</a></span
          >
        </span>
      </ng-template>
      <dfm-button color="primary" class="d-flex justify-content-center mb-2" (click)="close()" size="sm">{{ 'Close' | translate }}</dfm-button>
    </div>
  `,
  styles: [
    `
      .container {
        display: flex;
        justify-content: center;
        gap: 10px;
        flex-direction: column;
        background-color: white;
        border-radius: 10px;
      }

      .qr-heading {
        font-weight: 600;
        margin: 20px 10px 0 10px;
        text-align: center;
      }

      .qr-expire-img {
        width: 20vh;
        background-color: #e0dde4;
      }
    `,
  ],
})
export class QrModalComponent extends DestroyableComponent implements OnInit, OnDestroy {
  public img!: Observable<SafeResourceUrl>;

  public minutes!: number;

  public seconds!: string;

  public counter!: number;

  private connectionId!: string;

  private appointmentId!: string;

  private language = ENG_BE;

  constructor(
    private dialogSvc: ModalService,
    private landingSvc: LandingService,
    private _sanitizer: DomSanitizer,
    public loaderSvc: LoaderService,
    private signalrSvc: SignalRService,
    private notificationSvc: NotificationDataService,
    private modalSvc: ModalService,
  ) {
    super();
  }

  public ngOnInit() {
    this.language = localStorage.getItem('lang') || ENG_BE;
    this.modalSvc.dialogData$.pipe(takeUntil(this.destroy$$)).subscribe((data) => {
      this.appointmentId = data.id;
      this.getSignalrId();
    });
  }

  public override ngOnDestroy() {
    super.ngOnDestroy();
  }

  private getSignalrId() {
    this.signalrSvc
      .getConnectionId()
      .then((res) => {
        this.connectionId = res;
        this.getQR();
      })
      .catch((err) => {
        this.notificationSvc.showNotification(Translate.Error.SomethingWrong[this.language], NotificationType.DANGER);
        this.signalrSvc.makeConnection();
        this.close();
      });
  }

  public getQR() {
    this.landingSvc
      .getQr(this.connectionId, this.appointmentId)
      .pipe(takeUntil(this.destroy$$))
      .subscribe({
        next: (res) => {
          this.img = of(this._sanitizer.bypassSecurityTrustResourceUrl(`data:image/png;base64, ${res.qrCodeContent}`));
          this.countdown();
        },
        error: (err) => {
          this.notificationSvc.showNotification(
            Translate.Error.BackendCodes[this.language][err?.error?.message] || Translate.Error.SomethingWrong[this.language],
            NotificationType.DANGER,
          );
        }
      });
  }

  private countdown() {
    this.counter = 300;
    let countdown = timer(0, 1000)
      .pipe(takeUntil(this.destroy$$))
      .subscribe(() => {
        if (!this.counter) countdown.unsubscribe();
        else {
          --this.counter;
          this.minutes = Math.floor(this.counter / 60);
          this.seconds = this.counter % 60 < 10 ? '0' + (this.counter % 60) : (this.counter % 60).toString();
        }
      });
  }

  public close() {
    this.dialogSvc.close();
  }
}
