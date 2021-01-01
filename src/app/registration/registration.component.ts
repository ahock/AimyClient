import { Component, OnInit } from '@angular/core';
import { FormsModule }   from '@angular/forms';
import { Router } from '@angular/router';
import { AuthServiceService } from '../auth-service/auth-service.service';
import { UserService, User, SkillRef, AssignmentRefs } from '../user/user.service';
import { APP_CONFIG } from '../app-variables';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styles: []
})

export class RegistrationComponent implements OnInit {
  private appConfig: any = APP_CONFIG;
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
  private defaultassignments = [ 
    {
      id: "5d5004227c213e60b8ee1ef4",
      name: "Aimy-Bedienung - Was weiss ich schon?",
      status: "active",
      asstype: "PK",
      active: new Date(),
//      submitted: Date;
//      due: Date;
      attempts: "",
      daystogo: "",
      rating: "",
      comments: ""
    }
   ];

  constructor(public router: Router, public auth: AuthServiceService, public user: UserService) { }

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
//    this.user.activeuser.skillref.push(this.defaultskills[1]);

    this.user.activeuser.assignmentrefs = new Array();    
//    this.user.activeuser.assignmentrefs.push(this.defaultassignments[0]);
    
  }

  public doRegistration(): void {
    this.setDefaultSkills();
    this.user.activeuser.groups = this.appConfig.defaultGroups;
    this.user.activeuser.plan = "school";
    this.user.doRegistration();
    setTimeout(() => {
      this.user.loadUserData(() => {
        console.log("loginDone: User Data loaded");
        this.router.navigate(['/dialog']);
      });
    }, 1000);
  }
}

