import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from '../auth-service/auth-service.service';

@Component({
  selector: 'app-component1',
  templateUrl: './component1.component.html',
  styles: []
})
export class Component1Component implements OnInit {

  constructor(public auth: AuthServiceService) { }

  ngOnInit() {
    console.log("Component1 - ngOnInit", this.auth.getToken() );
    
  }

}