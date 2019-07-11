import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AssignmentService, Assignment } from '../assignment/assignment.service';
import { ChallengeService } from '../challenge/challenge.service';
import { UserService } from '../user/user.service';

@Component({
  selector: 'app-assignment',
  templateUrl: './assignment.component.html',
  styles: []
})
export class AssignmentComponent implements OnInit {
  private assignmentid: string;
  private mode: number = 0;//0: show details, 1: run assignment
  public showHint: number = -1;
  public showWarning: boolean = false;
  private markerlist: boolean[];
  private answerlist: string[] = [];

  constructor(private route:ActivatedRoute, private aservice: AssignmentService, private challenges: ChallengeService, private router:Router, private users:UserService) {
    this.route.params.subscribe( params => {
      console.log("Param: ", params, this.assignmentid)
      this.assignmentid = params.id
      this.aservice.getAssignmentById(this.assignmentid);
    })
  }

  ngOnInit() {
    this.aservice.getAssignmentById(this.assignmentid);
  }
  public runAssignment(): void {
    console.log("Run Assignment", this.assignmentid, this.aservice.assignment);
    if( this.aservice.assignment.type == "Mastery") {
      this.showWarning = true;
    }
    this.challenges.loadChallenges(this.aservice.assignment.challenges);
    this.mode = 1;
    this.markerlist = [];
    
  }
  public cancleAssignment(): void {
    this.mode = 0;
  }
  public toggleHint(event: MouseEvent, id: number) {
    console.log("Toggle Hint:", event.currentTarget, id);
    if(this.showHint == id) {
      this.showHint = -1;
    }
    else {
      this.showHint = id;
    }
  }
  public markChallenge(id: number):void {
    console.log("markChallenge:", id);
    
    if(!this.markerlist||this.markerlist.length==0) {
      console.log("markerlist init");
      for(var i=0;i<this.challenges.challenges.length;i++) {
        this.markerlist.push(false);
      }
    }
    this.markerlist[id] = !this.markerlist[id];
      
    console.log("markerlist", this.markerlist);
  }
  public answerChallenge(id: number, ans: number):void {
    console.log("answerChallenge:", id);
    
    if(!this.answerlist||this.answerlist.length==0) {
      for(var i=0;i<this.challenges.challenges.length;i++) {
        this.answerlist.push("");
      }
    }
    console.log("type", this.challenges.challenges[id].type[0] );
    switch(this.challenges.challenges[id].type[0]) {
      case 'multi':
        var pos: number;
        pos = this.answerlist[id].split(",").indexOf(ans.toString());
        if( pos>=0 ){
          // reset answer
          var temp: string[];
          temp = this.answerlist[id].split(",");
          temp.splice(pos, 1);
          this.answerlist[id] = temp.join(",");
//          console.log("reset", ans, pos, this.answerlist[id], temp);
        } else {
          // set answer
          if(this.answerlist[id]==""){
            this.answerlist[id] = ans.toString();
          } else {
            this.answerlist[id] = this.answerlist[id]+","+ans.toString(); 
          }
          this.answerlist[id] = this.answerlist[id].split(",").sort().join(",");
        } // end set answer
        break;
      case 'single':
        this.answerlist[id] = ans.toString();
        break;
    }
    console.log("answerlist", this.answerlist);
    
  }
  
  public finishAssignment(): void {
    this.mode = 5;
  }
  public closeAssignment(): void {
    this.mode = 0;
    this.router.navigate(["/"]);
  }
  public selectEduObjective(id: string): void {
    console.log("selectEduObjective", id);
    this.router.navigate(['/eduobjective/'+id]);
  }
}
