import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { APP_CONFIG } from '../app-variables';
import { StatusService } from '../status/status.service';
import { LogService, Log } from '../log/log.service';

export interface Assignment {
  _id: string; 
  name?: string;
  status?: string;
  modul?: string;
  resultpro?: string;
  learninggoal?: string;
  options?: string;
  type?: string;
  description?: string;
  rubic?: string;
  rating?: string;
  lang?: string;
  field?: string;
  unit?: string;
  unitmax?: number;
  unitpass?: number;
  earlieststart?: Date;
  latestend?: Date;
  group?: string;
  startmode?: string;
  durationunit?: string;
  duration?: number;
  create_date?: Date;
  autor?: string;
  coautor?: string;
  coach?: string;
  challenges: [string],
  eduobjref: {id: string, name: string}
}

@Injectable({
  providedIn: 'root'
})

export class AssignmentService {
  public assignment: Assignment;
  
  constructor(public status: StatusService, public log: LogService, private http: HttpClient) { }

  public getAssignmentById(id: string): Assignment {
    console.log("Assignment to load", id, this.assignment);
    if(this.assignment == undefined || id != this.assignment._id) {
      this.http
        .get(APP_CONFIG.storageURL+"/api/0.1.0/assignment/get", {params:{id: id}})
        .subscribe((data) => {
          if( data['success'] ) {
            console.log("Assignment loaded", data);
              this.assignment = data['assignment'];
              return this.assignment;
          }
        });
    } else {
      return this.assignment;
    }
  }
}