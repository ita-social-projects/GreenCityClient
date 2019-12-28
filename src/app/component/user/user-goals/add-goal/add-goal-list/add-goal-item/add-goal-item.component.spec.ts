import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddGoalItemComponent } from './add-goal-item.component';

describe('AddGoalItemComponent', () => {
  let component: AddGoalItemComponent;
  let fixture: ComponentFixture<AddGoalItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddGoalItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddGoalItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
