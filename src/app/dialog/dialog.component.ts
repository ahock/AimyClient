import { Component, OnInit } from '@angular/core';
import { UserService } from '../user/user.service';
import { DialogService } from '../dialog/dialog.service';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styles: []
})
export class DialogComponent implements OnInit {
  public dialog_index: number = 0;
  public reaction_text: string = "";

  constructor(public user:UserService, public dialogs:DialogService) { }

  ngOnInit() {
    console.log("Dialog ngOnInit", this.user.getUserToken(), this.user);
    if(this.user.getUserToken()!="") {
      // DialogService
      this.dialogs.loadByToken(this.user.getUserToken());
    }
  }
  
  public react(id:string, reaction:number): void {
    console.log("dialog react", id, reaction, this.reaction_text);
    this.dialogs.addReaction(id, reaction, this.reaction_text);
  }
}
