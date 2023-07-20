import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NotificationType } from 'diflexmo-angular-design';
import { BehaviorSubject, Subject } from 'rxjs';
import { LandingService } from 'src/app/core/services/landing.service';
import { NotificationDataService } from 'src/app/core/services/notification-data.service';

@Component({
  selector: 'dfm-upload-document',
  templateUrl: './upload-document.component.html',
  styleUrls: ['./upload-document.component.scss'],
})
export class UploadDocumentComponent implements OnInit {

  private uniqueId: string = '';

  isQrValid = new Subject();
  
  public uploadFileName: string = '';

  public documentUploadProcess = new BehaviorSubject<string>('Upload document')

  constructor(private route: ActivatedRoute, private landingSvc : LandingService, private notificationService : NotificationDataService) {
    this.uniqueId = "f7cce149-2773-48aa-9aa0-4160f8ef8fc5" // this.route.snapshot?.params['id'];
}

  ngOnInit(): void {
    this.landingSvc.validateQr(this.uniqueId).subscribe({
      next: (res) => this.isQrValid.next(true),
      error: (err) => this.isQrValid.next(false),
    })
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
