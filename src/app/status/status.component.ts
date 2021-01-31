import { Component, OnInit } from '@angular/core';
import { StatusService } from './status.service';
import { APP_CONFIG } from '../app-variables';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.css']
})
export class StatusComponent implements OnInit {
  private version: string = APP_CONFIG.version;
  private releaseComment: string = APP_CONFIG.releaseComment;
  
  constructor(public status: StatusService) { }

  ngOnInit() {
  }


}
