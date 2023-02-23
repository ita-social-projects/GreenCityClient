import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HabitsWidgetComponent } from './habits-widget.component';

describe('HabitsWidgetComponent', () => {
  let component: HabitsWidgetComponent;
  let fixture: ComponentFixture<HabitsWidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HabitsWidgetComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HabitsWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
