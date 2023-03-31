import { AfterViewInit, ChangeDetectorRef, Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter, Observable, Subject, take, takeUntil } from 'rxjs';
import { ConfirmActionModalComponent, DialogData } from '../shared/components/confirm-action-modal/confirm-action-modal.component';
import { AuthService } from './services/auth.service';
import { ModalService } from './services/modal.service';
import { NotificationDataService } from './services/notification-data.service';
import { RouterStateService } from './services/router-state.service';
import { DestroyableComponent } from '../shared/components/destroyable/destroyable.component';
import { LoaderService } from './services/loader.service';

@Component({
  selector: 'dfm-core',
  templateUrl: './core.component.html',
  styleUrls: ['./core.component.scss'],
})
export class CoreComponent extends DestroyableComponent implements OnInit, OnDestroy, AfterViewInit {
  @HostListener('window:scroll', ['$event'])
  private onScroll(e) {
    console.log(e);
  }

  public url!: string;

  public isLoggedIn$!: Observable<boolean>;

  public isLoaderActive$$ = new Subject<boolean>();

  constructor(
    private authService: AuthService,
    private routerStateSvc: RouterStateService,
    public loaderService: LoaderService,
    private cdr: ChangeDetectorRef,
  ) {
    super();
  }

  public ngOnInit(): void {
    this.isLoggedIn$ = this.authService.isLoggedIn$;
    this.routerStateSvc
      .listenForUrlChange$()
      .pipe(takeUntil(this.destroy$$))
      .subscribe((url) => (this.url = url));
  }

  public ngAfterViewInit(): void {
    this.loaderService.isActive$.pipe(takeUntil(this.destroy$$)).subscribe((value) => {
      this.isLoaderActive$$.next(value);
      this.cdr.detectChanges();
    });
  }

  public override ngOnDestroy() {
    super.ngOnDestroy();
  }
}

