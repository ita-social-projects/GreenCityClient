import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewHabit2Component } from './add-new-habit2.component';

describe('AddNewHabit2Component', () => {
  let component: AddNewHabit2Component;
  let fixture: ComponentFixture<AddNewHabit2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddNewHabit2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewHabit2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
