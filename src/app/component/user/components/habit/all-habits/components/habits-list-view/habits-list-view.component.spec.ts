import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HabitsListViewComponent } from './habits-list-view.component';

describe('HabitsListViewComponent', () => {
  let component: HabitsListViewComponent;
  let fixture: ComponentFixture<HabitsListViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HabitsListViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HabitsListViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
