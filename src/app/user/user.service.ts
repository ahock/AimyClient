import { Injectable } from '@angular/core';
//import { Http, Response } from '@angular/http';
import { Router } from '@angular/router';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";


// import { Observable } from 'rxjs/Observable';

import { Observable, Subscriber, throwError } from 'rxjs';


import { Subject } from 'rxjs/Subject';
import { map, filter, catchError } from 'rxjs/operators';

import { APP_CONFIG } from '../app-variables';
import { AuthServiceService } from '../auth-service/auth-service.service';
import { StatusService } from '../status/status.service';
import { LogService, Log } from '../log/log.service';

export interface EduObjective {
  _id: string;
  name: string;
  selfassess: string;
  preknowledge?: string;
  resume?: string;
  selfatest?: string;
  extatest?: string;
  mastery?: string;
}
export interface AssignmentRefs {
  id: string;
  name: string;
  status: string;
  type: string; 
  active: Date;
  submitted: Date;
  due: Date;
  attempts: string; 
  daystogo: string;
  rating: string;
  comments: string;
}
export interface SkillSetRef {
  
}
export interface SkillRef {
  id: string; 
  name: string; 
  description: string;
  status: string;
  togo: string;
  rating: string;
}
export interface User {
    _id?: string;
    token?: string;
    name: string;
    email: string;
    firstname: string;
    lastname: string;
    
    language?: string;
    gender?: string;
    plan?: string;
    learningstyle?: string;
    
    login_history?: [];
    reviews?: [];
    groups?: string[];
    goals?: [];
    masteries?: [];
    eduobjectives?: Array<EduObjective>;
    assignmentrefs?: Array<AssignmentRefs>;
    skillref?: Array<SkillRef>;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public static NO_USER = 0;
  public static USER_VALID = 1;
  public static USER_OK = 2;
  public static USER_REGISTRATION = 3;
  
  public user_status = UserService.NO_USER;
  
  private user_token: string = "";
  
  private user_valid: boolean = false;
  private user_loaded: boolean = false;
  private data_loadTime: Date;
  
  public activeuser: User;

  public firstname: string = "";
  public lastname: string = "";
  public full_name: string = "";
  public last_login: Date;
  public email1: string = "";
  public email2: string = "";
  public gender: string ="";
  public language: string = "";

  private error;

  constructor(public router: Router, public auth: AuthServiceService, public status: StatusService, public log:LogService, private http: HttpClient) {
    
    this.auth.setLoginCallback(this.loginDone);
    
    if (this.auth.isAuthenticated()) {
      this.user_token = this.auth.getToken();
      this.user_status = UserService.USER_VALID;
      this.status.setStatusText("Angemeldet");
      console.log("UserService - constructor: isAuthenticated", this.user_status, this.auth.getToken(), this.user_token);
      
      this.log.createLog(<Log>{token:this.user_token,area:"user",message:"login",content:"AimyClient"});
      
      this.loadUserData(() => {
        this.status.setStatusText("Benutzerdaten geladen: "+this.firstname);
        console.log("User_Status:",this.user_status)
        if(this.user_status == UserService.USER_REGISTRATION) {this.router.navigate(['/registration'])};
      });
    }
    else {
      console.log("UserService - constructor: NOT Authenticated", this.user_status);
    }
  }

  public loginDone(token: string):void {
    this.user_status = UserService.USER_VALID;
    console.log("loginDone", this.user_status, token);
    this.user_token = token;
    this.loadUserData( () => {
      console.log("loginDone: User Data loaded");
    });
  }
  
  public doRegistration():boolean {
    console.log("doRegistration");

    console.log("Active user", this.activeuser);

    // Store user data in system
    this.http
      .get(APP_CONFIG.storageURL+"/api/0.0.1/user/add", {params:{UserToken: this.auth.getToken(), UserData: JSON.stringify(this.activeuser)}})
      .subscribe((data) => {
        console.log("saveUserData", data);
      });

    return true;
  }
  
