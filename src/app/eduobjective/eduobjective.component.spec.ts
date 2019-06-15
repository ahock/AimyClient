import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EduobjectiveComponent } from './eduobjective.component';

describe('EduobjectiveComponent', () => {
  let component: EduobjectiveComponent;
  let fixture: ComponentFixture<EduobjectiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EduobjectiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EduobjectiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
