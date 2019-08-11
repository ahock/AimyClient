import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthServiceService } from '../auth-service/auth-service.service';
import { UserService } from '../user/user.service';

@Component({
  selector: 'app-component2',
  template: `
    <div class="row d-flex align-items-center justify-content-center">
    <div class="col">
      &nbsp;
    </div>
    <div class="col d-flex align-items-center justify-content-center">
      <img src="assets/30.gif">
    </div>
    <div class="col">
      &nbsp;
    </div>
  </div>
    
    
    
  `,
  styles: []
})
export class Component2Component implements OnInit {

  constructor(public router: Router, public auths: AuthServiceService, private users: UserService) { }

  ngOnInit() {
//    this.auths.handleAuthCallback();
//    this.auths.handleAuthentication();
    
    console.log("Component2 ngOnInit:");
    
    console.log("Component2 Token", localStorage.getItem('user_token'));
    localStorage.getItem('user_token')?this.users.setUserToken(localStorage.getItem('user_token')):"";
    console.log("Auth", this.auths.getToken());
    
//    this.users.loadUserData( () => {
//      this.router.navigate(['/']);
//    })
  }

}