  public loadUserData(callback): void {
    console.log("UserService: loadUserData");
    this.data_loadTime = new Date();
    this.email2 = this.auth.auth_detail.email;
//    console.log("Config: ", APP_CONFIG.clientID, APP_CONFIG.storageURL, APP_CONFIG.apiVersion);
    if(localStorage.getItem('user_token') != "") {
      this.auth.setToken(localStorage.getItem('user_token'));
    }
    console.log("UserService: loadUserData - Token:", this.auth.getToken());
    
    if(this.auth.getToken()!="") {
      this.http
        .get(APP_CONFIG.storageURL+"/api/0.1.0/user/get", {params:{UserToken: this.auth.getToken(), ClientId: APP_CONFIG.clientID}})
        .subscribe((data) => {
          console.log("loadUserData", data);
          // Copy user data to service object
          if( data['success'] ) {
            this.activeuser = {name:this.firstname + " " + this.lastname,email:data['user']['email'],firstname:data['user']['firstname'],lastname:this.lastname = data['user']['lastname']};

            // Valid return data for user
            this.firstname = data['user']['firstname'];
            this.lastname = data['user']['lastname'];
            this.full_name = this.firstname + " " + this.lastname;
            this.email2 = data['user']['email'];
            this.last_login = new Date(data['user']['last_login']);

            this.user_status = UserService.USER_OK;
            
            this.activeuser.assignmentrefs = data['user']['assignmentrefs'];
            this.activeuser.skillref = data['user']['skillref'];
            this.activeuser.eduobjectives = data['user']['eduobjectives'];
            
            console.log("active user: ", this.activeuser);
            
            /*
            Datastructure from user database:
            
            email: "ahock@itondemand.eu"
            firstname: "Andreas"
            lastname: "Hock"

            last_login: "2018-10-11T11:56:11.502Z"
            login_history: []
            
            groups: (5) ["admin", "team1", "dozent1", "dswi17h", "dswi16h"]
            lang: "hallo"

            eduobjectives: (5) [{…}, {…}, {…}, {…}, {…}]
            masteries: (4) [{…}, {…}, {…}, {…}]
            reviews: []          
            
            */          
          }
          else {
            this.full_name = "User not valid!";
            this.user_status = UserService.USER_REGISTRATION;
          }
          this.user_loaded = true;
          if(data['success'] == true) {
            this.user_valid = true;  
            this.user_status = UserService.USER_OK;
          } else {
            this.user_valid = false;
            this.user_status = UserService.USER_REGISTRATION;
          }
          callback.call();
        },
        // Error
        error => {
          this.error = error;
          console.log("HTTP Error", this.error);
          this.status.setStatusText("Database Error: " + new Date());
          callback.call();
        }
        );
    }      
//      .pipe(
//        catchError(this.handleError),
//        map(data => {
//          for (let datas of (data as Array<any>)){
//            datas.title = datas.title + "Hey";
//          }
//        })        
//      );    
      
//      .map((response: Response) => response.json())
//      .subscribe(data => {
//        this.skills = data;
//        console.log("loadUserData", data);
//      });
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  };


  public userStatus(): string {
    console.log("UserService: userStatus");
    if(!this.user_loaded) { this.loadUserData(() => {
      this.status.setStatusText(this.auth.getToken());
    }) }
    return this.auth.getToken();
  }
  
