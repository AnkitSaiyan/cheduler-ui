import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { IHttpConnectionOptions } from '@microsoft/signalr';
import { NotificationDataService } from './notification-data.service';
import { NotificationType } from 'diflexmo-angular-design';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SignalRService {
	private hubConnection!: signalR.HubConnection;
	
	private docData= new Subject<any>()

  constructor(private notificationService : NotificationDataService) {
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
			.then(() => {
				console.log('Connection started.');
			})
			.catch((err) => {
				console.log('Opps!');
			});
	}

	private registerForDocument(): void {
		this.hubConnection.on('UploadDocument', (param: string) => {
			// console.log(param);
			this.docData.next(param)
			this.notificationService.showNotification("Document uploaded successfully!");
		});
	}
}