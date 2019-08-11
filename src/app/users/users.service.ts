import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, Subscriber, throwError } from 'rxjs';
import { map, filter, catchError } from 'rxjs/operators';
import { APP_CONFIG } from '../app-variables';

export interface EduObjective {
  oid: string;
  name: string;
  field: string;
  selfassess: string;
  notes: string;
}

export interface User {
    _id: string;
    token: string;
    name?: string;
    email: string;
    firstname: string;
    lastname: string;
    login_history: [];
    reviews: [];
    groups: string[];
    goals: [];
    masteries: [];
    eduobjectives: Array<EduObjective>;
    plan?: string;
}


@Injectable({
  providedIn: 'root'
})

export class UsersService {
  private userlist: User[];
  public selected_user_index: number;
  public token_selected: string = "";

  constructor(private http: HttpClient) {

    this.http
      .get(APP_CONFIG.storageURL+"/api/0.0.1/user/list", {})
      .subscribe((data) => {
        console.log("saveUserData", <User[]>data);
//        if( data['success'] ) {
            // Valid return data for user
            this.userlist = <User[]>data;
//            this.firstname = data['user']['firstname'];
//        };        
      });    
  }
  
  public getUsers(): User[] {
    return this.userlist;
  }
  
  public getUserDetailByToken(tok: string): User {
    for(var i=0;i<this.userlist.length;i++) {
      if(this.userlist[i].token==tok) {
        return this.userlist[i];
      }
    }
    return null;
  }
  
  public  selectUserByIndex(obj: any): any {
      this.selected_user_index = <number>obj;
      this.token_selected = this.userlist[obj].token;
      return this.token_selected;
    }
}