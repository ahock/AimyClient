import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { APP_CONFIG } from '../app-variables';

export interface Challenge {
    _id?: string;
    name: string,
    text: string,
    hint: string,
    type: string,
    lang: string,
    aspect: string,
    field: string,
    module: string,
    eduobjectives: [string],
    correct: [string],
    answers: [string]
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
          console.log("Challenges loaded:", <[Challenge]>data);
          this.challenges = <[Challenge]>data;
        });
    }
  }
  
}