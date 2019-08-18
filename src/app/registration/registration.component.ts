import { Component, OnInit } from '@angular/core';
import { FormsModule }   from '@angular/forms';

import { AuthServiceService } from '../auth-service/auth-service.service';
import { UserService, User, SkillRef } from '../user/user.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styles: []
})

export class RegistrationComponent implements OnInit {
  private defaultskills = [
    {
      id: "5d0f3b972729c02f6ca6624b",
      name: "Aimy-Webclient bedienen können und Funktionen kennen",
      description: "",
      status: "active",
      togo: "noch 2 Aufträge",
      rating: "0%"      
    },
    {
      id: "5d2744397c213e5998ea6170", 
      name: "Aimy-Datenschutz verstehen",
      description: "",
      status: "active",
      togo: "noch 2 Aufträge",
      rating: "0%"
    }
  ];

  constructor(public auth: AuthServiceService, public user: UserService) { }

  ngOnInit() {
    console.log("RegistrationComponent - ngOnInit");
    console.log("Auth Details", this.auth.auth_detail);

    this.user.activeuser = {name: "",email:this.auth.auth_detail.email,firstname: "",lastname: ""};
    this.user.activeuser.learningstyle = "both";
    this.auth.auth_detail.locale?this.user.activeuser.language=this.auth.auth_detail.locale:this.user.activeuser.language="de";
    this.auth.auth_detail.gender?this.user.activeuser.gender=this.auth.auth_detail.gender:this.user.activeuser.gender="male";

    console.log("Defaultuser", this.user.activeuser);
  }

  public setDefaultSkills(): void {
    this.user.activeuser.skillref = new Array();
    this.user.activeuser.skillref.push(this.defaultskills[0]);
    this.user.activeuser.skillref.push(this.defaultskills[1]);
  }

}

