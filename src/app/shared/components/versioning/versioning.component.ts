import {ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, OnInit} from '@angular/core';
import {SwUpdate, VersionReadyEvent} from "@angular/service-worker";
import {filter, from, map} from "rxjs";
import {VersioningService} from "../../../core/services/versioning.service";

@Component({
  selector: 'dfm-versioning',
  templateUrl: './versioning.component.html',
  styleUrls: ['./versioning.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VersioningComponent implements OnInit {
  @HostBinding('class') public classes = 'version-warning';
  @HostBinding('class.wrong-version') public isWrongVersion = false;

  constructor(
    // Leave this here for the polling
    // @ts-ignore
    private versioningService: VersioningService,
    private swUpdate: SwUpdate,
    private cd: ChangeDetectorRef,
  ) {
  }

  public ngOnInit(): void {
    // from(this.swUpdate.activateUpdate()).pipe().subscribe(() => {
    //   this.isWrongVersion = true;
    //   this.cd.markForCheck();
    // });
    //
    // this.swUpdate.activateUpdate().then(() => {
    //   this.isWrongVersion = true;
    //   this.cd.markForCheck();
    // });

    // this.swUpdate.available.pipe().subscribe(() => {
    //   this.isWrongVersion = true;
    //   this.cd.markForCheck();
    // });
    this.swUpdate.versionUpdates.pipe(
      filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY'),
      map(evt => ({
        type: 'UPDATE_AVAILABLE',
        current: evt.currentVersion,
        available: evt.latestVersion,
      }))).subscribe((version) => {
      this.isWrongVersion = true;
      this.cd.markForCheck();
    });
  }

  public reload() {
    // this.clearCookies();
    // this.authService.logout$();
    // this.localStorageService.clear();
    location.reload();
  }

  private clearCookies() {
    const cookies = document.cookie.split(';');
    cookies.forEach((cookie) => {
      const eqPos = cookie.indexOf('=');
      const name = eqPos !== -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    });
  }
}
