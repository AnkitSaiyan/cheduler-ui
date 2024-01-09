import { Component, OnInit } from '@angular/core';
import { DestroyableComponent } from '../destroyable/destroyable.component';
import { BehaviorSubject, Subject, take, takeUntil } from 'rxjs';
import { ModalService } from 'src/app/core/services/modal.service';
import { LandingService } from 'src/app/core/services/landing.service';
import { NotificationDataService } from 'src/app/core/services/notification-data.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ENG_BE } from '../../utils/const';
import { ShareDataService } from 'src/app/services/share-data.service';

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

  private selectedLang: string = ENG_BE;

  public documents$$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  public focusedDocument!: any;

  constructor(
    private modalSvc: ModalService,
    private landingSvc: LandingService,
    private notificationService: NotificationDataService,
    private sanitizer: DomSanitizer,
    private shareDataSvc: ShareDataService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.modalSvc.dialogData$.pipe(takeUntil(this.destroy$$)).subscribe((data) => {
      if (data?.documentList) {
        this.showDocuments(data?.documentList, data?.focusedDocId);
      } else {
        this.getDocument(data.id, data?.focusedDocId);
      }
    });

    this.shareDataSvc
      .getLanguage$()
      .pipe(takeUntil(this.destroy$$))
      .subscribe({
        next: (lang) => {
          this.selectedLang = lang;
        },
      });
  }

  public getDocument(id, focusedDocId?: number) {
    this.landingSvc
      .getDocumentById$(id, true)
      .pipe(takeUntil(this.destroy$$))
      .subscribe((res) => {
        this.showDocuments(res, focusedDocId);
      });
    this.landingSvc
      .getDocumentById$(id, false)
      .pipe(take(1))
      .subscribe((res) => {
        this.showDocuments(res, focusedDocId);
      });
  }

  private showDocuments(documentRes: any[], focusedDocId?: number) {
    this.documents$$.next(
      documentRes.map((res) => ({
        ...res,
        fileData: (!res.fileName.includes('.pdf') ? this.base64ImageStart : this.base64PdfStart) + res.fileData,
        isImage: !res.fileName.includes('.pdf'),
      })),
    );
    this.focusedDocument = this.documents$$.value?.find(({ id }) => id === focusedDocId) ?? this.documents$$.value[0];
  }

  public setFocus(docData: Document) {
    this.focusedDocument = docData;
  }

  public downloadDocument() {
    if (!this.focusedDocument) {
      return;
    }
    this.notificationService.showNotification('Downloading in progress...');
    this.downloadImage(this.downloadableDoc);
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
}

