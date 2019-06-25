import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule }   from '@angular/forms';

import { AlertModule, ButtonsModule, BsDatepickerModule, BsDropdownModule, CarouselModule } from 'ngx-bootstrap';

import { AppRoutingModule, routingComponents } from './app-routing.module';
import { AppComponent } from './app.component';

import { AuthServiceService } from './auth-service/auth-service.service';
import { UserService } from './user/user.service';
import { UsersService } from './users/users.service';
import { CompetenceComponent } from './competence/competence.component';
import { StatusComponent } from './status/status.component';
import { RegistrationComponent } from './registration/registration.component';
import { DialogComponent } from './dialog/dialog.component';
import { UsersComponent } from './users/users.component';
import { SkillComponent } from './skill/skill.component';
import { AssignmentComponent } from './assignment/assignment.component';
import { EduobjectiveComponent } from './eduobjective/eduobjective.component';
import { PlaylistComponent } from './playlist/playlist.component';
import { ContentComponent } from './content/content.component';

@NgModule({
  declarations: [
    AppComponent,
    routingComponents,
    CompetenceComponent,
    StatusComponent,
    RegistrationComponent,
    DialogComponent,
    UsersComponent,
    SkillComponent,
    AssignmentComponent,
    EduobjectiveComponent,
    PlaylistComponent,
    ContentComponent
  ],
  imports: [
    AlertModule.forRoot(),
    ButtonsModule.forRoot(),
    BsDatepickerModule.forRoot(),
    BsDropdownModule.forRoot(),
    CarouselModule.forRoot(),
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [
    AuthServiceService,
    UserService,
    UsersService
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
