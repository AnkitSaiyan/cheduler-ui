import { Component, OnDestroy, OnInit } from '@angular/core';
import { DestroyableComponent } from '../destroyable/destroyable.component';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { LandingService } from '../../../core/services/landing.service';
import { ShareDataService } from 'src/app/services/share-data.service';
import { DUTCH_BE, ENG_BE } from '../../utils/const';

@Component({
  selector: 'dfm-sub-header',
  templateUrl: './sub-header.component.html',
  styleUrls: ['./sub-header.component.scss'],
})
export class SubHeaderComponent extends DestroyableComponent implements OnInit, OnDestroy {
  public info$$: BehaviorSubject<any>;
  introductoryTextEnglish: object = {};
  selectedLang: string = DUTCH_BE;
  readonly english: string = ENG_BE;
  constructor(private landingService: LandingService, private shareDataSvc: ShareDataService) {
    super();
    this.info$$ = new BehaviorSubject<any>(null);
  }

  public ngOnInit(): void {
    this.landingService.siteDetails$.pipe(takeUntil(this.destroy$$)).subscribe((res) => {
      localStorage.setItem('siteDetails', JSON.stringify(res));
      this.info$$.next(JSON.parse(res['data'].introductoryText));
      this.introductoryTextEnglish = JSON.parse(res.data.introductoryTextEnglish);
    });

    this.shareDataSvc
      .getLanguage$()
      .pipe(takeUntil(this.destroy$$))
      .subscribe((lang) => {
        this.selectedLang = lang;
      });
  }

  public override ngOnDestroy() {
    super.ngOnDestroy();
  }
}
