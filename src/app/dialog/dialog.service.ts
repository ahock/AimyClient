import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, Subscriber, throwError } from 'rxjs';
import { map, filter, catchError } from 'rxjs/operators';
import { APP_CONFIG } from '../app-variables';

export interface Dialog {
    _id?: string;
    token: string;
    lang?: string;
    create_date: Date;
    state: number;
    type?: number;
    content: string;
    rating?: string;
//    reaction: [reactionSchema],
}

  const R_OK = 10;
  const R_DELAY = 11;

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  public dialoglist: Dialog[];
  public newdialog: Dialog = {token:"", content:"", create_date:new Date, state:1};

  constructor(private http: HttpClient) { }

  public loadByToken(token: string, callback: any) {
    this.http
      .get(APP_CONFIG.storageURL+"/api/0.1.0/dialogs/get", {params:{token: token}})
      .subscribe((data) => {
        if( data['success'] ) {
            // Valid return data for user
            this.dialoglist = <Dialog[]>data['dialogs'];
            console.log("Dialog Get", <Dialog[]>data, this.dialoglist);
            callback();
        };        
    });    
  }
  public getDialogs(): Dialog[] {
    return this.dialoglist;
  }

  public getActiveDialogCount(token: string, callback): void {
    var ActiveDialogCount: number = 0;

    this.http
      .get(APP_CONFIG.storageURL+"/api/0.1.0/dialogs/getactive", {params:{token: token}})
      .subscribe((data) => {
        if( data['success'] ) {
          ActiveDialogCount = data['dialogcount'];
          console.log("DialogCount", ActiveDialogCount);
          callback(ActiveDialogCount);
        }
    });    
  }
  
  public createNewDialog(token: string): void {
    this.newdialog.token = token;
    
    if(token!="" && this.newdialog.content!="") {
      console.log("createNewDialog", this.newdialog);  
    
    this.http
      .get(APP_CONFIG.storageURL+"/api/0.1.0/dialogs/add", {params:{token: this.newdialog.token,content:this.newdialog.content}})
      .subscribe((data) => {
        if( data['success'] ) {
            // Valid return data for user
          console.log("Dialog add", data);
//            this.firstname = data['user']['firstname'];
        }
      });
      
      
      
    }
  }
  public addReaction(id: string, reaction: number, text: string, callback: any): void {
    
    if(id!="" && reaction>=0) {
      console.log("addReaction", id, reaction, text);  
      
      var reactionString: string = String(reaction);
      
      this.http
        .get(APP_CONFIG.storageURL+"/api/0.1.0/dialogs/reaction", {params:{id: id, reaction: reactionString, text: text}})
        .subscribe((data) => {
          if( data['success'] ) {
            console.log("Reaction add", data);
            
            // delete dialog in dialog list
            //this.dialoglist = <Dialog[]>
            for(var i=0; i<this.dialoglist.length;i++) {
              if(this.dialoglist[i]._id == id) {
                // delete iten in array
                console.log("delete dialog", id, i);
                this.dialoglist.splice(i, 1);
                break;
              } 
            }
            callback();
          }
        });
    }
  }
}