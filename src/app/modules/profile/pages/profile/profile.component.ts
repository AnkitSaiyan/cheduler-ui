import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'dfm-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  isrevokedPermission: boolean = false;
  constructor() { }

  ngOnInit(): void {
  }

  checkRevokeStatus(){
    this.isrevokedPermission = true;
    return this.isrevokedPermission;
  }
}
