import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, filter, takeUntil } from 'rxjs';
import { DestroyableComponent } from 'src/app/shared/components/destroyable/destroyable.component';
import { LandingService } from '../../../core/services/landing.service';

@Component({
  selector: 'dfm-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
})
export class LandingComponent extends DestroyableComponent implements OnInit {
  public workingHours$$: BehaviorSubject<any[]>;

  public info$$: BehaviorSubject<any[]>;

  weekDay: string[] = [];

  days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  constructor(private landingService: LandingService) {
    super();
    this.workingHours$$ = new BehaviorSubject<any[]>([]);
    this.info$$ = new BehaviorSubject<any[]>([]);
  }

  ngOnInit(): void {
    this.landingService.siteDetails$.pipe(takeUntil(this.destroy$$)).subscribe((res) => {
      this.landingService.siteFooterDetails$$.next(res);
      this.info$$.next(JSON.parse(res['data'].introductoryText));
    });

    this.landingService.workingDetails$.pipe(takeUntil(this.destroy$$)).subscribe((res) => {
      res['data'].forEach((element) => {
        for (let j = 0; j < 7; j++) {
          if (element['weekday'] == j) {
            if (this.weekDay[j]) {
              this.weekDay[j] += `,${element.dayStart} - ${element.dayEnd}`;
            } else {
              this.weekDay[j] = `${element.dayStart} - ${element.dayEnd}`;
            }
          } else {
            if (!this.weekDay[j]) {
              this.weekDay[j] = ``;
            }
          }
        }
      });

      var filtered = this.weekDay.filter((el) => {
        return el != null;
      });

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
      this.workingHours$$.next(res['data']);
    });
  }
}
