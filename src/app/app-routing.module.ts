import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Component1Component } from './component1/component1.component';
import { Component2Component } from './component2/component2.component';
import { CompetenceComponent } from './competence/competence.component';
import { RegistrationComponent } from './registration/registration.component';
import { DialogComponent } from './dialog/dialog.component';
import { AssignmentComponent } from './assignment/assignment.component';
import { EduobjectiveComponent } from './eduobjective/eduobjective.component';
import { SkillComponent } from './skill/skill.component';
import { PlaylistComponent } from './playlist/playlist.component';
import { ContentComponent } from './content/content.component';
import { PromoteComponent } from './promote/promote.component';

const routes: Routes = [
//  {path: '', pathMatch: 'full', redirectTo: 'contacts'}  
//  {path: '', component: AppComponent},
  {path: 'comp1', component: Component1Component},
  {path: 'comp2', component: Component2Component},
  {path: 'competence', component: CompetenceComponent},
  {path: 'registration', component: RegistrationComponent},
  {path: 'dialog', component: DialogComponent},
  {path: 'assignment/:id', component: AssignmentComponent},
  {path: 'eduobjective/:id', component: EduobjectiveComponent},
  {path: 'skill/:id', component: SkillComponent},
  {path: 'skillboard/:id', component: Component1Component},
  {path: 'playlist', component: PlaylistComponent},
  {path: 'content/:id', component: ContentComponent},
  {path: 'promote', component: PromoteComponent},
  {path: 'promote/:id', component: PromoteComponent}
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents = [
  Component1Component, 
  Component2Component, 
  CompetenceComponent, 
  RegistrationComponent,
  DialogComponent,
  AssignmentComponent
]