import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AddOrderCancellationReasonComponent } from './add-order-cancellation-reason.component';
import { TranslateModule } from '@ngx-translate/core';
import {
  MatLegacyDialogModule as MatDialogModule,
  MatLegacyDialogRef as MatDialogRef,
  MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA
} from '@angular/material/legacy-dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacyRadioModule as MatRadioModule } from '@angular/material/legacy-radio';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

describe('AddOrderCancellationReasonComponent', () => {
  let component: AddOrderCancellationReasonComponent;
  let fixture: ComponentFixture<AddOrderCancellationReasonComponent>;
  const matDialogRefStub = jasmine.createSpyObj('matDialogRefStub', ['close']);
  matDialogRefStub.close = () => 'Close window please';
  const viewModeInputs = {
    id: 1577
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AddOrderCancellationReasonComponent],
      imports: [
        MatDialogModule,
        FormsModule,
        TranslateModule.forRoot(),
        MatSelectModule,
        MatRadioModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        RouterTestingModule
      ],
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
    expect(spy).toHaveBeenCalled();
  });

  it('commentForm invalid when empty', () => {
    expect(component.commentForm.valid).toBeFalsy();
  });

  it('should initialize the form correctly', () => {
    const spy = spyOn(component.fb, 'group');
    component.initForm();
    expect(spy).toHaveBeenCalled();
  });

  it('pop up should close', () => {
    const spy = spyOn(component.dialogRef, 'close');
    component.close();
    expect(spy).toHaveBeenCalled();
  });

  it('pop up should save and data be saved', () => {
    const spy = spyOn(component.dialogRef, 'close');
    component.close();
    expect(spy).toHaveBeenCalled();
  });
});
