import { Component, OnInit } from '@angular/core';
import { DestroyableComponent } from '../destroyable/destroyable.component';
import { Subject, takeUntil } from 'rxjs';
import { ModalService } from 'src/app/core/services/modal.service';
import { LandingService } from 'src/app/core/services/landing.service';

@Component({
  selector: 'dfm-document-view-modal',
  templateUrl: './document-view-modal.component.html',
  styleUrls: ['./document-view-modal.component.scss'],
})
export class DocumentViewModalComponent extends DestroyableComponent implements OnInit {
  private base64ImageStart = 'data:image/*;base64,';

  private base64PdfStart = 'data:application/pdf;base64,';

  public image = new Subject<any>();

  private downloadableImage!: string;

  private fileName!: string;

  public isImage: boolean = true;

  constructor(private modalSvc: ModalService, private landingSvc: LandingService) {
    super();
  }

  ngOnInit(): void {
    this.modalSvc.dialogData$.pipe(takeUntil(this.destroy$$)).subscribe((data) => {
      this.getDocument(data.id);
    });
  }

  public getDocument(id) {
    this.landingSvc.getDocumentById$(id).subscribe((res) => {
      this.isImage = !res.fileName.includes('.pdf');
      this.setFile(res, this.isImage);
    });
  }

  public downloadDocument() {
    const linkSource = this.downloadableImage;
    const downloadLink = document.createElement('a');
    const fileName = this.fileName;
    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
  }

  private setFile(docData, isImg: boolean) {
    if (!isImg) {
      this.image.next(this.base64PdfStart + docData.fileData);
      this.downloadableImage = this.base64PdfStart + docData.fileData;
    } else {
      this.image.next(this.base64ImageStart + docData.fileData);
      this.downloadableImage = this.base64ImageStart + docData.fileData;
    }
    this.fileName = docData.fileName;
  }

  public closeModal() {
    this.modalSvc.close();
  }
}
