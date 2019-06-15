import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { APP_CONFIG } from '../app-variables';

export interface EduObjective {
  _id: string; 
  name?: string;
  
}

@Injectable({
  providedIn: 'root'
})
export class EduobjectiveService {
  public eduobjective: EduObjective;
  
  constructor(private http: HttpClient) { }
  
  public getEduObjectives(id: string): void {
    console.log("EduObjective to load", id, this.eduobjective);
    if(id) {
      this.http
        .get(APP_CONFIG.storageURL+"/api/0.1.0/eduobjective/get", {params:{id: id}})
        .subscribe((data) => {
          if( data['success'] ) {
            console.log("EduObjective loaded", data);
              this.eduobjective = data['eduobjective'];
          }
        });
    } 
  }  
}
