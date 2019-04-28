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

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private user_token: string = "";
  private user_valid: boolean = false;
  private user_loaded: boolean = false;
  private data_loadTime: Date;

  constructor(public router: Router, public auth: AuthServiceService, public status: StatusService, private http: HttpClient) {
    console.log("UserService: constructor");
  }

  private loadUserData(callback): void {
    console.log("UserService: loadUserData");
    this.data_loadTime = new Date();
    console.log("Config: ", APP_CONFIG.clientID, APP_CONFIG.storageURL, APP_CONFIG.apiVersion);
    console.log("Token:",this.auth.getToken());
    console.log("LoadDate: ", this.data_loadTime);
    if(this.auth.getToken()!="") {
      this.http
        .get(APP_CONFIG.storageURL+"/api/0.0.1/user/get", {params:{UserToken: this.auth.getToken(), ClientId: APP_CONFIG.clientID}})
        .subscribe(data => {
          console.log("loadUserData", data);
          this.user_loaded = true;
          if(data['success'] == true) {
            this.user_valid = true;  
          } else {
            this.user_valid = false;
          }
          callback.call();
        });
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
        console.log("Token: ", this.auth.getToken());
        console.log("Loaded", this.user_loaded);
        console.log("Valid User", this.user_valid);
        if(this.user_loaded&&!this.user_valid) {
          console.log("Registration");
          this.router.navigate(['/registration']);
          return false;
          }
        })
    }
    return true;
  }
}
