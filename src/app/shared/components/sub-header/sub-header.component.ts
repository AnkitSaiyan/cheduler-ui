import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'dfm-sub-header',
  templateUrl: './sub-header.component.html',
  styleUrls: ['./sub-header.component.scss']
})
export class SubHeaderComponent implements OnInit {
  displayRegisterButton: boolean = false;
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.isLoggedInUser.subscribe((user: boolean)=>{
      this.displayRegisterButton = user;
    })
  }

}
