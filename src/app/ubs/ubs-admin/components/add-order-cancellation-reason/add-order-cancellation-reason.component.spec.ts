import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AddOrderCancellationReasonComponent } from './add-order-cancellation-reason.component';
import { TranslateModule } from '@ngx-translate/core';
import { Component, OnInit } from '@angular/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';

describe('AddOrderCancellationReasonComponent', () => {
  let component: AddOrderCancellationReasonComponent;
  let fixture: ComponentFixture<AddOrderCancellationReasonComponent>;

  let localStorageServiceMock = jasmine.createSpyObj('localeStorageService', ['getCurrentLanguage']);
  const matDialogRefStub = jasmine.createSpyObj('matDialogRefStub', ['close']);
  matDialogRefStub.close = () => 'Close window please';
  const viewModeInputs = {
    id: 1577
  };
  const DataMock = {
    cancellationComment: 'cancellationComment'
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddOrderCancellationReasonComponent],
      imports: [MatDialogModule, FormsModule, TranslateModule.forRoot(), MatSelectModule, MatRadioModule, ReactiveFormsModule],
      providers: [
        { provide: MatDialogRef, useValue: matDialogRefStub },
        { provide: MAT_DIALOG_DATA, useValue: viewModeInputs }
      ]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddOrderCancellationReasonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('makes expected call initForm', () => {
    const spy = spyOn(component, 'initForm');
    component.ngOnInit();
    expect(component.commentForm.value).toEqual({ cancellationComment: '' });
    expect(spy).toHaveBeenCalled();
  });

  it('commentForm invalid when empty', () => {
    expect(component.commentForm.valid).toBeFalsy();
  });

  it('pop up should close', () => {
    const spy = spyOn(component.dialogRef, 'close');
    component.close();

    expect(spy).toHaveBeenCalled();
  });
});