  public isRegisteredUser(): boolean {
    console.log("UserService: isRegisteredUser");
    if(!this.user_loaded) { 
      this.loadUserData(() => {
//        console.log("Token: ", this.auth.getToken());
//        console.log("Loaded", this.user_loaded);
//        console.log("Valid User", this.user_valid);
        if(this.user_loaded&&!this.user_valid) {
//          console.log("Registration");
          this.router.navigate(['/registration']);
          return false;
          }
        })
    }
    return true;
  }
  public setUserToken(token: string): void {
    this.user_token = token;
  }
  public getUserToken(): string {
    return this.user_token;
  }
  public getUser(): User {
    return this.activeuser;
  }
  public getUserSkillStatus(skillid: string): string {
    if(this.activeuser.skillref) {
//      console.log("getUserSkillStatus",this.activeuser.skillref,skillid)
      var i: number = 0;
      while(this.activeuser.skillref[i].id!=skillid){
//        console.log("-", this.activeuser.skillref[i].name);
        i++;
      }
      return this.activeuser.skillref[i].status;
    } else {
      return "n/a";
    }
  }
  public getUserSkillRating(skillid: string): string {
    if(this.activeuser.skillref) {
//      console.log("getUserSkillStatus",this.activeuser.skillref,skillid)
      var i: number = 0;
      while(this.activeuser.skillref[i].id!=skillid){
//        console.log("-", this.activeuser.skillref[i].name);
        i++;
      }
      return this.activeuser.skillref[i].rating;
    } else {
      return "n/a";
    }
  }
  public getUserSkillAging(skillid: string): string {
    if(this.activeuser.skillref) {
//      console.log("getUserSkillStatus",this.activeuser.skillref,skillid)
      var i: number = 0;
      while(this.activeuser.skillref[i].id!=skillid){
//        console.log("-", this.activeuser.skillref[i].name);
        i++;
      }
      return this.activeuser.skillref[i].togo;
    } else {
      return "n/a";
    }
  }
  public getUserEduOSelfassessment(eduoid: string): string {
//    console.log("getUserEduO",eduoid,this.activeuser);
    if(this.activeuser.eduobjectives) {
//      console.log("getUserEduO",this.activeuser.eduobjectives);
      var i: number;
      for(i = 0; i<this.activeuser.eduobjectives.length; i++) {
//        console.log(i);
        if(this.activeuser.eduobjectives[i]._id==eduoid) {
          break;
        }
      }
//      console.log(i);
      if(i<this.activeuser.eduobjectives.length) {
        return this.activeuser.eduobjectives[i].selfassess;  
      } else {
        return "n/a";
      }
    } else {
      return "n/a";
    }
  }
  public getUserEduO(achievement: number, eduoid: string): string {
    /*
    achievement:
    0: Resume
    1: PreKnowledge
    2: SelfAtest
    3: ExtAtest
    4: Mastery
    */
    if(this.activeuser.eduobjectives) {
      for(var i = 0; i<this.activeuser.eduobjectives.length; i++) {
        if(this.activeuser.eduobjectives[i]._id==eduoid) {
          break;
        }
      }
//      console.log(i);
      if(i<this.activeuser.eduobjectives.length) {
        // matching eduo found
        var result: string;
        switch(achievement) {
          case 0:
            result = this.activeuser.eduobjectives[i].resume;
            break;
          case 1:
            result = this.activeuser.eduobjectives[i].preknowledge;
            break;
          case 2:
            result = this.activeuser.eduobjectives[i].selfatest;
            break;
          case 3:
            result = this.activeuser.eduobjectives[i].extatest;
            break;
          case 4:
            result = this.activeuser.eduobjectives[i].mastery;
            break;
          default:
            result = "n/a";
        }
        return result;  
      } else {
        return "n/a";
      }
    } else {
      return "n/a";
    }
  }
  public setUserEduOSelfassessment(eduoid: string, value: string): void {
    console.log("UserService: Save selfassess", eduoid, value);
    if(eduoid!=""&&value!=undefined) {
      this.http
        .get(APP_CONFIG.storageURL+"/api/0.1.0/user/seteduoselfassess", {params:{token: this.auth.getToken(), eduoid: eduoid, value: value}})
        .subscribe((data) => {
          console.log("saveUserData", data);
      });
      for(var i=0; i<this.activeuser.eduobjectives.length;i++) {
        console.log("EduO "+i+" of user:", this.activeuser.eduobjectives[i] );
        if(eduoid==this.activeuser.eduobjectives[i]._id) {
          console.log("EduO "+i+" of user:", this.activeuser.eduobjectives[i] );
          this.activeuser.eduobjectives[i].selfassess = value;
          break;
        }
      }
      if(i>=this.activeuser.eduobjectives.length) {
        // new self assessment
        this.activeuser.eduobjectives.push({_id: eduoid, selfassess: value, name: "New"});
      }
    }
  } 
  
}
