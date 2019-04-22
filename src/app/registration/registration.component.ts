import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from '../auth-service/auth-service.service';
import { UserService } from '../user/user.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styles: []
})
export class RegistrationComponent implements OnInit {

  constructor(public auth: AuthServiceService, public user: UserService) { }

  ngOnInit() {
  }

}
