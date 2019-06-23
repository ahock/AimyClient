import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthServiceService } from '../auth-service/auth-service.service';
import { UserService } from '../user/user.service';
import { SkillsetService } from '../skillset/skillset.service';
import { SkillService } from '../skill/skill.service';

@Component({
  selector: 'app-component1',
  templateUrl: './component1.component.html',
  styles: []
})
export class Component1Component implements OnInit {
  private skillsetindex: number = 0;
  private skillindex: number = -1;
  private eduoindex: number = 0;
  private addskillflag: boolean = false;
  
  constructor(public auth: AuthServiceService, private users: UserService, private skillsets: SkillsetService, private skills: SkillService) { }

  ngOnInit() {
    console.log("Component1 - ngOnInit", this.auth.getToken(), this.skillsets.skillsetlist, this.users );
    
  }

  public setactiveskillset(i: number): void {
    if(i!=this.skillsetindex) {
      console.log("set skillsetindex", this.skillsetindex, i)
      this.skillsetindex = i;
      this.setactiveskill(0);
    }
  }
  public setactiveskill(i: number): void {
    if(i!=this.skillindex) {
      console.log("set skillindex", this.skillindex, i)
      this.skillindex = i;
      
      console.log(this.skillsets.skillsetlist[this.skillsetindex].skillref[this.skillindex].id);
      this.skills.getSkill(this.skillsets.skillsetlist[this.skillsetindex].skillref[this.skillindex].id);
      console.log(this.skills.skill);      
      
    }
  }
  public setactiveeduo(i: number): void {
    if(i!=this.eduoindex) {
      console.log("set eduoindex", this.eduoindex, i)
      this.eduoindex = i;
    }
  }

  public addskill():void{
    this.addskillflag = true;
  }
  public savenewskill(command: string):void{
    if(command=="save") {
      
    }
    if(command=="cancle") {
      
    }
    this.addskillflag = false;
  }
}