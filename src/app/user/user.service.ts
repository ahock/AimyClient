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
  oid: string;
  name: string;
  field: string;
  selfassess: string;
  notes: string;
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
  
  private activeuser: User;

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
      console.log("UserService - constructor: isAuthenticated", this.user_status, this.user_token);
      
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

  public loginDone():void {
    console.log("loginDone", this.user_status);
    this.user_status = UserService.USER_VALID;
    console.log("loginDone", this.user_status);
  }
  
  public doRegistration():boolean {

    console.log("doRegistration");
    console.log("firstname", this.firstname);
    console.log("lastname", this.lastname);
    console.log("full_name", this.full_name);
    console.log("email", this.email1);
    console.log("email2", this.email2);
    console.log("gender", this.gender);
    console.log("language", this.language);
    
    var payload = {
      token: this.auth.getToken(),
      firstname:this.firstname,
      lastname:this.lastname,
      email1:this.email1,
      email2:this.email2,
      gender:this.gender,
      language:this.language,
    };
    
    this.http
      .get(APP_CONFIG.storageURL+"/api/0.0.1/user/add", {params:{UserToken: this.auth.getToken(), UserData: JSON.stringify(payload)}})
      .subscribe((data) => {
        console.log("saveUserData", data);
      });    
    return true;
  }
  
  private loadUserData(callback): void {
    console.log("UserService: loadUserData");
    this.data_loadTime = new Date();
    this.email2 = this.auth.auth_detail.email;
    
//    console.log("Config: ", APP_CONFIG.clientID, APP_CONFIG.storageURL, APP_CONFIG.apiVersion);
//    console.log("Token:",this.auth.getToken());
//    console.log("LoadDate: ", this.data_loadTime);
    if(this.auth.getToken()!="") {
      this.http
        .get(APP_CONFIG.storageURL+"/api/0.0.1/user/get", {params:{UserToken: this.auth.getToken(), ClientId: APP_CONFIG.clientID}})
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
  public getUserToken(): string {
    return this.user_token;
  }
  public getUser(): User {
    return this.activeuser;
  }
}
