import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { UserService } from '../user/user.service';
import { StatusService } from '../status/status.service';
import { LogService, Log } from '../log/log.service';
import { APP_CONFIG } from '../app-variables';

export interface Skill {
  _id: string;
  name: string;
  field: string;
  modul: string;
  description: string;
  lang: string;
  create_date: Date;
  skillsetref: {_id: string, name: string};
  eduobjectiveref: [{_id: string, name: string}];
  evaluation: [{}];
  statistic: {};
}

@Injectable({
  providedIn: 'root'
})
export class SkillService {
  public skill: Skill;
  
  constructor(private user:UserService, private status:StatusService, private log:LogService, private http:HttpClient) {
    
  }
  
  public getUserSkills(): Skill[] {
    var skilllist: Skill[];

    console.log("Skills User", this.user);
    
    return skilllist;
  }
  public getSkill(id: string): void {
    console.log("Skill to load", id, this.skill);
    if(id) {
      this.http
        .get(APP_CONFIG.storageURL+"/api/0.1.0/skill/get", {params:{id: id}})
        .subscribe((data) => {
          if( data['success'] ) {
            this.skill = <Skill>data['skill'];

            this.http
              .get(APP_CONFIG.storageURL+"/api/0.1.0/skill/statistic", {params:{id: id}})
              .subscribe((data) => {
                if( data['success'] ) {
                  this.skill.statistic = data['statistic'];
                  console.log("Skill loaded", this.skill);
                }
              });
          }
        });
    } 
  }
  public getSkillC(id: string, callback: Function) {
    console.log("Skill to load", id, this.skill);
    if(id) {
      this.http
        .get(APP_CONFIG.storageURL+"/api/0.1.0/skill/get", {params:{id: id}})
        .subscribe((data) => {
          if( data['success'] ) {
            this.skill = <Skill>data['skill'];
            callback();
            console.log("Skill loaded", this.skill);
          }
        });
    } 
  }
}
