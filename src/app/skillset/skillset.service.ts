import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { UserService } from '../user/user.service';
import { StatusService } from '../status/status.service';
//import { LogService, Log } from '../log/log.service';
import { APP_CONFIG } from '../app-variables';

export interface SkillSet {
  _id: string;
  name: string;
  field: string;
  modul: string;
  description: string;
  lang: string;
  create_date: Date;
  skillref: {_id: string, name: string};
  eduobjectiveref: {_id: string, name: string};
}

@Injectable({
  providedIn: 'root'
})
export class SkillsetService {
  public skillsetlist: SkillSet[];
  
  constructor(private users:UserService, private status:StatusService, private http:HttpClient) {
    this.getSkillList();
  }
  
  public getSkillList(): void {
    console.log("SkillList");
    this.http
      .get(APP_CONFIG.storageURL+"/api/0.1.0/skillset/getall")
      .subscribe((data) => {
        if( data['success'] ) {
//          console.log("skill loaded", data);
          this.skillsetlist = <[SkillSet]>data['skillsets'];
          console.log("SkillSets loaded", this.skillsetlist);
        }
      });
  }
}