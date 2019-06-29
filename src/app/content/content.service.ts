import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { UserService } from '../user/user.service';
import { StatusService } from '../status/status.service';
import { LogService, Log } from '../log/log.service';
import { APP_CONFIG } from '../app-variables';

export interface Content {
  _id: string; 
  name?: string;
  
}

@Injectable({
  providedIn: 'root'
})

export class ContentService {
  public content: Content;
  
  constructor(private user:UserService, private status:StatusService, private log:LogService, private http:HttpClient) { }
  
  
  public getContent(id: string): void {
    console.log("Content to load", id, this.content);
    if(id) {
      this.http
        .get(APP_CONFIG.storageURL+"/api/0.1.0/content/get", {params:{id: id}})
        .subscribe((data) => {
          if( data['success'] ) {
            this.content = <Content>data['content'];
            console.log("Content loaded", this.content);
          }
        });
    } 
  }
  public visitContent(): void {
    console.log("Content "+this.content.name+" visited");
    
    this.log.createLog(<Log>{token: this.user.getUserToken(), message: "Lernmittel", type: 2, area: "content", content: "Lernmittel "+this.content.name+"wird verwendet ("+this.content._id+")"}); 
  }
  
  public addContent(contype: string, url: string, name: string, description: string, lang: string, callback: Function ): void {
    console.log("Content add", contype,url,name);

    this.http
      .get(APP_CONFIG.storageURL+"/api/0.1.0/content/upsert", {params:{name: name, ctype:contype, description:description, url:url, lang:lang}})
      .subscribe((data) => {
        if( data['success'] ) {
          console.log("Content added", data);
          callback(data['content']['_id']);
        }
      });
  }
}