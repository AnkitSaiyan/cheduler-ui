import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'dfm-basic-detail',
  templateUrl: './basic-detail.component.html',
  styleUrls: ['./basic-detail.component.scss']
})
export class BasicDetailComponent implements OnInit {
  displayBasicDetails: boolean = false;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.isLoggedInUser.subscribe((user: boolean) => {
      (user === true)? this.displayBasicDetails = false : this.displayBasicDetails = true;
    })
  }

}
