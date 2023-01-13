import { ChangeDetectorRef, Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'dfm-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  url!: string;
  constructor(private router: Router, private cd: ChangeDetectorRef) { }
  
  ngOnInit(): void {
    this.url = this.router.url 
    console.log('cd: ', this.cd.detectChanges.name);
  }

}
