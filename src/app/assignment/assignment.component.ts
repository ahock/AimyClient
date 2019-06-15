import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AssignmentService, Assignment } from '../assignment/assignment.service';
import { ChallengeService } from '../challenge/challenge.service';

@Component({
  selector: 'app-assignment',
  templateUrl: './assignment.component.html',
  styles: []
})
export class AssignmentComponent implements OnInit {
  private assignmentid: string;
  private mode: number = 0;//0: show details, 1: run assignment
  public showHint: number = -1;
  public showWarning: boolean = true;

  constructor(private route:ActivatedRoute, private aservice: AssignmentService, private challenges: ChallengeService, private router:Router) {
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
    this.challenges.loadChallenges(this.aservice.assignment.challenges);
    this.mode = 1;
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
  public finishAssignment(): void {
    this.mode = 5;
  }
  public closeAssignment(): void {
    this.mode = 0;
    this.router.navigate(["/"]);
  }
  public selectEduObjective(id: string): void {
    console.log("selectEduObjective", id);
  }
}
