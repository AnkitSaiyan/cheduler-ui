import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NotificationType } from 'diflexmo-angular-design';
import { BehaviorSubject, Subject, take, takeUntil } from 'rxjs';
import { LandingService } from 'src/app/core/services/landing.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { NotificationDataService } from 'src/app/core/services/notification-data.service';
import { Translate } from '../../models/translate.model';
import { ENG_BE } from '../../utils/const';

@Component({
  selector: 'dfm-upload-document',
  templateUrl: './upload-document.component.html',
  styleUrls: ['./upload-document.component.scss'],
})
export class UploadDocumentComponent implements OnInit {
  private uniqueId: string = '';

  isQrValid = new BehaviorSubject<boolean>(true);

  public uploadFileName: string = '';

  public documentUploadProcess = new BehaviorSubject<string>('UPLOAD_DOCUMENT');

  private fileSize!: number;

  private language = ENG_BE;

  constructor(
    private route: ActivatedRoute,
    private landingSvc: LandingService,
    private notificationService: NotificationDataService,
    public loaderSvc: LoaderService,
  ) {
    this.uniqueId = this.route.snapshot?.queryParams['id'];
  }

  ngOnInit(): void {
    this.language = localStorage.getItem('lang') || ENG_BE;
    this.landingSvc.siteDetails$.pipe(take(1)).subscribe((res) => (this.fileSize = res?.data?.documentSizeInKb / 1024));

    this.loaderSvc.spinnerActivate();
    this.landingSvc.validateQr(this.uniqueId).subscribe({
      next: (res) => {
        this.isQrValid.next(true);
        this.loaderSvc.spinnerDeactivate();
      },
      error: (err) => {
        this.isQrValid.next(false);
        this.loaderSvc.spinnerDeactivate();
        this.notificationService.showNotification(
          Translate.Error.BackendCodes[this.language][err?.error?.message] || Translate.Error.SomethingWrong[this.language],
          NotificationType.DANGER,
        );
      },
    });
  }

  public uploadRefferingNote(event: any) {
    this.uploadFileName = event.target.files[0].name;
    var extension = this.uploadFileName.substr(this.uploadFileName.lastIndexOf('.') + 1).toLowerCase();
    var allowedExtensions = ['pdf', 'jpg', 'jpeg', 'png'];
    const fileSize = event.target.files[0].size / 1024 / 1024 > this.fileSize;

    if (allowedExtensions.indexOf(extension) === -1) {
      this.notificationService.showNotification('File format not allowed.', NotificationType.WARNING);
      this.documentUploadProcess.next('Failed to upload');
    } else if (fileSize) {
      this.notificationService.showNotification(`File size should not be greater than ${this.fileSize} MB.`, NotificationType.WARNING);
      this.documentUploadProcess.next('Failed to upload');
    } else {
      this.documentUploadProcess.next('Uploading...');
      this.onFileChange(event);
    }
  }

  private uploadDocument(file: any) {
    this.landingSvc.uploadDocumnet(file, this.uniqueId).subscribe({
      next: (res) => this.documentUploadProcess.next('Uploaded'),
      error: (err) => {
        this.documentUploadProcess.next('Failed to upload');
        this.notificationService.showNotification(
          Translate.Error.BackendCodes[this.language][err?.error?.message] || Translate.Error.SomethingWrong[this.language],
          NotificationType.DANGER,
        );
      },
    });
  }

  private onFileChange(event: Event) {
    new Promise((resolve) => {
      const { files } = event.target as HTMLInputElement;

      if (files && files?.length) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          resolve(files[0]);
        };
        reader.readAsDataURL(files[0]);
      }
    }).then((res: any) => this.uploadDocument(res));
  }
}
