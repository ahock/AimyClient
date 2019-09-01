import { Component, OnInit } from '@angular/core';
// import { Time } from '@angular/common';
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
  private challengeid;
  private elem;
  private starttime: Date;
  private elapsedtime: Date;
  private intervalID;

  constructor(private route:ActivatedRoute, private aservice: AssignmentService, private challenges: ChallengeService, private router:Router, private users:UserService) {
    this.route.params.subscribe( params => {
      console.log("Param: ", params, this.assignmentid)
      this.assignmentid = params.id
      this.aservice.getAssignmentById(this.assignmentid);
    })
  }

  ngOnInit() {
    this.elem = this;
    window.addEventListener("blur", (event) => {
//       event.preventDefault();
//       event.returnValue = "Unsaved modifications";
      alert("Du darfst den Browser nicht verlassen");
       return event;
    });
    
    
    this.aservice.getAssignmentById(this.assignmentid);
  }
  
  openFullscreen() {
    if (this.elem.requestFullscreen) {
      this.elem.requestFullscreen();
    } else if (this.elem.mozRequestFullScreen) {
      /* Firefox */
      this.elem.mozRequestFullScreen();
    } else if (this.elem.webkitRequestFullscreen) {
      /* Chrome, Safari and Opera */
      this.elem.webkitRequestFullscreen();
    } else if (this.elem.msRequestFullscreen) {
      /* IE/Edge */
      this.elem.msRequestFullscreen();
    }
  }

  /* Close fullscreen */
  closeFullscreen() {
// https://stackoverflow.com/questions/51998594/how-to-make-google-chrome-go-full-screen-in-angular-4-application
  }  
  
  public runAssignment(): void {
    console.log("Run Assignment", this.assignmentid, this.aservice.assignment);
    if( this.aservice.assignment.type == "Mastery") {
      this.showWarning = true;
    }
    this.challenges.loadChallenges(this.aservice.assignment.challenges);
    this.challengeid = 0;
    this.mode = 1;
    this.markerlist = [];
    this.starttime = new Date;
    
    this.intervalID = setInterval( () => {
      this.elapsedtime = new Date;
      console.log("Zeit", this.starttime, this.elapsedtime);
    } , 10000);
    
  }
  public nextChallenge() {
    if(this.challengeid < this.challenges.challenges.length-1) {
      this.challengeid += 1; 
    }
  }
  public prevChallenge() {
    if(this.challengeid > 0) {
      this.challengeid -= 1;
    }
  }
  
  public cancleAssignment(): void {
    this.mode = 0;
    clearInterval(this.intervalID);
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
    clearInterval(this.intervalID);
    this.mode = 5;
  }
  public closeAssignment(): void {
    clearInterval(this.intervalID);
    this.mode = 0;
    this.router.navigate(["/"]);
  }
  public selectEduObjective(id: string): void {
    console.log("selectEduObjective", id);
    this.router.navigate(['/eduobjective/'+id]);
  }
}
