import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';

import { ErrorComponent } from './error.component';

describe('ErrorComponent', () => {
  let component: ErrorComponent;
  let fixture: ComponentFixture<ErrorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ErrorComponent],
      providers: [{ provide: MatDialogRef, useValue: { close: () => {} } }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call closePopup', () => {
    // @ts-ignore
    const spy = spyOn(component.matDialogRef, 'close');
    component.closePopup();
    expect(spy).toHaveBeenCalled();
  });
});
