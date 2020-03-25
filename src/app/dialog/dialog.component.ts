import { Component, OnInit } from '@angular/core';
import { UserService } from '../user/user.service';
import { DialogService } from '../dialog/dialog.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styles: []
})
export class DialogComponent implements OnInit {
  public dialog_index: number = 0;
  public reaction_text: string = "";

  constructor(public user:UserService, public dialogs:DialogService, private router: Router) { }

  ngOnInit() {
    console.log("Dialog ngOnInit Token", this.user.getUserToken());
    console.log("Dialog ngOnInit UserService", this.user);
    
    this.user.loadUserData( () => {
      this.dialogs.loadByToken(this.user.getUserToken());
      console.log("Dialogs#:", this.dialog_index);
    });
  }
  
  public react(id:string, reaction:number): void {
    console.log("dialog react", id, reaction, this.reaction_text);
    this.dialogs.addReaction(id, reaction, this.reaction_text);

    this.dialogs.getActiveDialogCount(this.user.getUserToken(), (count: number) => {
      if(count == 0) {
        this.router.navigate(['/']);
      } else {
        this.router.navigate(['/dialog']);
      }
    });
  }
}
