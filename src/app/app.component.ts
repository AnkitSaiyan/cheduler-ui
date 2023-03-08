import { Component, OnInit } from '@angular/core';
import { Tooltip } from 'bootstrap';
// eslint-disable-next-line import/no-extraneous-dependencies
import { TranslateService } from '@ngx-translate/core';
import defaultLanguage from '../assets/i18n/en-BE.json';

@Component({
  selector: 'dfm-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(public translate: TranslateService) {
    translate.addLangs(['en-BE', 'nl-BE']);
    translate.setTranslation('en-BE', defaultLanguage);
    translate.setDefaultLang('en-BE');
  }

  ngOnInit(): void {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltipTriggerList.forEach((e) => new Tooltip(e));
  }
}
