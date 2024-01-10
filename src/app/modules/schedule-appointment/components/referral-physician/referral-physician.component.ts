import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { NotificationType } from 'diflexmo-angular-design';
import { BehaviorSubject, filter, takeUntil, map, take, switchMap } from 'rxjs';
import { LandingService } from 'src/app/core/services/landing.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { ModalService } from 'src/app/core/services/modal.service';
import { NotificationDataService } from 'src/app/core/services/notification-data.service';
import { ScheduleAppointmentService } from 'src/app/core/services/schedule-appointment.service';
import { SignalRService } from 'src/app/core/services/signal-r.service';
import { ShareDataService } from 'src/app/services/share-data.service';
import { DestroyableComponent } from 'src/app/shared/components/destroyable/destroyable.component';
import { DocumentViewModalComponent } from 'src/app/shared/components/document-view-modal/document-view-modal.component';
import { QrModalComponent } from 'src/app/shared/components/qr-modal/qr-modal.component';
import { NameValue } from 'src/app/shared/models/name-value.model';
import { Translate } from 'src/app/shared/models/translate.model';

@Component({
  selector: 'dfm-referral-physician',
  templateUrl: './referral-physician.component.html',
  styleUrls: ['./referral-physician.component.scss'],
})
export class ReferralPhysicianComponent extends DestroyableComponent implements OnInit, OnDestroy {
  public physicianForm!: FormGroup;

  public filteredPhysicians$$ = new BehaviorSubject<NameValue[] | null>(null);

  public siteDetails$$: BehaviorSubject<any>;

  public uploadFileName: string = '';

  public documentUploadProcess = new BehaviorSubject<string>('');

  public signalRFileName: string = '';

  public referringDetails!: {
    qrId: string;
    fileName: string;
    physician: any;
    directUpload: boolean;
  };

  public fileSize!: number;

  public isEdit: boolean = false;

  public imageSrc: any;

  private selectedLang!: string;

  public documentListError$$: BehaviorSubject<{ fileName: string; error: 'fileFormat' | 'fileLimit' }[]> = new BehaviorSubject<
    { fileName: string; error: 'fileFormat' | 'fileLimit' }[]
  >([]);

  private fileMaxCount!: number;

  public documentList$$ = new BehaviorSubject<any[]>([]);

  public documentFromMobileList$$ = new BehaviorSubject<any[]>([]);

