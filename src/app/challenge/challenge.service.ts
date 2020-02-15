import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { APP_CONFIG } from '../app-variables';

export interface Challenge {
    _id?: string;
    name: string,
    text: string,
    hint: string,
    type: string,
    status: number, //0: ...
    lang: string,
    aspect: string,
    field: string,
    module: string,
    eduobjectives: [any],
    correct: [string],
    answers: [string],
    participants: [string]
}

@Injectable({
  providedIn: 'root'
})
export class ChallengeService {
  public challenges: [Challenge];
  constructor(private http: HttpClient) {
    
  }
  
  public loadChallenges(ch_ids: string[]): void{
    console.log("Challenges:", ch_ids);
    if(ch_ids != undefined && ch_ids.length>0) {
      let ida = JSON.stringify(ch_ids);
      this.http
        .get(APP_CONFIG.storageURL+"/api/0.0.1/challenge/get", {params:{id: ida}})
        .subscribe((data) => {
//          console.log("Challenges loaded:", <[Challenge]>data);
          this.challenges = <[Challenge]>data;
          for(var i=0; i<this.challenges.length; i++) {
            this.challenges[i].status = 0;
            if(this.challenges[i].type[0]=="survey") {
              console.log("Survey:", this.challenges[i]['survey']['numberparticipants']);
            
              for(var j=0;j<this.challenges[i]['survey']['numberparticipants'];j++) {
                if(j==0) {
                  this.challenges[i].participants = ["participant email address"];
                } else {
                  this.challenges[i].participants.push("participant email address"); 
                }
              }
            }
          }
          console.log("Challenges loaded:", this.challenges);
        });
    }
  }
  
}