import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalService } from 'src/app/core/services/modal.service';
import { DestroyableComponent } from '../destroyable/destroyable.component';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'dfm-qr-modal',
  template: `
  <div class="container">
    <div class="d-flex justify-content-center mt-2">
      <img [src]="img" alt="QR" width="200px">
    </div>
    <dfm-button color="primary" class="d-flex justify-content-center mb-2" (click)="close()" size="sm">Done</dfm-button>
    </div>
  `,
  styles: [`
    .container{
      display : flex;
      justify-content:center;
      gap: 10px;
      flex-direction : column;
      background-color: white;
      border-radius: 10px;
    }
  `]
})
export class QrModalComponent extends DestroyableComponent implements OnInit, OnDestroy{

  public img : any;

  constructor(private dialogSvc: ModalService) {
    super();
   }

   public ngOnInit() {
    this.dialogSvc.dialogData$.pipe(takeUntil(this.destroy$$)).subscribe((data: any) => {
       this.img = data.img;
    });
  }

  public override ngOnDestroy() {
    super.ngOnDestroy();
  }

  public close() {
    this.dialogSvc.close();
  }

}