  public isDocumentUploading$$ = new BehaviorSubject<boolean>(false);

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private scheduleAppointmentSvc: ScheduleAppointmentService,
    public loaderSvc: LoaderService,
    private landingService: LandingService,
    private modalSvc: ModalService,
    private notificationSvc: NotificationDataService,
    private singnalRSvc: SignalRService,
    private shareDataSvc: ShareDataService,
  ) {
    super();
    this.siteDetails$$ = new BehaviorSubject<any[]>([]);
    this.referringDetails = {
      qrId: '',
      fileName: '',
      physician: '',
      directUpload: true,
    };

    this.router.events
      .pipe(
        filter((rs): rs is NavigationEnd => rs instanceof NavigationEnd),
        takeUntil(this.destroy$$),
      )
      .subscribe((event) => {
        if (event.id === 1 && event.url === event.urlAfterRedirects)
          this.landingService.siteDetails$.pipe(takeUntil(this.destroy$$)).subscribe((res) => {
            this.siteDetails$$.next(res?.data);
          });
      });

    this.shareDataSvc
      .getLanguage$()
      .pipe(takeUntil(this.destroy$$))
      .subscribe((lang) => {
        this.selectedLang = lang;
      });
  }

  public ngOnInit(): void {
    this.isEdit = localStorage.getItem('edit') == 'true';
    const qrDetails: any = JSON.parse(localStorage.getItem('referringDetails') ?? '{}');
    if (this.isEdit) {
      const appointmentDetail = JSON.parse(localStorage.getItem('appointmentDetails') ?? '');
      this.referringDetails.physician = appointmentDetail?.doctorId ?? '';
      if (appointmentDetail?.documentCount) {
        this.getUploadedFiles(appointmentDetail?.id);
      }
    }
    if (qrDetails?.qrId) {
      this.referringDetails = qrDetails;
      this.getUploadedFiles(qrDetails?.qrId);
    } else if (qrDetails.physician) this.referringDetails.physician = qrDetails.physician;

    this.siteDetails$$.next(JSON.parse(localStorage.getItem('siteDetails') ?? '{}')?.data);

    this.scheduleAppointmentSvc.physicians$
      .pipe(
        map((staff) => staff.map(({ firstname, lastname, id }) => ({ name: firstname + ' ' + lastname, value: id }))),
        takeUntil(this.destroy$$),
      )
      .subscribe({
        next: (staffs) => {
          this.filteredPhysicians$$.next(staffs);
          if (this.referringDetails.physician)
            setTimeout(() => {
              this.physicianForm.patchValue({
                physician: this.referringDetails.physician,
              });
            }, 50);
        },
      });
    this.createForm(this.referringDetails);

    this.singnalRSvc.documentData.pipe(takeUntil(this.destroy$$)).subscribe((data) => {
      this.modalSvc.close();
      this.referringDetails.qrId = data?.[0]?.appointmentQrcodeId;
      this.referringDetails.fileName = data?.[0]?.fileName;
      this.referringDetails.directUpload = false;
      this.documentFromMobileList$$.next(data);
      console.log(data);
    });

    this.siteDetails$$.pipe(takeUntil(this.destroy$$)).subscribe((res) => {
      this.fileSize = res.documentSizeInKb / 1024;
      this.fileMaxCount = res.docUploadMaxCount;
      if (+res?.doctorReferringConsent === 1) {
        this.physicianForm.get('physician')?.removeValidators(Validators.required);
        this.physicianForm.updateValueAndValidity();
      }
    });
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
  }

  private getUploadedFiles(id: number | string) {
    this.landingService
      .getDocumentById$(id, false)
      .pipe(takeUntil(this.destroy$$))
      .subscribe((res) => {
        if (res?.[0].apmtQRCodeId) {
          this.referringDetails.qrId = res?.[0].apmtQRCodeId;
        }
        if (res?.some(({ isUploadedFromQR }) => isUploadedFromQR)) {
          this.documentFromMobileList$$.next(res);
        } else {
          this.documentList$$.next(res);
        }
      });
  }

  private createForm(data) {
    this.physicianForm = this.fb.group({
      physician: [data?.physician ?? '', [Validators.required]],
    });
  }

  public saveExamDetails() {
    if (this.physicianForm.invalid) {
      this.physicianForm.markAllAsTouched();
      return;
    }
    this.referringDetails.physician = this.physicianForm.value.physician;
    localStorage.setItem('referringDetails', JSON.stringify(this.referringDetails));
    this.router.navigate(['../exam'], { relativeTo: this.route, replaceUrl: true });
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
    let isLimitExceeded = false;
    if (this.fileMaxCount === this.documentList$$.value?.length) {
      this.notificationSvc.showNotification(Translate.UploadLimitExceeded[this.selectedLang], NotificationType.DANGER);
      return;
    }

    if (this.fileMaxCount < this.documentList$$.value?.length + transformedDataArray?.length) {
      transformedDataArray?.splice(this.fileMaxCount - this.documentList$$.value?.length);
      isLimitExceeded = true;
    }
    const allPromise: any[] = [];
    for (const file of transformedDataArray) {
      if (!this.referringDetails.qrId) {
        await this.uploadDocument(file);
      } else {
        allPromise.push(this.uploadDocument(file, this.referringDetails.qrId));
      }
    }
    this.isDocumentUploading$$.next(true);
    await Promise.all(allPromise);
    this.landingService
      .getDocumentById$(this.referringDetails.qrId, true)
      .pipe(take(1))
      .subscribe({
        next: (documentList) => {
          this.documentList$$.next(documentList);
          this.isDocumentUploading$$.next(false);
          if (isLimitExceeded) {
            this.notificationSvc.showNotification(Translate.UploadLimitExceeded[this.selectedLang], NotificationType.DANGER);
          }
        },
        error: () => {
          this.isDocumentUploading$$.next(false);
          if (isLimitExceeded) {
            this.notificationSvc.showNotification(Translate.UploadLimitExceeded[this.selectedLang], NotificationType.DANGER);
          }
        },
      });
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
      this.landingService
        .uploadDocumnet(file, uniqueId)
        .pipe(take(1))
        .subscribe({
          next: (res) => {
            this.referringDetails.qrId = res?.apmtDocUniqueId;
            this.notificationSvc.showNotification(Translate.AddedSuccess(file?.name)[this.selectedLang], NotificationType.SUCCESS);
            resolve(res);
          },
          error: (err) => {
            this.notificationSvc.showNotification(Translate.Error.FailedToUpload[this.selectedLang], NotificationType.DANGER);
            resolve(err);
          },
        });
    });
  }

  public uploadDocumentFromMobile() {
    if (this.documentList$$.value?.length) {
      return;
    }
    this.modalSvc.open(QrModalComponent, {
      data: {
        id: localStorage.getItem('appointmentId') ?? '0',
      },
    });
  }

  private updateFileName(fileName: string, directUpload: boolean) {
    if (directUpload) {
      this.documentUploadProcess.next(fileName);
      this.signalRFileName = '';
    } else {
      this.documentUploadProcess.next('');
      this.signalRFileName = fileName;
    }
  }
  public clearFile(document: any, isFromMobile: boolean = false) {
    this.landingService.deleteDocument(document.id).pipe(takeUntil(this.destroy$$)).subscribe();
    // this.signalRFileName = '';
    this.notificationSvc.showNotification(Translate.DeleteSuccess(document.fileName)[this.selectedLang], NotificationType.SUCCESS);
    if (isFromMobile) {
      this.documentFromMobileList$$.next(this.documentFromMobileList$$.value?.filter((item) => item?.id !== document?.id));
    } else {
      this.documentList$$.next(this.documentList$$.value?.filter((item) => item?.id !== document?.id));
    }
  }

  public viewDocument(id?: number, isFromMobile: boolean = false) {
    this.modalSvc.open(DocumentViewModalComponent, {
      data: {
        id: this.referringDetails.qrId || localStorage.getItem('appointmentId'),
        documentList: isFromMobile ? this.documentFromMobileList$$.value : this.documentList$$.value,
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
























