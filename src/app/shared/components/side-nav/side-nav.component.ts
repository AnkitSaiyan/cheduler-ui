import {Component, ElementRef, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from "../../../core/services/auth.service";
import {RouterStateService} from "../../../core/services/router-state.service";
import {DestroyableComponent} from "../destroyable/destroyable.component";
import {filter, take, takeUntil} from "rxjs";
import {Router} from "@angular/router";
import {ModalService} from "../../../core/services/modal.service";
import {ConfirmActionModalComponent, DialogData} from "../confirm-action-modal/confirm-action-modal.component";

@Component({
  selector: 'dfm-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss']
})
export class SideNavComponent extends DestroyableComponent implements OnInit, OnDestroy {
  public url!: string;

  public isExpanded: boolean = false;

  constructor(private authSvc: AuthService, private routerStateSvc: RouterStateService, private router: Router, private modalSvc: ModalService) {
    super();
  }

  public ngOnInit(): void {
    this.routerStateSvc.listenForUrlChange$().pipe(takeUntil(this.destroy$$)).subscribe((url) => this.url = url);
  }

  public override ngOnDestroy() {
    super.ngOnDestroy();
  }

  public logout() {
    const modalRef = this.modalSvc.open(ConfirmActionModalComponent, {
      data: {
        titleText: 'Logout Confirmation',
        bodyText: 'Are you sure you want to logout the session?',
        cancelButtonText: 'Cancel',
        confirmButtonText: 'Logout'
      } as DialogData
    })

    modalRef.closed
      .pipe(filter((res) => !!res), take(1))
      .subscribe((result) => this.authSvc.logout$());
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

  public toggleMenu(elementRef?: HTMLDivElement) {
    this.isExpanded = !this.isExpanded;
  }
}
