import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { APP_CONFIG } from './app-variables';
import { AuthServiceService } from './auth-service/auth-service.service';
import { UserService } from './user/user.service';
import { StatusService } from './status/status.service';
import { DialogService } from './dialog/dialog.service';
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
  statusBarShow = true;
  showAssignmentResults = false;
  
  togPlaylist = APP_CONFIG.togPlaylist;
  togSkillCat = APP_CONFIG.togSkillCat;

  constructor(private router: Router, private location:Location, public user: UserService, public auth: AuthServiceService, public status: StatusService, public dialogs:DialogService) {
    console.log("AppComponent: constructor");
//    auth.setLoginCallback( () => {console.log("LoginCallback1",this.user);});
    auth.handleAuthentication((token: string) => {
      console.log("LoginCallback2",token);
      this.user.setUserToken(token);
      this.user.loadUserData( () => {
        if(this.user.getUser()==undefined) {
          this.router.navigate(['/registration']);
        } else {
          console.log("LoginCallback2", this.user.getUser());
          this.dialogs.getActiveDialogCount(token, (count) => {
            if(count == 0) {
              this.router.navigate(['/']);
            } else {
              this.router.navigate(['/dialog']);
            }
          });
        }
      });
    });
  }

  ngOnInit() {
    console.log("AppComponent ngOnInit Location: ", this.location.path());
    console.log("AppComponent Token", localStorage.getItem('user_token'));
    
    if (this.auth.isAuthenticated()) {
      console.log("AppComponent: ngOnInit - isAuthenticated");
      this.auth.renewTokens();
//      this.user.loadUserData( () => {});
    }
    else {
      console.log("AppComponent: ngOnInit - NOT Authenticated");
    }
  }
}
