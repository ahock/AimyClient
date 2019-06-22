import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EduobjectiveService } from '../eduobjective/eduobjective.service';

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
  
  constructor(private route:ActivatedRoute, private eduobjective: EduobjectiveService) {
    this.route.params.subscribe( params => {
      console.log("EduObjective Param: ", params)
      this.eduobjectiveid = params.id;
      this.eduobjective.getEduObjectives(this.eduobjectiveid);
    })
  }

  ngOnInit() {
    console.log("EduObjective Init:", this.eduobjective.eduobjective, this.eduobjectiveid)
  }

  public selfassess(): void {
    console.log("selfassess", this.eduobjectiveid);  
  }
}
