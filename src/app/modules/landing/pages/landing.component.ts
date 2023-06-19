import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, map, takeUntil } from 'rxjs';
import { DestroyableComponent } from 'src/app/shared/components/destroyable/destroyable.component';
import { LandingService } from '../../../core/services/landing.service';
import { UtcToLocalPipe } from '../../../shared/pipes/utc-to-local.pipe';
import { ShareDataService } from 'src/app/services/share-data.service';
import { DUTCH_BE, ENG_BE } from 'src/app/shared/utils/const';

@Component({
  selector: 'dfm-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
})
export class LandingComponent extends DestroyableComponent implements OnInit {
  public workingHours$$: BehaviorSubject<any[]>;

  public info$$: BehaviorSubject<any[]>;

  weekDay: string[] = new Array(7).fill(null);

  days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  selectedLang: string = DUTCH_BE;

  readonly english: string = ENG_BE;

  introductoryTextEnglish: object = {};

  constructor(private landingService: LandingService, private utcToLocalPipe: UtcToLocalPipe, private shareDataSvc: ShareDataService) {
    super();
    this.workingHours$$ = new BehaviorSubject<any[]>([]);
    this.info$$ = new BehaviorSubject<any[]>([]);
  }

  public ngOnInit(): void {
    this.landingService.siteDetails$.pipe(takeUntil(this.destroy$$)).subscribe((res) => {
      localStorage.setItem('siteDetails', JSON.stringify(res));
      this.landingService.siteFooterDetails$$.next(res);
      this.info$$.next(JSON.parse(res.data.introductoryText));
      this.introductoryTextEnglish = JSON.parse(res.data.introductoryTextEnglish);
    });

    this.landingService.workingDetails$.pipe(takeUntil(this.destroy$$)).subscribe({
      next: (res) => {
        res.forEach((element) => {
          const j = element.weekday;
          if (this.weekDay[j]) {
            this.weekDay[j] += `, ${this.utcToLocalPipe.transform(element.dayStart.slice(0, 5), true)} - ${this.utcToLocalPipe.transform(
              element.dayEnd.slice(0, 5),
              true,
            )}`;
          } else {
            this.weekDay[j] = `${this.utcToLocalPipe.transform(element.dayStart.slice(0, 5), true)} - ${this.utcToLocalPipe.transform(
              element.dayEnd.slice(0, 5),
              true,
            )}`;
          }
        });
        this.workingHours$$.next(res);
      },
    });

    this.shareDataSvc
      .getLanguage$()
      .pipe(takeUntil(this.destroy$$))
      .subscribe({
        next: (lang) => (this.selectedLang = lang),
      });
  }
}
