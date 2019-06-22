import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { AuthServiceService } from './auth-service/auth-service.service';
import { UserService } from './user/user.service';
import { StatusService } from './status/status.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as ngxBootstrap from 'ngx-bootstrap';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'aimy-vanilla';
  singleModel = '1';
  alertBoxShow = false;

  constructor(private location:Location, public auth: AuthServiceService, public user: UserService, public status: StatusService) {
    console.log("AppComponent: constructor");
    auth.handleAuthentication();
  }

  ngOnInit() {
    console.log("Location: ", this.location.path());
    if (this.auth.isAuthenticated()) {
      console.log("AppComponent: ngOnInit - isAuthenticated");
      this.auth.renewTokens();
    }
    else {
      console.log("AppComponent: ngOnInit - NOT Authenticated");
    }
  }
  
  onClick(): void {
    this.singleModel=(this.singleModel=="1")?"0":"1";
  }
  
  alertToggle(): void {
    this.alertBoxShow = !this.alertBoxShow;
    if(this.alertBoxShow) {
      setTimeout(this.alertToggle, 3000);
    }
  }
}
