import { Component, OnInit } from '@angular/core';
import { UsersService } from './users.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styles: []
})
export class UsersComponent implements OnInit {

  constructor(public users:UsersService) { }

  ngOnInit() {
  }

  public selectUser(obj: any) {
    console.log("selectUser", this, obj);
    this.users.selectUserByIndex(obj);
  }
}