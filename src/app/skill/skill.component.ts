import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SkillService } from '../skill/skill.service';
import { UserService } from '../user/user.service';
import { APP_CONFIG } from '../app-variables';

@Component({
  selector: 'app-skill',
  templateUrl: './skill.component.html',
  styles: [`
    .card-attributes {
      color: gray;
      margin-left: 20px;
      margin-right: 20px;
      margin-bottom: 2px;        
    }
    .card-block {
      color: purple;
      margin-left: 10px;
      margin-right: 20px;
      margin-bottom: 5px;
    }`
  ]
})
export class SkillComponent implements OnInit {
  private skillid: string;
  private skillevaluation: boolean[];
  
  togSkillCat = APP_CONFIG.togSkillCat;
  
  constructor(private route:ActivatedRoute, private skills: SkillService, private users:UserService) {
    this.route.params.subscribe( params => {
      console.log("Skill Param: ", params)
      this.skillid = params.id;
      this.skillevaluation = [];
      
      this.skills.getSkill(this.skillid, ()=>{
        for(var i=0;i<this.skills.skill.evaluation.length;i++) {
          switch(this.skills.skill.evaluation[i]['mode']) {
            case 1:
              this.users.getSkillEvaluation(this.skillid, 1, this.skills.skill.evaluation[i]['eduo_id'], 60 , (evaluation: any) => {
                this.skillevaluation.push(evaluation.result);
              });
              break;
            case 2:
              this.users.getSkillEvaluation(this.skillid, 2, this.skills.skill.evaluation[i]['ass_id'],0 , (evaluation: any) => {
                this.skillevaluation.push(evaluation.result);
              });
          }
        }
        
      });
    })    
  }

  ngOnInit() {
    
  }
  
  public getSkillEvaluation(skillid: string, mode: number, refid: string) {
    var threshold: number = 60; // in %

    this.users.getSkillEvaluation(skillid, mode, refid, threshold, (evaluation: any) => {
      console.log("getSkillEvaluation", evaluation);
    });
  }
}
