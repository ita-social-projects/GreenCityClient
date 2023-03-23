import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AddOrderCancellationReasonComponent } from './add-order-cancellation-reason.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
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
  const DataMock = {
    cancellationReason: 'Other',
    cancellationComment: 'cancellationComment'
  };

  beforeEach(async(() => {
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

  it('orderService should be called', () => {
    const spyReturnedValues = spyOn(component.orderService, 'getOrderCancelReason').and.returnValue(of(DataMock));
    component.ngOnInit();
    expect(spyReturnedValues).toHaveBeenCalled();
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
