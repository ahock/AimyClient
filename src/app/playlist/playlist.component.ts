import { Component, OnInit } from '@angular/core';
import { UserService } from '../user/user.service';
import { ContentService } from '../content/content.service';
import { SkillService } from '../skill/skill.service';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styles: []
})
export class PlaylistComponent implements OnInit {
  public contenttype: number = 1;
  private showdetails: boolean = false;
  private userskills: any;
  private selectedskill: string = "";
  private eduobjectives: any;
  private selectededuo: [any];
  private contentname: string = "";
  private contentdescription: string = "";
  private url: string = "";
  private contentlang: string = "de";

  constructor(private contents: ContentService, private users:UserService, private skills: SkillService) { }

  ngOnInit() {
  }

  public details(): void {
    console.log("Details");
    this.getUserSkills();
    this.showdetails = true;
  }
  
  public setContentType(type: number): void {
    this.contenttype = type;
    this.showdetails = false;
    console.log("Type: ", type);
  }
  public setSkill(event: any) {
//    console.log("Selected Skill: ", event);
    
    this.skills.getSkillC(event, () => {
      console.log("Callback Selected Skill: ", this.skills.skill);
      this.selectededuo = undefined;
      
        for(var i=0; i<this.skills.skill.eduobjectiveref.length; i++) {
//          console.log(this.skills.skill.eduobjectiveref[i]);
          if(!this.selectededuo) {
            this.selectededuo = [{name:this.skills.skill.eduobjectiveref[i].name,id:this.skills.skill.eduobjectiveref[i]._id,selected:true}];
          } else {
            this.selectededuo.push({name:this.skills.skill.eduobjectiveref[i].name,id:this.skills.skill.eduobjectiveref[i]._id,selected:true});  
          }
      }
      console.log("selectededuo", this.selectededuo);
    });
  }
  
  
  public saveContent(): void {
    console.log("saveContent");
    this.showdetails = false;

    console.log("Url:          ", this.url);
    console.log("Type:         ", this.contenttype);
    console.log("Name:         ", this.contentname);
    console.log("Description:  ", this.contentdescription);    
    console.log("Skill:        ", this.selectedskill);
    console.log("EduObjectives:", this.selectededuo);

    this.contents.addContent(this.contenttype.toString(), this.url, this.contentname, this.contentdescription, this.contentlang, (contentid) => {
      console.log("addContent", contentid)
      
      for(var i=0; i<this.selectededuo.length; i++) {
        if(this.selectededuo[i].selected) {
          console.log("EduO - Content", this.selectededuo[i].name, this.selectededuo[i].id, contentid);
        }
      }
      
    });
// ins callback

    
//    this.skills.linkeduo();
  }
  
  public getUserSkills(): void {
//    this.users.getUser().skillref
    
    this.userskills = [{name:this.users.getUser().lastname,id:this.users.getUserToken()},{name:'Kundentermin vor- und nachbereiten',id:'5cc491863af9f00acc95c435'},{name:'Innovation Execution meistern',id:'5d0dc645e7179a4e43282c41'}];
  }
  
  public getEduoForSkill(skillid: string): void {
    this.eduobjectives = [{},{}];
  }
}
