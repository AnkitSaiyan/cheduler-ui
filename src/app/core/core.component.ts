import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter, Observable, take, takeUntil } from 'rxjs';
import { ConfirmActionModalComponent, DialogData } from '../shared/components/confirm-action-modal/confirm-action-modal.component';
import { AuthService } from './services/auth.service';
import { ModalService } from './services/modal.service';
import { NotificationDataService } from './services/notification-data.service';
import { RouterStateService } from './services/router-state.service';
import { DestroyableComponent } from '../shared/components/destroyable/destroyable.component';

@Component({
  selector: 'dfm-core',
  templateUrl: './core.component.html',
  styleUrls: ['./core.component.scss'],
})
export class CoreComponent extends DestroyableComponent implements OnInit, OnDestroy {
  @HostListener('window:scroll', ['$event'])
  private onScroll(e) {
    console.log(e);
  }

  public url!: string;

  public isLoggedIn$!: Observable<boolean>;

  constructor(private authService: AuthService, private routerStateSvc: RouterStateService) {
    super();
  }

  public ngOnInit(): void {
    this.isLoggedIn$ = this.authService.isLoggedIn$;
    this.routerStateSvc
      .listenForUrlChange$()
      .pipe(takeUntil(this.destroy$$))
      .subscribe((url) => (this.url = url));
  }

  public override ngOnDestroy() {
    super.ngOnDestroy();
  }
}
