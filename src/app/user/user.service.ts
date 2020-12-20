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
  PK_asscount?: number;
  PK_count?: number;
  PK_ok?: number;
  SA_asscount?: number;
  SA_count?: number;
  SA_ok?: number;
  MA_asscount?: number;
  MA_count?: number;
  MA_ok?: number;

  
  preknowledge?: string;
  resume?: string;
  selfatest?: string;
  extatest?: string;
  mastery?: string;
}

export interface AssignmentResult {
  pass?: boolean;
  create_date: Date;
  elapsedtime?: Date;
  rightanswers?: number;
  questioncount?: number;
  eduobj?: any[];
  result?: any[];
}

export interface AssignmentRefs {
  id: string;
  name: string;
  status: string;
  asstype: string; 
  active: Date;
  submitted?: Date;
  due?: Date;
  attempts: string; 
  daystogo: string;
  rating: string;
  comments: string;
  assresults?: Array<AssignmentResult>;
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
        this.status.setStatusText("Benutzerdaten geladen: "+this.firstname+" "+this.lastname+" ["+this.email2+"]["+this.auth.getToken()+"]");
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
      .get(APP_CONFIG.storageURL+"/api/0.1.0/user/add", {params:{UserToken: this.auth.getToken(), UserData: JSON.stringify(this.activeuser)}})
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
      this.status.setStatusText("Benutzerdaten geladen: "+this.firstname+" "+this.lastname+" ["+this.email1+"]["+this.auth.getToken()+"]");
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
//    console.log(`getUserToken -${this.user_token}-${this.auth['_userToken']}`);
    if(this.user_token=="") {
      if(this.auth['_userToken']!="") {
        this.user_token = this.auth['_userToken'];
      }
    } else {
      return this.user_token;  
    }
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
  public getUserEduORating(eduoid: string): any {
    var result = {count: 0, countok: 0};
    var i;
    
    if(this.activeuser.eduobjectives) {
      for(i = 0; i<this.activeuser.eduobjectives.length; i++) {
        if(this.activeuser.eduobjectives[i]._id==eduoid) {
          break;
        }
      }
//      console.log("getUserEduORating", i, this.activeuser.eduobjectives[i]);
      if(i < this.activeuser.eduobjectives.length) {
        result = {count: this.activeuser.eduobjectives[i].MA_count, countok: this.activeuser.eduobjectives[i].MA_ok};
      }
    }
    return result;
  }
  public getUserEduO(achievement: number, eduoid: string): any {
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
      if(i<this.activeuser.eduobjectives.length) {
        // matching eduo found
        var result: any = {
          valid: true,
          text: "",
          pass: false,
          ass_count: 0,
          cha_count: 0,
          cha_ok: 0,
          percent: "0%"
        };
        
        switch(achievement) {
          case 0:
            result.text = this.activeuser.eduobjectives[i].resume;
            
            break;
          case 1:
            // PreKnowledge
            if(this.activeuser.eduobjectives[i].PK_asscount>0) {
              result.text = this.activeuser.eduobjectives[i].PK_asscount + ": " + this.activeuser.eduobjectives[i].PK_ok + "/" + this.activeuser.eduobjectives[i].PK_count + " - " + Math.ceil(100*(this.activeuser.eduobjectives[i].PK_ok/this.activeuser.eduobjectives[i].PK_count)) + "%";
            } else {
              result.text = "not determined";
              result.valid = false;
            } 
            break;
          case 2:
            // SelfAtest
            if(this.activeuser.eduobjectives[i].SA_asscount>0) {
              result.text = this.activeuser.eduobjectives[i].SA_asscount + ": " + this.activeuser.eduobjectives[i].SA_ok + "/" + this.activeuser.eduobjectives[i].SA_count + " - " + Math.ceil(100*(this.activeuser.eduobjectives[i].MA_ok/this.activeuser.eduobjectives[i].MA_count)) + "%";
              result.pass = Math.ceil(100*(this.activeuser.eduobjectives[i].SA_ok/this.activeuser.eduobjectives[i].SA_count))>=70?true:false;
              result.ass_count = this.activeuser.eduobjectives[i].SA_asscount;
              result.cha_count = this.activeuser.eduobjectives[i].SA_count;
              result.cha_ok = this.activeuser.eduobjectives[i].SA_ok;
              result.percent = Math.ceil(100*(this.activeuser.eduobjectives[i].SA_ok/this.activeuser.eduobjectives[i].SA_count)) + "%";
              
            } else {
              result.valid = false;
            }
            break;
          case 3:
            // External Assessment
            result.text = "nicht durchgeführt";
            result.valid = false;
            break;
          case 4:
            // Mastery
            if(this.activeuser.eduobjectives[i].MA_asscount>0) {
              result.text = this.activeuser.eduobjectives[i].MA_asscount + ": " + this.activeuser.eduobjectives[i].MA_ok + "/" + this.activeuser.eduobjectives[i].MA_count + " - " + Math.ceil(100*(this.activeuser.eduobjectives[i].MA_ok/this.activeuser.eduobjectives[i].MA_count)) + "%";
              result.pass = Math.ceil(100*(this.activeuser.eduobjectives[i].MA_ok/this.activeuser.eduobjectives[i].MA_count))>=65?true:false;
              result.ass_count = this.activeuser.eduobjectives[i].MA_asscount;
              result.cha_count = this.activeuser.eduobjectives[i].MA_count;
              result.cha_ok = this.activeuser.eduobjectives[i].MA_ok;
              result.percent = Math.ceil(100*(this.activeuser.eduobjectives[i].MA_ok/this.activeuser.eduobjectives[i].MA_count)) + "%";
            } else {
              result.valid = false;
            }
            break;
          default:
            result.text = "n/a";
        }
        return result;  
      } else {
        return {text: "n/a"};
      }
    } else {
      return {text: "n/a"};
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
  public setAssignmentPreparatoryAnswers(assignmentid: string, answers: any) {
    console.log("function setAssignmentPreparatoryAnswers", answers);

    this.http
        .get(APP_CONFIG.storageURL+"/api/0.1.0/user/setpreparatory", {params:{token: this.auth.getToken(), assignment: assignmentid, answers: JSON.stringify(answers)}})
        .subscribe((data) => {
          console.log("updatePreparatory", data);
    });    
    
  }
  public setAssmentResult(token: string, assessmentid: string, assessmentresult: AssignmentResult, assmenttype: string) {
    console.log("setAssmentResult:", token, assessmentid, assessmentresult);
    this.http
        .get(APP_CONFIG.storageURL+"/api/0.1.0/user/setassessmentresult", {params:{token: this.auth.getToken(), assignment: assessmentid, result: JSON.stringify(assessmentresult), asstype: assmenttype}})
        .subscribe((data) => {
          console.log("saveAssessmentResult", data);
    });
  }
  public getAssignmentRuns(assid: string): any {
    var assignment: any;
    
    for(var i=0;i<this.activeuser.assignmentrefs.length;i++) {
      if(this.activeuser.assignmentrefs[i].id==assid) {
        assignment = this.activeuser.assignmentrefs[i];
        break;
      }  
    }
    return assignment.results;
  }
  public getSkillEvaluation(skillid: string, mode: number, refid: string, threshold: number , callback: any): void {
    console.log("getSkillEvaluation:", skillid, mode, refid, threshold);
    this.http
        .get(APP_CONFIG.storageURL+"/api/0.1.0/user/getskillevaluation", {params:{token: this.auth.getToken(), skillid: skillid, mode: mode.toString(), refid: refid, threshold: threshold.toString()}})
        .subscribe((data) => {
          console.log("getSkillEvaluation", data);
          callback(data['evaluation']);
    });
  }
}
