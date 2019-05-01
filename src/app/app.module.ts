import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule }   from '@angular/forms';

import { AlertModule, ButtonsModule, BsDatepickerModule, BsDropdownModule, CarouselModule } from 'ngx-bootstrap';

import { AppRoutingModule, routingComponents } from './app-routing.module';
import { AppComponent } from './app.component';

import { AuthServiceService } from './auth-service/auth-service.service';
import { UserService } from './user/user.service';
import { CompetenceComponent } from './competence/competence.component';
import { StatusComponent } from './status/status.component';
import { RegistrationComponent } from './registration/registration.component';

@NgModule({
  declarations: [
    AppComponent,
    routingComponents,
    CompetenceComponent,
    StatusComponent,
    RegistrationComponent
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
    UserService
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
