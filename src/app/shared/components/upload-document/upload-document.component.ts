import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NotificationType } from 'diflexmo-angular-design';
import { BehaviorSubject, Subject } from 'rxjs';
import { LandingService } from 'src/app/core/services/landing.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { NotificationDataService } from 'src/app/core/services/notification-data.service';

@Component({
  selector: 'dfm-upload-document',
  templateUrl: './upload-document.component.html',
  styleUrls: ['./upload-document.component.scss'],
})
export class UploadDocumentComponent implements OnInit {

  private uniqueId: string = '';

  isQrValid = new BehaviorSubject<boolean>(true);
  
  public uploadFileName: string = '';

  public documentUploadProcess = new BehaviorSubject<string>('Upload document')

  constructor(private route: ActivatedRoute, private landingSvc : LandingService, private notificationService : NotificationDataService, public loaderSvc: LoaderService) {
    this.uniqueId = this.route.snapshot?.queryParams['id'];
    // this.uniqueId =  "1a9d30ea-08ba-4322-bc32-6182b9272f5d"
  }

  ngOnInit(): void {
    this.loaderSvc.spinnerActivate();
    this.landingSvc.validateQr(this.uniqueId).subscribe(
      {
        next: (res) => { this.isQrValid.next(true);  this.loaderSvc.spinnerDeactivate()},
        error: (err) => { this.isQrValid.next(false), this.loaderSvc.spinnerDeactivate()},
      // complete: () => this.loaderSvc.spinnerDeactivate(),
      }
    )
    
  }

  public uploadRefferingNote(event: any) {
    this.uploadFileName = event.target.files[0].name;
    var extension = this.uploadFileName.substr(this.uploadFileName.lastIndexOf('.') + 1).toLowerCase();
    var allowedExtensions = ['pdf', 'jpg', 'jpeg', 'png'];

    if (allowedExtensions.indexOf(extension) === -1) {
      this.notificationService.showNotification("File format not allowed", NotificationType.WARNING);
      this.documentUploadProcess.next('Failed to upload');
    } else {
      this.documentUploadProcess.next('Uploading...');
      this.onFileChange(event);
    }
  }

  private uploadDocument(file: any) {
    this.landingSvc.uploadDocumnet(file, this.uniqueId).subscribe(
      {
        next: (res) => this.documentUploadProcess.next('Uploaded'),
        error: (err) => this.documentUploadProcess.next('Failed to upload'),
      }
    );
  }

  private onFileChange(event: Event) {
    new Promise((resolve) => {
      const { files } = event.target as HTMLInputElement;

      if (files && files?.length) {
        // let file;
        const reader = new FileReader();
        reader.onload = (e: any) => {
          resolve(files[0])
          // this.uploadDocument(file)
        };
        reader.readAsDataURL(files[0]);
      }
    }).then((res:any)=> this.uploadDocument(res))
  }
}
