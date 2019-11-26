import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HabitItemListComponent } from './habit-item-list.component';

describe('HabitItemListDemoComponent', () => {
  let component: HabitItemListComponent;
  let fixture: ComponentFixture<HabitItemListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HabitItemListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HabitItemListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
