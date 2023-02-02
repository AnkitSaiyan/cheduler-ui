import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter, take } from 'rxjs';
import { ConfirmActionModalComponent, DialogData } from '../shared/components/confirm-action-modal/confirm-action-modal.component';
import { AuthService } from './services/auth.service';
import { ModalService } from './services/modal.service';
import { NotificationDataService } from './services/notification-data.service';

@Component({
  selector: 'dfm-core',
  templateUrl: './core.component.html',
  styleUrls: ['./core.component.scss']
})
export class CoreComponent implements OnInit {
  displaySidebar: boolean = false;
  url!: string;

  constructor(private authService: AuthService, private modalSvc: ModalService, private notificationSvc: NotificationDataService, private router: Router) { }

  public ngOnInit(): void {
    this.url = this.router.url;
    console.log('this.displaySidebar: ', this.displaySidebar);
    this.authService.isLoggedInUser.subscribe((user: boolean) => {
      user ? this.displaySidebar = true : this.displaySidebar = false;
    })
    this.displaySidebar = Boolean(localStorage.getItem('user'))

    this.router.events.subscribe((data: any)=>{
      console.log('data: ', data.url);
      (data && data.url)? this.url = data.url: '';
    })
  }

  public checkUrl() {
    this.router.events.subscribe((data: any) => {
      console.log('data: ', data.url);
      (data && data.url) ? this.url = data.url : '';
    })
  }

  public logOut() {
    const modalRef = this.modalSvc.open(ConfirmActionModalComponent, {
      data: {
        bodyText: 'Are you sure you want to logout?',
        confirmButtonText: 'Logout',
      } as DialogData,
    });

    modalRef.closed
      .pipe(
        filter((res: boolean) => res),
        take(1),
      )
      .subscribe(() => {
        this.authService.logout$();
        this.notificationSvc.showNotification('Logout Successfully');
        localStorage.clear();
        this.router.navigate(['/auth/login']);
      });
  }
}
