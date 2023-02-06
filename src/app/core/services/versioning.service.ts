import {Injectable, OnDestroy} from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import {interval, Observable, Subscription} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VersioningService implements OnDestroy {
  public interval$!: Subscription;
  constructor(private swUpdate: SwUpdate) {
    console.log('cons versioning services');
    if (window.location.hostname === 'localhost') {
      return;
    }

    if (this.swUpdate.isEnabled) {
      this.swUpdate.checkForUpdate();
    }

    // Check every 5 minutes if there is an update
    this.interval$ = interval(5 * 60 * 1000).subscribe(() => {
      if (this.swUpdate.isEnabled) {
        this.swUpdate.checkForUpdate();
      }
    });
  }

  public ngOnDestroy() {
    this.interval$.unsubscribe();
  }
}
