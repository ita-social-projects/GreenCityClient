import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { EmployeeFormComponent } from './employee-form.component';

describe('EmployeeFormComponent', () => {
  let component: EmployeeFormComponent;
  let fixture: ComponentFixture<EmployeeFormComponent>;
  const matDialogRefMock = jasmine.createSpyObj('matDialogRefMock', ['close']);
  const mockedEmployeePositions = {
    id: 2,
    name: 'fake'
  };
  const mockedReceivingStations = {
    id: 3,
    name: 'fake'
  };
  const mockedData = {
    email: 'fake',
    employeePositions: [mockedEmployeePositions],
    firstName: 'fake',
    id: 1,
    image: 'fake',
    lastName: 'fake',
    phoneNumber: 'fake',
    receivingStations: [mockedReceivingStations]
  };
  const mockedDto = 'employeeDto';

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeeFormComponent],
      imports: [HttpClientTestingModule, MatDialogModule, TranslateModule.forRoot()],
      providers: [{ provide: MatDialogRef, useValue: matDialogRefMock }, { provide: MAT_DIALOG_DATA, useValue: mockedData }, FormBuilder]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('employeeForm should receive data from MAT_DIALOG_DATA', () => {
    expect(component.employeeForm.value).toEqual({
      firstName: 'fake',
      lastName: 'fake',
      phoneNumber: 'fake',
      email: 'fake'
    });
  });

  it('Returned formData should have employeeDto', () => {
    component.selectedFile = false;
    const returnedFormData = component.prepareEmployeeDataToSend(mockedDto);
    expect(returnedFormData.has('employeeDto')).toBe(true);
  });

  it('Returned formData should have image if has selectedFile', () => {
    component.selectedFile = true;
    const returnedFormData = component.prepareEmployeeDataToSend(mockedDto);
    expect(returnedFormData.has('image')).toBe(true);
  });

  it('updateEmployee method should close dialogRef when EmployeeService has sent a response', () => {
    component.selectedFile = false;
    spyOn(component, 'prepareEmployeeDataToSend').and.returnValue(new FormData());
    // @ts-ignore
    spyOn(component.employeeService, 'updateEmployee').and.returnValue(of(true));
    component.updateEmployee();
    expect(matDialogRefMock.close).toHaveBeenCalled();
  });

  it('createEmployee method should close dialogRef when EmployeeService has sent a response', () => {
    spyOn(component, 'prepareEmployeeDataToSend').and.returnValue(new FormData());
    // @ts-ignore
    spyOn(component.employeeService, 'postEmployee').and.returnValue(of(true));
    component.createEmployee();
    expect(matDialogRefMock.close).toHaveBeenCalled();
  });
});
