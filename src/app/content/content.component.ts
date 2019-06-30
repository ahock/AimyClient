import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContentService } from '../content/content.service';
import { UserService } from '../user/user.service';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styles: []
})
export class ContentComponent implements OnInit {
  private contentid: string;

  constructor(private route:ActivatedRoute, private contents: ContentService, private users:UserService) {
    this.route.params.subscribe( params => {
      console.log("Content Param: ", params)
      this.contentid = params.id;
      this.contents.getContent(this.contentid);
    })    
  }

  ngOnInit() {
  }

  public getLogoUrl(type: string): string {
    var url = "";
    console.log("Type:",type);
    switch(type) {
      case "1":
        console.log("1");
        url = "/assets/YouTube_logo_2017.png";
        break;
      case '2':
        url = "/assets/tutorial.png";
        break;
      case '3':
        url = "/assets/YouTube_logo_2017.png";
        break;
      case '4':
        console.log("4");
        url = "/assets/YouTube_logo_2017.png";
        break;
      case '5':
        url = "/assets/YouTube_logo_2017.png";
        break;
      case '6':
        url = "/assets/YouTube_logo_2017.png";
        break;
      case '7':
        url = "/assets/book.png";
        break;
      case '8':
        url = "/assets/YouTube_logo_2017.png";
        break;
      case '9':
        url = "/assets/YouTube_logo_2017.png";
        break;
      default:
        url = "/assets/nomedia.png";
    }
    return url;
  }
}
