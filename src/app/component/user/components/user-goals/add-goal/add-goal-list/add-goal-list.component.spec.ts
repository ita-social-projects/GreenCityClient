import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddGoalListComponent } from './add-goal-list.component';

describe('AddGoalListComponent', () => {
  let component: AddGoalListComponent;
  let fixture: ComponentFixture<AddGoalListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddGoalListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddGoalListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
