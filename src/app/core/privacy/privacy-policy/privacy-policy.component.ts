import { AfterViewInit, Component } from '@angular/core';

@Component({
  selector: 'dfm-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss']
})
export class PrivacyPolicyComponent implements AfterViewInit {

  constructor() { }

  ngAfterViewInit(): void {
    document.querySelector('.container')?.scrollIntoView();
  }

}
