import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewHabitModalComponent } from './add-new-habit-modal.component';

describe('AddNewHabitModalComponent', () => {
  let component: AddNewHabitModalComponent;
  let fixture: ComponentFixture<AddNewHabitModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddNewHabitModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewHabitModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
