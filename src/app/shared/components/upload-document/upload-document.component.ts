import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NotificationType } from 'diflexmo-angular-design';
import { BehaviorSubject, filter, interval, switchMap, take, takeUntil } from 'rxjs';
import { LandingService } from 'src/app/core/services/landing.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { NotificationDataService } from 'src/app/core/services/notification-data.service';
import { ShareDataService } from 'src/app/services/share-data.service';
import { Translate } from '../../models/translate.model';
import { ENG_BE } from '../../utils/const';
import { DestroyableComponent } from '../destroyable/destroyable.component';
import { ModalService } from 'src/app/core/services/modal.service';
import { DocumentViewModalComponent } from '../document-view-modal/document-view-modal.component';

@Component({
  selector: 'dfm-upload-document',
  templateUrl: './upload-document.component.html',
  styleUrls: ['./upload-document.component.scss'],
})
export class UploadDocumentComponent extends DestroyableComponent implements OnInit {
  private uniqueId: string = '';

  isQrValid = new BehaviorSubject<boolean>(true);

  public uploadFileName: string = '';

  public documentUploadProcess = new BehaviorSubject<string>('UPLOAD_DOCUMENT');

  public fileSize!: number;

  private selectedLang = ENG_BE;

  private fileMaxCount!: number;

  public documentListError$$: BehaviorSubject<{ fileName: string; error: 'fileFormat' | 'fileLimit' }[]> = new BehaviorSubject<
    { fileName: string; error: 'fileFormat' | 'fileLimit' }[]
  >([]);

  public documentList$$ = new BehaviorSubject<any[]>([]);

  public isDocumentUploading$$ = new BehaviorSubject<number>(0);

  constructor(
    private route: ActivatedRoute,
    private landingSvc: LandingService,
    private notificationService: NotificationDataService,
    public loaderSvc: LoaderService,
    private shareDataSvc: ShareDataService,
    private modalSvc: ModalService,
  ) {
    super();
    this.uniqueId = this.route.snapshot?.queryParams['id'];

    this.shareDataSvc
      .getLanguage$()
      .pipe(takeUntil(this.destroy$$))
      .subscribe((lang) => {
        this.selectedLang = lang;
      });
  }

  ngOnInit(): void {
    this.landingSvc.siteDetails$.pipe(take(1)).subscribe((res) => {
      this.fileSize = res?.data?.documentSizeInKb / 1024;
      this.fileMaxCount = res?.data?.docUploadMaxCount;
    });

    this.loaderSvc.spinnerActivate();
    this.landingSvc
      .validateQr(this.uniqueId)
      .pipe(takeUntil(this.destroy$$))
      .subscribe({
        next: (res) => {
          this.isQrValid.next(true);
          this.loaderSvc.spinnerDeactivate();
        },
        error: (err) => {
          this.isQrValid.next(false);
          this.loaderSvc.spinnerDeactivate();
          this.notificationService.showNotification(
            Translate.Error.BackendCodes[this.selectedLang][err?.error?.message] || Translate.Error.SomethingWrong[this.selectedLang],
            NotificationType.DANGER,
          );
        },
      });

    interval(5000)
      .pipe(
        switchMap(() => this.isQrValid),
        filter(Boolean),
        takeUntil(this.destroy$$),
        switchMap(() => this.landingSvc.getDocumentById$(this.uniqueId, true)),
      )
      .subscribe((res) => this.documentList$$.next(res));
  }

  public uploadRefferingNote(event: any) {
    if (!event.target.files.length) {
      return;
    }
    this.fileChange(event);
  }

  private checkFileExtensions(file: any): boolean {
    const allowedExtensions = ['pdf', 'jpg', 'jpeg', 'png'];
    const fileName = file.name;
    const fileExtension = fileName.split('.').pop().toLowerCase();
    if (!allowedExtensions.includes(fileExtension)) {
      return true;
    }
    return false;
  }

  private fileChange(event: any) {
    const e = event;
    const { files } = event.target as HTMLInputElement;

    if (files?.length) {
      const promises = Array.from(files).map((file) => this.readFileAsDataURL(file));
      Promise.all(promises).then((transformedDataArray) => {
        this.uploadDocuments(transformedDataArray);
        e.target.value = ''; // Clear the file input
      });
    }
  }

  private readFileAsDataURL(file: File): Promise<any> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(file);
      };
      reader.readAsDataURL(file);
    });
  }

  private async uploadDocuments(files: string[]) {
    const transformedDataArray = files;
    if (this.fileMaxCount === this.documentList$$.value?.length) {
      this.notificationService.showNotification(Translate.UploadLimitExceeded[this.selectedLang], NotificationType.DANGER);
      return;
    }

    if (this.fileMaxCount < this.documentList$$.value?.length + transformedDataArray?.length) {
      this.notificationService.showNotification(Translate.UploadLimitExceeded[this.selectedLang], NotificationType.DANGER);
      transformedDataArray?.splice(this.fileMaxCount - this.documentList$$.value?.length);
    }
    for (const file of transformedDataArray) {
      this.uploadDocument(file, this.uniqueId);
    }
  }

  /**
   * Ignore await response.
   * @param file
   * @returns
   */
  private uploadDocument(file: any, uniqueId = '') {
    const fileSizeExceedsLimit = file.size / 1024 / 1024 > this.fileSize;
    if (fileSizeExceedsLimit) {
      this.documentListError$$.next([...this.documentListError$$.value, { fileName: file.name, error: 'fileLimit' }]);
      return;
    }
    if (this.checkFileExtensions(file)) {
      this.documentListError$$.next([...this.documentListError$$.value, { fileName: file.name, error: 'fileFormat' }]);
      return;
    }
    return new Promise((resolve) => {
      this.isDocumentUploading$$.next(this.isDocumentUploading$$.value + 1);
      this.documentUploadProcess.next('Uploading');
      this.landingSvc
        .uploadDocumnet(file, uniqueId, true)
        .pipe(
          take(1),
          switchMap((res) => {
            this.isDocumentUploading$$.next(this.isDocumentUploading$$.value - 1);
            return this.landingSvc.getDocumentById$(this.uniqueId, true);
          }),
        )
        .subscribe({
          next: (documentList) => {
            this.documentList$$.next(documentList);
            this.notificationService.showNotification(Translate.AddedSuccess(file?.name)[this.selectedLang], NotificationType.SUCCESS);
            this.documentUploadProcess.next('UPLOAD_DOCUMENT');
            resolve(documentList);
          },
          error: (err) => {
            this.notificationService.showNotification(Translate.Error.FailedToUpload[this.selectedLang], NotificationType.DANGER);
            this.documentUploadProcess.next('FAILED_TO_UPLOAD');
            this.isDocumentUploading$$.next(this.isDocumentUploading$$.value - 1);
            resolve(err);
          },
        });
    });
  }
  public clearFile(document: any) {
    this.landingSvc.deleteDocument(document.id).pipe(takeUntil(this.destroy$$)).subscribe();
    // this.signalRFileName = '';
    this.notificationService.showNotification(Translate.DeleteSuccess(document.fileName)[this.selectedLang], NotificationType.SUCCESS);
    this.documentList$$.next(this.documentList$$.value?.filter((item) => item?.id !== document?.id));
  }

  public viewDocument(id?: number) {
    this.modalSvc.open(DocumentViewModalComponent, {
      data: {
        id: localStorage.getItem('appointmentId'),
        documentList: this.documentList$$.value,
        focusedDocId: id,
      },
      options: {
        size: 'xl',
        backdrop: true,
        centered: true,
        modalDialogClass: 'ad-ap-modal-shadow',
      },
    });
  }
}









