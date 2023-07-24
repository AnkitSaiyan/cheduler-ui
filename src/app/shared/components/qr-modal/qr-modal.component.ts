import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalService } from 'src/app/core/services/modal.service';
import { DestroyableComponent } from '../destroyable/destroyable.component';
import { Observable, of, takeUntil, timer } from 'rxjs';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { LandingService } from 'src/app/core/services/landing.service';
import { LoaderService } from 'src/app/core/services/loader.service';

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
          <img src="../../../../assets/images/qr-code.png" class="qr-expire-img" alt="QR">
          <span>Your QR has been expired. Please generate a new QR.</span>
          <a class="dfm-color-primary" href="javascript:void(0);" (click)="getQR()">Generate new QR code</a></span>
        </span>
      </ng-template>
      <dfm-button color="primary" class="d-flex justify-content-center mb-2" (click)="close()" size="sm">Done</dfm-button>
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

      .qr-expire-img{
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

  constructor(
    private dialogSvc: ModalService,
    private landingSvc: LandingService,
    private _sanitizer: DomSanitizer,
    public loaderSvc: LoaderService,
  ) {
    super();
  }

  public ngOnInit() {
    this.getQR();
  }

  public override ngOnDestroy() {
    super.ngOnDestroy();
  }

  public getQR() {
    this.landingSvc
      .getQr()
      .pipe(takeUntil(this.destroy$$))
      .subscribe((res) => {

        this.img = of(this._sanitizer.bypassSecurityTrustResourceUrl(`data:image/png;base64, ${res.qrCodeContent}`));
        this.countdown();
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
          this.seconds = (this.counter % 60) < 10 ? '0' + (this.counter % 60) : (this.counter % 60).toString();
        }
     });
  }

  public close() {
    this.dialogSvc.close();
  }

}
