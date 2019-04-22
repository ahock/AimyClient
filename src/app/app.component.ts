import { Component } from '@angular/core';
import { AuthServiceService } from './auth-service/auth-service.service';
import { UserService } from './user/user.service';
import { StatusComponent } from './status/status.component';
import { CarouselModule } from 'ngx-bootstrap';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'aimy-vanilla';
  singleModel = '1';
  alertBoxShow = false;

  constructor(public auth: AuthServiceService, public user: UserService) {
    console.log("AppComponent: constructor");
    auth.handleAuthentication();
  }

  ngOnInit() {
    if (this.auth.isAuthenticated()) {
      console.log("AppComponent: ngOnInit - isAuthenticated");
//      this.auth.renewTokens();
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
