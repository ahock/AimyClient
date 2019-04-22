import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from '../auth-service/auth-service.service';

@Component({
  selector: 'app-competence',
  templateUrl: './competence.component.html',
  styles: []
})
export class CompetenceComponent implements OnInit {

  constructor(public auth: AuthServiceService) { }

  ngOnInit() {
  }

}
