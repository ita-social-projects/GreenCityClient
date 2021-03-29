import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { HabitsPopupComponent } from './habits-popup.component';

describe('HabitsPopupComponent', () => {
  let component: HabitsPopupComponent;
  let fixture: ComponentFixture<HabitsPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HabitsPopupComponent],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} }]
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
