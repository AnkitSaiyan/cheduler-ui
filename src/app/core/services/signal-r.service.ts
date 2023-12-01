import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { IHttpConnectionOptions } from '@microsoft/signalr';
import { NotificationDataService } from './notification-data.service';
import { Subject } from 'rxjs';
import { Translate } from 'src/app/shared/models/translate.model';
import { ShareDataService } from 'src/app/services/share-data.service';

@Injectable({
  providedIn: 'root',
})
export class SignalRService {
  private hubConnection!: signalR.HubConnection;

  private docData = new Subject<any>(); 

  private selectedLang!: string;

  constructor(private notificationService: NotificationDataService, private shareDataSvc: ShareDataService) {
    this.makeConnection();
    this.shareDataSvc.getLanguage$().subscribe((lang) => {
      this.selectedLang = lang;
    });
  }

  public makeConnection() {
    this.createConnection();
    this.startConnection();
    this.registerForDocument();
  }

  get documentData() {
    return this.docData.asObservable();
  }

  private createConnection() {
    const SubDomain: string = window.location.host.split('.')[0];
    const options: IHttpConnectionOptions = {
      headers: { SubDomain },
    };

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`https://diflexmo-scheduler-api-dev.azurewebsites.net/informhub`, options)
      .configureLogging(signalR.LogLevel.Debug)
      .build();
  }

  private startConnection(): void {
    this.hubConnection
      .start()
      .then(() => {})
      .catch((err) => {});
  }

  private registerForDocument(): void {
    this.hubConnection.on('UploadDocument', (param: string) => {
      this.docData.next(param);
      this.notificationService.showNotification(Translate.Success.DocumentUploadSuccess[this.selectedLang]);
    });
  }

  public getConnectionId(): Promise<any> {
    return this.hubConnection.invoke('getconnectionid');
	}
}

