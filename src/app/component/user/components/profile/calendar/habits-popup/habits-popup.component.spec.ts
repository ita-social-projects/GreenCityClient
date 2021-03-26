import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HabitsPopupComponent } from './habits-popup.component';

describe('HabitsPopupComponent', () => {
  let component: HabitsPopupComponent;
  let fixture: ComponentFixture<HabitsPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HabitsPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HabitsPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
