import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { UbsAdminNotificationEditFormComponent } from './ubs-admin-notification-edit-form.component';

describe('UbsAdminNotificationEditFormComponent', () => {
  let component: UbsAdminNotificationEditFormComponent;
  let fixture: ComponentFixture<UbsAdminNotificationEditFormComponent>;

  const matDialogRefMock = jasmine.createSpyObj('matDialogRefMock', ['close']);

  const mockedData = {
    topic: { en: '', ua: '' },
    text: { en: '', ua: '' }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UbsAdminNotificationEditFormComponent],
      providers: [FormBuilder, { provide: MAT_DIALOG_DATA, useValue: mockedData }, { provide: MatDialogRef, useValue: matDialogRefMock }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsAdminNotificationEditFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
