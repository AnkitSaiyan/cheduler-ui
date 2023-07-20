import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { IHttpConnectionOptions } from '@microsoft/signalr';


@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private hubConnection!: signalR.HubConnection;

  constructor(
  ) {
    // this.createConnection();
    // this.startConnection();
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



	// private registerForPriorityModule(): void {
	// 	this.hubConnection.on('UpdatePriorityPercentage', (param: string) => {
	// 		this.priorityModuleData$$.next(param);
	// 	});
	// }
}
