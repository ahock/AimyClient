import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-component2',
  template: `
    <div class="row">
      <img src="assets/library.png">
    </div>
  `,
  styles: []
})
export class Component2Component implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
