import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { APP_CONFIG } from '../app-variables';

export interface Log {
  _id?: string; 
  token: string; 
  message: string, 
  type: number, 
  area: string, 
  content: string, 
  lang?: string, 
  create_date: Date 
}

@Injectable({
  providedIn: 'root'
})

export class LogService {
  
  private loglist: Log[];
  public newlog: Log;
  
  constructor(private http: HttpClient) { }

  public loadByToken(token: string) {
    this.http
      .get(APP_CONFIG.storageURL+"/api/0.1.0/log/get", {params:{token: token}})
      .subscribe((data) => {
        if( data['success'] ) {
            // Valid return data for user
            this.loglist = <Log[]>data['logentries'];
            console.log("Log Get", <Log[]>data, this.loglist);
        };        
    });    
  }  
  public getLogs(): Log[] {
    return this.loglist;
  }
  public createLog(logentry: Log): void {
    if(logentry.token!="" && logentry.content!="") {
      console.log("createLog", logentry);  
    
    this.http
      .get(APP_CONFIG.storageURL+"/api/0.1.0/log/add", {params:{
        token:logentry.token,
        message:logentry.message,
        area:logentry.area,
        content:logentry.content
      }})
      .subscribe((data) => {
        if( data['success'] ) {
            // Valid return data for user
          console.log("Log entry created", data);
        }
      });
    }
  }
}