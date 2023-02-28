import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmDialogMainComponent } from './confirm-dialog-main.component';

describe('ConfirmDialogMainComponent', () => {
  let component: ConfirmDialogMainComponent;
  let fixture: ComponentFixture<ConfirmDialogMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ConfirmDialogMainComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmDialogMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
