import { Component, OnInit } from '@angular/core';
import { DestroyableComponent } from '../destroyable/destroyable.component';
import { Subject, take, takeUntil } from 'rxjs';
import { ModalService } from 'src/app/core/services/modal.service';
import { LandingService } from 'src/app/core/services/landing.service';
import { NotificationDataService } from 'src/app/core/services/notification-data.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'dfm-document-view-modal',
  templateUrl: './document-view-modal.component.html',
  styleUrls: ['./document-view-modal.component.scss'],
})
export class DocumentViewModalComponent extends DestroyableComponent implements OnInit {
  private readonly base64ImageStart = 'data:image/*;base64,';

  private readonly base64PdfStart = 'data:application/pdf;base64,';

  public image = new Subject<any>();

  private downloadableDoc!: string;

  public fileName!: string;

  public isImage: boolean = true;

  private isDownloadClick: boolean = false;

  constructor(
    private modalSvc: ModalService,
    private landingSvc: LandingService,
    private notificationService: NotificationDataService,
    private sanitizer: DomSanitizer,
  ) {
    super();
  }

  ngOnInit(): void {
    this.modalSvc.dialogData$.pipe(takeUntil(this.destroy$$)).subscribe((data) => {
      this.getDocument(data.id);
    });
  }

  public getDocument(id) {
    this.landingSvc
      .getDocumentById$(id, true)
      .pipe(takeUntil(this.destroy$$))
      .subscribe((res) => {
        this.isImage = !res.fileName.includes('.pdf');
        if (!this.downloadableDoc) this.image.next((this.isImage ? this.base64ImageStart : this.base64PdfStart) + res.fileData);
        this.fileName = res.fileName;
      });
    this.landingSvc
      .getDocumentById$(id, false)
      .pipe(take(1))
      .subscribe((res) => {
        this.image.next((!res.fileName.includes('.pdf') ? this.base64ImageStart : this.base64PdfStart) + res.fileData);
        this.downloadableDoc = (res.fileName.includes('.pdf') ? this.base64PdfStart : this.base64ImageStart) + res.fileData;
        if (this.isDownloadClick) this.downloadDocument();
      });
  }

  public downloadDocument() {
    if (!this.downloadableDoc) {
      this.isDownloadClick = true;
      this.notificationService.showNotification('Downloading in progress...');
      return;
    }
    this.downloadImage(this.downloadableDoc);
  }

  public closeModal() {
    this.modalSvc.close();
  }

  private downloadImage(base64Data: string) {
    let url1: any = this.sanitizer.bypassSecurityTrustResourceUrl(base64Data);
    const blob = this.base64ToBlob(url1.changingThisBreaksApplicationSecurity);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = this.fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  private base64ToBlob(base64Data: string): Blob {
    const byteString = window.atob(base64Data.split(',')[1]);
    const mimeString = `${this.isImage ? 'image' : 'application'}/${(this.fileName.split('.').slice(-1))}`;
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uint8Array = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteString.length; i++) {
      uint8Array[i] = byteString.charCodeAt(i);
    }

    return new Blob([arrayBuffer], { type: mimeString });
  }
}
