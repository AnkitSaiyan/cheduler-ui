import {Injectable} from '@angular/core';
import {SwUpdate} from '@angular/service-worker';
import {interval} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VersioningService {
  constructor(private swUpdate: SwUpdate) {
    console.log('cons versioning services');
    if (window.location.hostname === 'localhost') {
      return;
    }

    if (this.swUpdate.isEnabled) {
      this.swUpdate.checkForUpdate();
    }

    // Check every 1 minutes if there is an update
    interval(60 * 1000).subscribe(() => {
      if (this.swUpdate.isEnabled) {
        this.swUpdate.checkForUpdate();
      }
    });
  }
}
