import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { NotificationType } from 'diflexmo-angular-design';
import { BehaviorSubject, filter, takeUntil, map } from 'rxjs';
import { LandingService } from 'src/app/core/services/landing.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { ModalService } from 'src/app/core/services/modal.service';
import { NotificationDataService } from 'src/app/core/services/notification-data.service';
import { ScheduleAppointmentService } from 'src/app/core/services/schedule-appointment.service';
import { SignalRService } from 'src/app/core/services/signal-r.service';
import { DestroyableComponent } from 'src/app/shared/components/destroyable/destroyable.component';
import { QrModalComponent } from 'src/app/shared/components/qr-modal/qr-modal.component';
import { NameValue } from 'src/app/shared/models/name-value.model';

@Component({
  selector: 'dfm-referral-physician',
  templateUrl: './referral-physician.component.html',
  styleUrls: ['./referral-physician.component.scss'],
})
export class ReferralPhysicianComponent extends DestroyableComponent implements OnInit, OnDestroy {
  public examForm!: FormGroup;

  public filteredPhysicians$$ = new BehaviorSubject<NameValue[] | null>(null);

  public filteredExams$$ = new BehaviorSubject<NameValue[] | null>(null);

  public siteDetails$$: BehaviorSubject<any>;

  public uploadFileName: string = '';

  public documentUploadProcess = new BehaviorSubject<string>('');

  public signalRFileName: string = '';

  public referringDetails!: {
    qrId: string;
    fileName: string;
    physician: any;
  }

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private scheduleAppointmentSvc: ScheduleAppointmentService,
    public loaderSvc: LoaderService,
    private landingService: LandingService,
    private modalSvc: ModalService,
    private notificationService: NotificationDataService,
    private singnalRSvc: SignalRService,
  ) {
    super();
    this.siteDetails$$ = new BehaviorSubject<any[]>([]);
    this.referringDetails = {
      qrId: '',
      fileName: '',
      physician: []
    }

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
  }

  public ngOnInit(): void {
    const qrDetails:any = JSON.parse(localStorage.getItem('referringDetails') || '{}');

    if (qrDetails?.fileName) {
      this.referringDetails = qrDetails;
      this.updateFileName(this.referringDetails.fileName, !this.referringDetails.qrId )
    }

    this.siteDetails$$.next(JSON.parse(localStorage.getItem('siteDetails') || '{}')?.data);

    this.scheduleAppointmentSvc.physicians$
      .pipe(
        map((staff) => staff.map(({ firstname, id }) => ({ name: firstname, value: id }))),
        takeUntil(this.destroy$$),
      )
      .subscribe({
        next: (staffs) => this.filteredPhysicians$$.next(staffs),
      });
      this.createForm(qrDetails);

    this.singnalRSvc.documentData.pipe(takeUntil(this.destroy$$)).subscribe((data) => {
      console.log('signalData', data);
      this.modalSvc.close();
      this.updateFileName(data.fileName, false);
      this.referringDetails.qrId = data.appointmentQrcodeId,
      this.referringDetails.fileName = data.fileName;       
    });
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
  }

  private createForm(data) {
    this.examForm = this.fb.group({
      physician: [data?.physician ? data.physician : '', []],
    });
  }

  public saveExamDetails() {
    if (this.examForm.invalid) {
      this.examForm.markAllAsTouched();
      return;
    }
    this.referringDetails.physician = this.examForm.value.physician;
    localStorage.setItem('referringDetails', JSON.stringify(this.referringDetails))
    this.router.navigate(['../exam'], { relativeTo: this.route, replaceUrl: true });
  }

  public uploadRefferingNote(event: any) {
    this.documentUploadProcess.next('Uploading...');
    this.uploadFileName = event.target.files[0].name;
    var extension = this.uploadFileName.substr(this.uploadFileName.lastIndexOf('.') + 1).toLowerCase();
    var allowedExtensions = ['pdf', 'jpg', 'jpeg', 'png'];

    if (allowedExtensions.indexOf(extension) === -1) {
      // alert('Invalid file Format. Only ' + allowedExtensions.join(', ') + ' are allowed.');
      this.notificationService.showNotification('File format not allowed', NotificationType.WARNING);
      this.documentUploadProcess.next('Failed to upload');
    } else {
      this.onFileChange(event);
    }
  }

  private uploadDocument(file: any) {
    this.landingService.uploadDocumnet(file, '').subscribe({
      next: (res) => {
        this.referringDetails.fileName = this.uploadFileName
        this.updateFileName(this.uploadFileName, true);
      },
      error: (err) => this.documentUploadProcess.next('Failed to upload'),
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
    }).then((res) => this.uploadDocument(res));
  }

  public uploadDocumentFromMobile() {
    const modalRef = this.modalSvc.open(QrModalComponent, {});

  }

  private updateFileName(fileName:string, directUpload:boolean) {
    if (directUpload) {
      this.documentUploadProcess.next(fileName);
      this.signalRFileName = ''
    } else {
      this.documentUploadProcess.next('');
      this.signalRFileName = fileName
      }
  }
}
