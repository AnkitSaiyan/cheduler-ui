import { Component, OnInit } from '@angular/core';
import { DestroyableComponent } from '../destroyable/destroyable.component';
import { Subject, lastValueFrom, take, takeUntil } from 'rxjs';
import { ModalService } from 'src/app/core/services/modal.service';
import { LandingService } from 'src/app/core/services/landing.service';
import { NotificationDataService } from 'src/app/core/services/notification-data.service';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';

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
    private httpClient: HttpClient,
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
    // if (this.isImage) {
      this.downloadImage(this.downloadableDoc);
    // } else {
      // this.downloadBrochure(this.getSanitizeImage(this.downloadableDoc));
    // }
  }

  public closeModal() {
    this.modalSvc.close();
  }

  private downloadImage(base64Data: string) {
    const blob = this.base64ToBlob(this.getSanitizeImage(base64Data));
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = this.fileName;
    a.target = '_self';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  private base64ToBlob(base64Data: string): Blob {
    const byteString = window.atob(base64Data.split(',')[1]);
    const mimeString = `${this.isImage ? 'image' : 'application'}/${this.fileName.split('.').slice(-1)}`;
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uint8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      uint8Array[i] = byteString.charCodeAt(i);
    }
    return new Blob([arrayBuffer], { type: mimeString });
  }

  private getSanitizeImage(base64: string): any {
    let url1: any = this.sanitizer.bypassSecurityTrustResourceUrl(base64);
    return url1.changingThisBreaksApplicationSecurity;
  }

  // async downloadBrochure(url: string) {
  //   try {
  //     const res = await lastValueFrom(this.httpClient.get(url, { responseType: 'blob' }));
  //     this.downloadFile(res);
  //   } catch (e: any) {
  //     console.log(e.body.message);
  //   }
  // }

  // downloadFile(data) {
  //   const url = window.URL.createObjectURL(data);
  //   const e = document.createElement('a');
  //   e.href = url;
  //   e.download = this.fileName;
  //   document.body.appendChild(e);
  //   e.click();
  //   document.body.removeChild(e);
  // }
}
