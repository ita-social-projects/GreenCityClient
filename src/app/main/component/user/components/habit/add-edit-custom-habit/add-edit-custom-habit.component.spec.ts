import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditCustomHabitComponent } from './add-edit-custom-habit.component';

describe('AddEditCustomHabitComponent', () => {
  let component: AddEditCustomHabitComponent;
  let fixture: ComponentFixture<AddEditCustomHabitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddEditCustomHabitComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditCustomHabitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
