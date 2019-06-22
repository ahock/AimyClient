import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SkillService } from '../skill/skill.service';
import { UserService } from '../user/user.service';

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
  
  constructor(private route:ActivatedRoute, private skills: SkillService, private users:UserService) {
    this.route.params.subscribe( params => {
      console.log("Skill Param: ", params)
      this.skillid = params.id;
      this.skills.getSkill(this.skillid);
    })    
  }

  ngOnInit() {
    
  }
  


}
