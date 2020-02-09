import { Component, OnInit } from '@angular/core';
// import { Time } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule }   from '@angular/forms';

import { FormGroup, FormControl } from '@angular/forms';

import { AssignmentService, Assignment } from '../assignment/assignment.service';
import { ChallengeService } from '../challenge/challenge.service';
import { UserService } from '../user/user.service';
import { LogService, Log } from '../log/log.service';

@Component({
  selector: 'app-assignment',
  templateUrl: './assignment.component.html',
  styles: []
})
export class AssignmentComponent implements OnInit {
  
  private assignmentid: string;
  private mode: number = 0;//0: show details, 1: run assignment

  private physically: string;
  private mental: string;
  private preparation: string;
  
  public showHint: number = -1;
  public showWarning: boolean = false;
  private markerlist: boolean[];
  private answerlist: string[] = [];
  private challengeid;
  private elem;
  private starttime: Date;
  private elapsedtime: Date;
  private intervalID;

  preparatoryForm = new FormGroup({
      physically: new FormControl('noinfo'),
      mental: new FormControl('noinfo'),
      preparation: new FormControl('noinfo')
    });
  
  answers = new FormGroup({
    answer: new FormControl('')
  });

  //Array of answers to control the assignment forms
  private formAnswers;

  constructor(private route:ActivatedRoute, private aservice: AssignmentService, private challenges: ChallengeService, private router:Router, private users:UserService, private log:LogService) {
    this.route.params.subscribe( params => {
      console.log("Param: ", params, this.assignmentid)
      this.assignmentid = params.id
      this.aservice.getAssignmentById(this.assignmentid);
    })
  }

  ngOnInit() {
    this.elem = this;
    
//    (event) => {
//       event.preventDefault();
//       event.returnValue = "Unsaved modifications";
//      alert("Du darfst den Browser nicht verlassen");
//       return event;
//    });

    this.aservice.getAssignmentById(this.assignmentid);
  }

  public leaveAssignment(): void {
    alert("Du darfst den Browser nicht verlassen");
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
    console.log("Run Assignment", this.users.getUserToken(), this.assignmentid, this.aservice.assignment);
//    window.addEventListener("blur", this.leaveAssignment);
    // Log the start of the assignment
    this.log.createLog(<Log>{token: this.users.getUserToken(), message: "Assignment startet", type: 2, area: "assignment", content: "Assignment "+this.assignmentid+" startet"});
    // For Masteries the self assessment questions always will be shown.
    if( this.aservice.assignment.type == "Mastery") {
      this.showWarning = true;
    }
    this.challenges.loadChallenges(this.aservice.assignment.challenges);
    this.challengeid = 0;
    this.mode = 1;
    this.markerlist = [];
    this.starttime = new Date;
    
    //Initiate the form control and answer list for all challenges in the assignment
    console.log("# Challenges: ", this.aservice.assignment.challenges.length);
//    console.log("FormGroup", this.answers);
    if(!this.answerlist||this.answerlist.length==0) {
      for(var i=0;i<this.aservice.assignment.challenges.length;i++) {
        this.answerlist.push("");
      }
    }
    console.log("answerlist:", this.answerlist);

/*    
    this.formAnswers[0] = new FormControl('2');
    for(var fc=1;fc<this.aservice.assignment.challenges.length;fc++){
        this.formAnswers.push(new FormControl(fc.toString));
    }
    console.log("FormControlArray", this.formAnswers);
*/
    
//    answers = new FormGroup({
//    answer: new FormControl('')

    // Start the time for this assignment
    this.intervalID = setInterval( () => {
      this.elapsedtime =  new Date((new Date).getTime() - this.starttime.getTime());

      console.log("Zeit abgelaufen:", this.elapsedtime.getHours()-1, this.elapsedtime.getMinutes(), this.elapsedtime.getSeconds());
    } , 10000);
  }
  
  public startAfterPreparatoryQuestions() {
    console.log("function startAfterPreparatoryQuestions");
    //Hide Preparatory Questions
    this.showWarning = false;
    // Save answers to preparatory questions
//    console.log(this.users.activeuser.assignmentrefs.length, this.assignmentid, JSON.stringify(this.preparatoryForm.value));
    
//    console.log(JSON.stringify(this.preparatoryForm.value));
    
    this.users.setAssignmentPreparatoryAnswers(this.assignmentid,this.preparatoryForm.value);
    
  }
  
  public getElapsedTimeString() {
    var elapsedTimeString: string;
    if(this.elapsedtime) {
      elapsedTimeString = "0" + (this.elapsedtime.getHours()-1) +":"+ "0" + this.elapsedtime.getMinutes() +":"+ "0" + this.elapsedtime.getSeconds();  
    }
    else {
      elapsedTimeString = "00:00:00";
    }
    return elapsedTimeString;
  }
    
  public nextChallenge() {
    // Go to next, if not at the last challenge
    if(this.challengeid < this.challenges.challenges.length-1) {
      //Bevor leaving the current challenge
      console.log("value", this.answers.value);
      this.answerlist[this.challengeid] = this.answers.value.answer;
      console.log("answerlist", this.answerlist);
      this.challengeid += 1; 
      //Bevor rendering the next challenge
      this.answers.setValue({'answer': this.answerlist[this.challengeid]});
      
    }
  }
  public prevChallenge() {
    if(this.challengeid > 0) {
      //Bevor leaving the current challenge
      console.log("value", this.answers.value);
      this.answerlist[this.challengeid] = this.answers.value.answer;
      console.log("answerlist", this.answerlist);
      this.challengeid -= 1;
      //Bevor rendering the next challenge
      this.answers.setValue({'answer': this.answerlist[this.challengeid]});
    }
  }
  
  public cancleAssignment(): void {
    this.mode = 0;
    window.removeEventListener("blur", this.leaveAssignment);
    clearInterval(this.intervalID);
    this.log.createLog(<Log>{token: this.users.getUserToken(), message: "Assignment cancled", type: 2, area: "assignment", content: "Assignment "+this.assignmentid+" cancled"});
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
    console.log("answerChallenge, type:", id, this.challenges.challenges[id].type[0]);
    
    // Create answerlist with appropriate number of fields
    if(!this.answerlist||this.answerlist.length==0) {
      for(var i=0;i<this.challenges.challenges.length;i++) {
        this.answerlist.push("");
      }
    }

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
  
  public onTest() {
    console.log(JSON.stringify(this.preparatoryForm.value));
  }
  
}