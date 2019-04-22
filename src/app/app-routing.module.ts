import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Component1Component } from './component1/component1.component';
import { Component2Component } from './component2/component2.component';
import { CompetenceComponent } from './competence/competence.component';
import { RegistrationComponent } from './registration/registration.component';

const routes: Routes = [
  {path: 'comp1', component: Component1Component},
  {path: 'comp2', component: Component2Component},
  {path: 'competence', component: CompetenceComponent},
  {path: 'registration', component: RegistrationComponent},
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents = [Component1Component, Component2Component, CompetenceComponent, RegistrationComponent]