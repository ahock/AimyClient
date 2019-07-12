import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EduobjectiveService } from '../eduobjective/eduobjective.service';
import { UserService } from '../user/user.service';

@Component({
  selector: 'app-eduobjective',
  templateUrl: './eduobjective.component.html',
  styles: [
    `.card-text {
        padding: 20px;
      }
    `
  ]
})
export class EduobjectiveComponent implements OnInit {
  private eduobjectiveid: string;
  private selfassessvalue: string;
  private editselfassess: boolean = false;
  
  constructor(private route:ActivatedRoute, private eduobjective: EduobjectiveService, private users:UserService) {
    this.route.params.subscribe( params => {
      console.log("EduObjective Param: ", params)
      this.eduobjectiveid = params.id;
      this.eduobjective.getEduObjectives(this.eduobjectiveid);
      this.selfassessvalue = this.users.getUserEduOSelfassessment(this.eduobjectiveid);
    })
  }

  ngOnInit() {
    console.log("EduObjective Init:", this.eduobjective.eduobjective, this.eduobjectiveid)
  }

  public selfassess(): void {
    console.log("selfassess", this.eduobjectiveid);  
    this.editselfassess = !this.editselfassess;
    
    if(!this.editselfassess) {
      if(this.users.getUserEduOSelfassessment(this.eduobjectiveid)!=this.selfassessvalue) {
        // Only save if value has changed
        console.log("Save selfassess", this.selfassessvalue);
        this.users.setUserEduOSelfassessment(this.eduobjectiveid, this.selfassessvalue);  
      }
    }
  }
}
