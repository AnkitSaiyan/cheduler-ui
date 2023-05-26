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

    this.landingService.workingDetails$
      .pipe(takeUntil(this.destroy$$))
      .pipe(map((data) => data.filter((res) => res.weekday !== 0)))
      .subscribe((res) => {
        console.log({ res });
        // eslint-disable-next-line @typescript-eslint/dot-notation

        res.forEach((element) => {
          const j = element.weekday;
          // this.weekDay[element.weekday] = `${element.dayStart.slice(0, 5)} - ${element.dayEnd.slice(0, 5)}`;
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
          // for (let j = 0; j < 7; j++) {
          //   if (element.weekday === j) {
          // if (this.weekDay[j]) {
          //   this.weekDay[j] += `,${this.get24HourTimeString(element.dayStart)} - ${this.get24HourTimeString(element.dayEnd)}`;
          // } else {
          //   this.weekDay[j] = `${this.get24HourTimeString(element.dayStart)} - ${this.get24HourTimeString(element.dayEnd)}`;
          // }
          //   } else if (!this.weekDay[j]) {
          //     this.weekDay[j] = ``;
          //   }
          // }
        });

        const filtered = this.weekDay;

        this.weekDay = filtered;
        // console.log('working upcomming: ', res);
        // let weekdaysTiming = [];
        // for (let i = 0; i < res['data'].length; i++) {
        //   const weekdays = [
        //     { value: 1, day: 'monday' },
        //     { value: 2, day: 'tuesday' },
        //     { value: 3, day: 'wednesday' },
        //     { value: 4, day: 'thursday' },
        //   ];
        //   for (let j = 0; j < weekdays.length; j++) {
        //     if (res['data'][i].weekday === weekdays[j].value) {
        //       weekdaysTiming.push({ weekdays[j]['day']: 'a' });
        //     }
        //   }
        // }
        this.workingHours$$.next(res);
      });

    this.shareDataSvc
      .getLanguage$()
      .pipe(takeUntil(this.destroy$$))
      .subscribe((lang) => {
        this.selectedLang = lang;
      });
  }

  get24HourTimeString(timeString: string | undefined): string {
    let time = '';
    if (timeString) {
      const hour = +timeString.slice(0, 2);
      if (timeString.toLowerCase().includes('pm')) {
        if (hour < 12) {
          time = `${hour + 12}:${timeString.slice(3, 5)}`;
        } else {
          time = `${hour}:${timeString.slice(3, 5)}`;
        }
      } else if (timeString.toLowerCase().includes('am')) {
        if (hour === 12) {
          time = `00:${timeString.slice(3, 5)}`;
        } else {
          time = timeString.slice(0, 5);
        }
      }
    }

    return time;
  }
}
