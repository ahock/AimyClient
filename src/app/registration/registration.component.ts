import { Component, OnInit } from '@angular/core';
import { FormsModule }   from '@angular/forms';

import { AuthServiceService } from '../auth-service/auth-service.service';
import { UserService } from '../user/user.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styles: []
})
export class RegistrationComponent implements OnInit {
//  public firstname:string;
//  public lastname:string;

  constructor(public auth: AuthServiceService, public user: UserService) { }

  ngOnInit() {
    console.log("RegistrationComponent - ngOnInit");
    console.log(this.auth.auth_detail);
    console.log(this.user);
    this.user.email1 = this.auth.auth_detail.email;
    this.user.firstname = this.auth.auth_detail.given_name;
    this.user.lastname = this.auth.auth_detail.family_name;
    this.user.full_name = "";
    this.user.email2 = this.auth.auth_detail.email;;
    this.user.gender = this.auth.auth_detail.gender;
    this.user.language = this.auth.auth_detail.locale;
  }

}
