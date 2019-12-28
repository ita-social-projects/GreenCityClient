import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateGoalItemComponent } from './update-goal-item.component';

describe('UpdateGoalItemComponent', () => {
  let component: UpdateGoalItemComponent;
  let fixture: ComponentFixture<UpdateGoalItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateGoalItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateGoalItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
