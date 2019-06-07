import { Injectable } from '@angular/core';

import {HttpClient} from "@angular/common/http";

import { UserService } from '../user/user.service';
import { StatusService } from '../status/status.service';
import { LogService, Log } from '../log/log.service';

export interface Skill {
  oid: string;
  name: string;
  field: string;
  selfassess: string;
  notes: string;
}

@Injectable({
  providedIn: 'root'
})
export class SkillService {

  constructor(private user:UserService, private status:StatusService, private log:LogService, private http:HttpClient) {
    
  }
  
  public getUserSkills(): Skill[] {
    var skilllist: Skill[];

    console.log("Skills User", this.user);
    
    return skilllist;
  }
}
