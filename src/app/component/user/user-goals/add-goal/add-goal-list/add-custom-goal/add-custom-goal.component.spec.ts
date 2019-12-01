import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCustomGoalComponent } from './add-custom-goal.component';

describe('AddCustomGoalComponent', () => {
  let component: AddCustomGoalComponent;
  let fixture: ComponentFixture<AddCustomGoalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCustomGoalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCustomGoalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
