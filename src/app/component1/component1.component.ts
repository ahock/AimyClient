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
  private skillindex: number = 0;
  private eduoindex: number = 0;
  private addskillflag: boolean = false;
  private skillsetfilter: string = "";
  
  constructor(public auth: AuthServiceService, private users: UserService, private skillsets: SkillsetService, private skills: SkillService) { }

  ngOnInit() {
    console.log("Component1 - ngOnInit", this.auth.getToken(), this.skillsets.skillsetlist, this.users );
    this.setactiveskill(0);
    this.setactiveeduo(0);
  }

  public setactiveskillset(i: number): void {
    if(i!=this.skillsetindex) {
      console.log("set skillsetindex", i);
      this.skillsetindex = i;
      
      this.setactiveskill(0);
      this.setactiveeduo(0);
    }
  }
  public setactiveskill(i: number): void {
    if(i!=this.skillindex||i==0) {
      console.log("set skillindex", this.skillindex, i)
      this.skillindex = i;
      
//      console.log(this.skillsets.skillsetlist[this.skillsetindex].skillref[this.skillindex].id);
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
  public filter():void {
    console.log("filter", this.skillsetfilter);
  }
  public doFilter(i: number): boolean {
    var result: boolean = false;
    var str1 = this.skillsets.skillsetlist[i].name;
    var index1 = str1.indexOf( this.skillsetfilter ); 
    var str2 = this.skillsets.skillsetlist[i].description;
    var index2 = str2.indexOf( this.skillsetfilter ); 
    if(this.skillsetfilter=="") {
      result = true;
    }
    if(index1>0) {
      result = true;
    }
    if(index2>0) {
      result = true;
    }

//    console.log("doFilter", i, this.skillsetfilter, index1, index2, result);

    return result;
  }
}