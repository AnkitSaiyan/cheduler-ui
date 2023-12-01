import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { AuthService } from '../../../core/services/auth.service';
import { RouterStateService } from '../../../core/services/router-state.service';
import { DestroyableComponent } from '../destroyable/destroyable.component';
import { BehaviorSubject, filter, interval, map, take, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { ModalService } from '../../../core/services/modal.service';
import { ConfirmActionModalComponent, DialogData } from '../confirm-action-modal/confirm-action-modal.component';

@Component({
  selector: 'dfm-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss'],
})
export class SideNavComponent extends DestroyableComponent implements OnInit, OnDestroy {
  public url!: string;

  public isExpanded: boolean = false;

  public isMobile$$ = new BehaviorSubject<boolean>(false);

  public isVisibleSubMenu$$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public window = window;

  @ViewChild('myAccount') myAccount;

  constructor(
    private authSvc: AuthService,
    private routerStateSvc: RouterStateService,
    private router: Router,
    private modalSvc: ModalService,
    private breakpointObserver: BreakpointObserver,
  ) {
    super();
  }

  public ngOnInit(): void {
    this.breakpointObserver
      .observe(['(max-width: 680px)'])
      .pipe(map((result: BreakpointState) => result.matches))
      .subscribe((value: boolean) => this.isMobile$$.next(value));
    this.routerStateSvc
      .listenForUrlChange$()
      .pipe(takeUntil(this.destroy$$))
      .subscribe((url) => (this.url = url));

    interval(0)
      .pipe(takeUntil(this.destroy$$))
      .subscribe(() => this.checkWindowWidth());
  }

  public override ngOnDestroy() {
    super.ngOnDestroy();
  }

  public logout() {
    const modalRef = this.modalSvc.open(ConfirmActionModalComponent, {
      data: {
        titleText: 'LogoutConfirmation',
        bodyText: 'Areyousurewanttologout',
        cancelButtonText: 'Cancel',
        confirmButtonText: 'Logout',
      } as DialogData,
    });

    modalRef.closed
      .pipe(
        filter((res) => !!res),
        take(1),
      )
      .subscribe({
        next: () => this.authSvc.logout(),
      });
  }

  public navigateTo(route: ['dashboard'] | ['appointment'] | ['account', 'profile'] | ['account', 'privacy']) {
    if (this.url.includes(route.length === 2 ? route[1] : route[0])) {
      return;
    }

    this.router.navigate(['/', ...route]);

    if (this.isExpanded) {
      this.toggleMenu();
    }
  }

  public async toggleMenu(fromTop: boolean = false) {
    if (this.isMobile$$.value) return;
    if (fromTop) {
      this.myAccount.nativeElement.classList.remove('dfm-side-nav-sub-menu-show');
    }
    this.isExpanded = !this.isExpanded;
  }

  private checkWindowWidth() {
    if (this.window.innerWidth <= 680 && this.isExpanded) {
      this.isExpanded = false;
    }
  }
}
