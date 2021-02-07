import { Component, OnInit } from '@angular/core';
// import { Time } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule }   from '@angular/forms';

import { FormGroup, FormControl } from '@angular/forms';
import { APP_CONFIG } from '../app-variables';
import { AssignmentService, Assignment } from '../assignment/assignment.service';
import { ChallengeService } from '../challenge/challenge.service';
import { UserService, AssignmentResult } from '../user/user.service';
import { LogService, Log } from '../log/log.service';

@Component({
  selector: 'app-assignment',
  templateUrl: './assignment.component.html',
  styles: []
})
export class AssignmentComponent implements OnInit {
  private appConfig: any = APP_CONFIG;
  
  private assignmentid: string;
  private mode: number = 0;//0: show details, 1: run assignment

  private physically: string;
  private mental: string;
  private preparation: string;
  
  public showHint: number = -1;
  public showWarning: boolean = false;
  private markerlist: boolean[];
  private answerlist: string[] = [];
  private eduoresult = [];
  private overallresult: number = 0;
  private challengeid;
  private elem ;
  private starttime: Date;
  private elapsedtime: Date;
  private intervalID;
  
  private assignmentOver: boolean = false; // indicates the end of the assignment
  
  private showChallengeResults: boolean = false;
  private showTotalResults: boolean = true;
  private showEduoResults: boolean = false;

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
      console.log("assignmentcomponent:constructor", this.assignmentid, this.users.isAssignmentOngoing(this.assignmentid));
    })
  }

  ngOnInit() {
    this.elem = this; //document.documentElement;
    
//    (event) => {
//       event.preventDefault();
//       event.returnValue = "Unsaved modifications";
//      alert("Du darfst den Browser nicht verlassen");
//       return event;
//    });

    this.aservice.getAssignmentById(this.assignmentid);
    
    console.log("assignmentcomponent:ngOnInit", this.assignmentid, this.users.isAssignmentOngoing(this.assignmentid));
    
  }

  public leaveAssignment(): void {
//    this.log.createLog(<Log>{token: this.users.getUserToken(), message: "Assignment left", type: 3, area: "assignment", content: "Assignment "+this.assignmentid+" left"});
    alert("Du darfst den Browser nicht verlassen");
    this.openFullscreen();
  }
  
  private openFullscreen() {
    console.log("openFullscreen");
    
    this.elem = document.documentElement;
    
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
  private closeFullscreen() {
// https://stackoverflow.com/questions/51998594/how-to-make-google-chrome-go-full-screen-in-angular-4-application
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }  
  
  public runAssignment(start: boolean): void {
    ////////////////////////////////////
    //
    // Start the assignment
    //
    ////////////////////////////////////
    var tempresult: AssignmentResult;
    
    console.log("Run Assignment", start, this.users.getUserToken(), this.assignmentid, this.aservice.assignment);

    if(start) {
      // run assignment from the beginning
      console.log("Start fresh");
      tempresult = undefined;
    } else {
      // continue assignment at a specific challenge
      tempresult = this.users.getTempResults(this.assignmentid);
      
      console.log("Continue", tempresult);
    }
    if(this.aservice.assignment.type=='MA') {
      this.openFullscreen();
      window.addEventListener("blur", this.leaveAssignment);
    }

    // Log the start of the assignment
    this.log.createLog(<Log>{token: this.users.getUserToken(), message:"Assignment startet", type:2, area:"assignment", scopeId:this.assignmentid, content:"Assignment "+this.assignmentid+" startet"});
    
    // For Masteries the self assessment questions always will be shown.
    if( this.aservice.assignment.type == "MA") {
      this.showWarning = true;
    }
    this.challenges.loadChallenges(this.aservice.assignment.challenges);
    
    if(start) {
      this.challengeid = 0;
      this.starttime = new Date;
      if(!this.answerlist||this.answerlist.length==0) {
        for(var i=0;i<this.aservice.assignment.challenges.length;i++) {
          this.answerlist.push("");
        }
      }
    } else {
      // continue assignment at a specific challenge, rightanswers is used to store the id of the aborted challange
      this.challengeid = tempresult.rightanswers;
      
      this.starttime = new Date;
      var setback = new Date(tempresult.elapsedtime);
      this.starttime = new Date(this.starttime.getTime() - setback.getTime());
      this.elapsedtime =  new Date(setback.getTime());

      // load temp ansers
      this.answerlist = [];
      for(var i=0;i<tempresult.result.length;i++) {
        this.answerlist.push(tempresult.result[i].ans);
        this.answers.setValue({'answer': tempresult.result[i].ans});
      }
//      console.log("answerlist:", this.answerlist);
//      console.log("FormGroup", this.answers);
    }
    this.mode = 1;
    this.markerlist = [];
    
    // Start the time for this assignment
    this.intervalID = setInterval( () => {
      this.elapsedtime =  new Date((new Date).getTime() - this.starttime.getTime());
      this.assignmentOver = this.isElapsed();
      console.log("Zeit abgelaufen:", this.elapsedtime.getHours()-1, this.elapsedtime.getMinutes(), this.elapsedtime.getSeconds());
      if(this.assignmentOver) {
        this.log.createLog(<Log>{token: this.users.getUserToken(), message:"Assignment time elapsed", type:3, area:"assignment", scopeId:this.assignmentid, content:"Assignment "+this.assignmentid+" elapsed"});
        this.finishAssignment();
      }
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
    var secondsString: string;
    var minutesString: string;

    if(this.elapsedtime) {
      secondsString = "0"+this.elapsedtime.getSeconds();
      minutesString = "0" + this.elapsedtime.getMinutes();
      elapsedTimeString = "0" + (this.elapsedtime.getHours()-1) +":"+ minutesString.substring(minutesString.length - 2, minutesString.length) +":"+ secondsString.substring(secondsString.length - 2, secondsString.length);
    }
    else {
      elapsedTimeString = "00:00:00";
    }
    return elapsedTimeString;
  }
  public isElapsed(): boolean {
//    console.log("Elapsed");
    
    console.log("Minutes", this.aservice.assignment.duration, this.elapsedtime.getMinutes());
    
//    console.log("Time", this.elapsedtime);

    if(this.elapsedtime.getMinutes() >= this.aservice.assignment.duration) {
      return true;
    } else {
      return false; 
    }
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
      
      /////////////////////////////////
      //
      // save temp result
      //
      /////////////////////////////////

      /*    
        export interface AssignmentResult {
          pass?: boolean;
          create_date: Date;
          elapsedtime?: Date;
          rightanswers?: number;
          questioncount?: number;
          eduobj?: any[];
          result?: any[];
        }  
      */    

      var assresult: AssignmentResult = {
        create_date: new Date(),
        elapsedtime: this.elapsedtime,
        // index of last challende
        rightanswers: this.challengeid,
        result: []
      };
      for(var i=0; i<this.challenges.challenges.length;i++) {
        assresult.result.push({id:this.challenges.challenges[i]._id,cor:this.challenges.challenges[i].correct[0],ans:this.answerlist[i]});
      }
      console.log("assignmentcomponent.setTempAssmentResult", assresult);
      this.users.setTempAssmentResult(this.users.getUserToken(), this.assignmentid, assresult,'TEMP');
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
    this.closeFullscreen();
    this.mode = 0;
    window.removeEventListener("blur", this.leaveAssignment);
    clearInterval(this.intervalID);
    this.log.createLog(<Log>{token: this.users.getUserToken(), message:"Assignment cancled", type:2, area:"assignment", scopeId:this.assignmentid, content:"Assignment "+this.assignmentid+" cancled"});
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
    ////////////////////////////////////
    //
    // Answer question
    //
    ////////////////////////////////////
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
  
  /////////////////////////////////
  //
  //  finishAssignment() 
  //
  /////////////////////////////////
  public finishAssignment(): void {
    this.eduoresult = [];

    window.removeEventListener("blur", this.leaveAssignment);
    clearInterval(this.intervalID); // Stop timer
    
//    console.log("answerlist", this.answerlist);
    console.log("assignment type", this.aservice.assignment.type);
    console.log("Challeng", this.showChallengeResults);
    console.log("Total", this.showTotalResults);
    console.log("EduO", this.showEduoResults);
    
    switch (this.aservice.assignment.type) {
      case 'PK':
        this.showChallengeResults = true;
        this.showTotalResults = true;
        this.showEduoResults = true;
        break;
      case 'SA':
        this.showChallengeResults = true;
        this.showTotalResults = true;
        this.showEduoResults = true;
        break;
      case 'MA':
        this.showChallengeResults = false;
        this.showTotalResults = true;
        this.showEduoResults = false;
        break;
      default:
        this.showChallengeResults = true;
        this.showTotalResults = true;
        this.showEduoResults = true;
    }

    // Save last answer to answerlist
    this.answerlist[this.challengeid] = this.answers.value.answer;
    this.answers.setValue({'answer': this.answerlist[this.challengeid]});
    console.log("answerlist complete:", this.challengeid, this.answerlist);

    this.log.createLog(<Log>{token: this.users.getUserToken(), message:"Assignment finished", type:2, area:"assignment", scopeId:this.assignmentid, content:"Assignment "+this.assignmentid+" finished"});

    // Calculate right and wrong answers by educational objective  
    for(var i=0; i<this.aservice.assignment.eduobjref.length ;i++) {
      // For all edu objectives of the assignment
      this.eduoresult.push({
        id: "" + (i + 1),
//        name: "",
        count: 0,
        countok: 0
      });
//      console.log("asses eduobjective", this.aservice.assignment.eduobjref[i].name, this.eduoresult[i]);
//      this.eduoresult[i].name = this.aservice.assignment.eduobjref[i].name;
      this.eduoresult[i].id = this.aservice.assignment.eduobjref[i].id;
      for(var j=0; j<this.challenges.challenges.length;j++) {
//        console.log("challenge", j, this.challenges.challenges[j].name);

        for(var k=0; k<this.challenges.challenges[j].eduobjectives.length;k++) {
//          console.log("eduoids:",this.aservice.assignment.eduobjref[i].id, this.challenges.challenges[j].eduobjectives[k].id)
          if(this.aservice.assignment.eduobjref[i].id == this.challenges.challenges[j].eduobjectives[k].id) {
            this.eduoresult[i].count++;
//            console.log("+", j, this.challenges.challenges[j].eduobjectives[k].name, this.challenges.challenges[j].correct[0], this.answerlist[j]);
            if(this.challenges.challenges[j].correct[0] == this.answerlist[j]) {
              this.eduoresult[i].countok++;
            }
          }
        }        
      }
    }
    console.log("eduoresult", this.eduoresult);
    
    // Calculate overall result
    this.overallresult = 0;
    for(var j=0; j<this.challenges.challenges.length;j++) {
      if(this.challenges.challenges[j].correct[0] == this.answerlist[j]) {
        this.overallresult++;
      }
    }
    console.log("overallresult", this.overallresult, this.challenges.challenges.length);
    console.log("max/pass", this.aservice.assignment.unitmax, this.aservice.assignment.unitpass);
    console.log("Zeit benötigt", this.elapsedtime);
    
    // Display the results page
    this.mode = 5;
  }

  /////////////////////////////////
  //
  //  closeAssignment() 
  //
  /////////////////////////////////
  public closeAssignment(): void {
    this.closeFullscreen();
    
    // Save results to user
    var assresult: AssignmentResult = { create_date: new Date() };
    
    if(this.overallresult>=this.aservice.assignment.unitpass) {
      assresult.pass = true; 
    } else {
      assresult.pass = false;
    }
    
    assresult.elapsedtime = this.elapsedtime;
    assresult.rightanswers = this.overallresult;
    assresult.questioncount = this.challenges.challenges.length;
    assresult.eduobj = this.eduoresult;
    assresult.result = [];
    for(var i=0; i<this.challenges.challenges.length;i++) {
      console.log(`${this.aservice.assignment.challenges[i]}: ${this.challenges.challenges[i].correct[0]} - ${this.answerlist[i]}`);
      assresult.result.push({id:this.challenges.challenges[i]._id,cor:this.challenges.challenges[i].correct[0],ans:this.answerlist[i]});
    }
    console.log("Save assignment results", assresult);

    this.users.setAssmentResult(this.users.getUserToken(), this.assignmentid, assresult,this.aservice.assignment.type);
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