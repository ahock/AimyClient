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
  eduobjref: [any]
}

export interface Availability {
  available: boolean;
  before: boolean;
  after: boolean;
  until: Date;
  until_mon: number;
  until_day: number;
  until_hr: number;
  until_min: number;
  in: Date;
  in_mon: number;
  in_day: number;
  in_hr: number;
  in_min: number
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
  public isAvailable(): Availability {
    var now = new Date();
    var start = new Date(this.assignment.earlieststart);
    var stop = new Date(this.assignment.latestend);
    
//    console.log("Dates - now:  ", now);
//    console.log("Dates - start:", start);
//    console.log("Dates - end:", stop);
    
//    console.log("start", now >= start);
//    console.log("end", now > stop);

    var available_until = new Date(stop.valueOf() - now.valueOf());
    var available_in = new Date(start.valueOf() - now.valueOf());

//    console.log("available: until:", available_until.getMonth(), available_until.getDate());
//    console.log("available in: ", available_in.getMonth(), available_in.getDate());

    return { 
      available: ((now >= start) && (now <= stop)),
      before: (now < start)?true:false,
      after: (now > stop)?true:false,
      until: available_until,
      in: available_in,
      in_mon: available_in.getMonth(),
      in_day: available_in.getDate()-1,
      in_hr: available_in.getHours()-1,
      in_min: available_in.getMinutes(),
      until_mon: available_until.getMonth(),
      until_day: available_until.getDate()-1,
      until_hr: available_until.getHours()-1,
      until_min: available_until.getMinutes()
    };
  }
}