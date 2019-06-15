import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EduobjectiveService } from '../eduobjective/eduobjective.service';

@Component({
  selector: 'app-eduobjective',
  templateUrl: './eduobjective.component.html',
  styles: []
})
export class EduobjectiveComponent implements OnInit {
  private eduobjectiveid: string;

  constructor(private route:ActivatedRoute, private eduobjective: EduobjectiveService) {
    this.route.params.subscribe( params => {
      console.log("Param: ", params)
      this.eduobjectiveid = params.id;
      this.eduobjective.getEduObjectives(this.eduobjectiveid);
    })
  }

  ngOnInit() {
  }



}
