import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AssignmentService, Assignment } from '../assignment/assignment.service';

@Component({
  selector: 'app-assignment',
  templateUrl: './assignment.component.html',
  styles: []
})
export class AssignmentComponent implements OnInit {
  private assignmentid: string;

  constructor(private route:ActivatedRoute, private aservice: AssignmentService) {
    this.route.params.subscribe( params => {
      console.log("Param: ", params, this.assignmentid)
      this.assignmentid = params.id
      this.aservice.getAssignmentById(this.assignmentid);
    })
  }

  ngOnInit() {
    this.aservice.getAssignmentById(this.assignmentid);
  }
}
