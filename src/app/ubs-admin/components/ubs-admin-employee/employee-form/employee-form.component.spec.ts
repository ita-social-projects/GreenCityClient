import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { EmployeeFormComponent } from './employee-form.component';

describe('EmployeeFormComponent', () => {
  let component: EmployeeFormComponent;
  let fixture: ComponentFixture<EmployeeFormComponent>;
  const matDialogRefMock = jasmine.createSpyObj('matDialogRefMock', ['close']);
  const mockedEmployeePositions = [
    {
      id: 2,
      name: 'fake'
    }
  ];
  const mockedReceivingStations = [
    {
      id: 3,
      name: 'fake'
    },
    {
      id: 4,
      name: 'fake'
    }
  ];
  const mockedData = {
    email: 'fake',
    employeePositions: mockedEmployeePositions,
    firstName: 'fake',
    id: 1,
    image: 'fake',
    lastName: 'fake',
    phoneNumber: 'fake',
    receivingStations: mockedReceivingStations
  };
  const mockedDto = 'employeeDto';
  const employeeService = 'employeeService';
  const fakeEmployeePositions = ['fake'];
  const fakeReceivingStations = ['fake'];
  const fakeEmployeeForm = new FormGroup({
    firstName: new FormControl('fake'),
    lastName: new FormControl('fake'),
    phoneNumber: new FormControl('fake'),
    email: new FormControl('fake')
  });

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
    component.receivingStations = JSON.parse(JSON.stringify(mockedReceivingStations));
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

  it('Location should be included', () => {
    const isIncludeLocanion = component.doesIncludeLocation({ id: 3 });
    expect(isIncludeLocanion).toBe(true);
  });

  it('Location should be removed', () => {
    const location = { id: 4 };
    component.onCheckChangeLocation(location);
    expect(component.receivingStations).toEqual([
      {
        id: 3,
        name: 'fake'
      }
    ]);
  });

  it('Location should be added', () => {
    const location = { id: 1, name: 'lastAddedFake' };
    component.onCheckChangeLocation(location);
    expect(component.receivingStations).toEqual([
      {
        id: 3,
        name: 'fake'
      },
      {
        id: 4,
        name: 'fake'
      },
      {
        id: 1,
        name: 'lastAddedFake'
      }
    ]);
  });

  it('updateEmployee method should close dialogRef when EmployeeService has sent a response', () => {
    component.selectedFile = false;
    spyOn(component, 'prepareEmployeeDataToSend').and.returnValue(new FormData());
    spyOn(component[employeeService], 'updateEmployee').and.returnValue(of(true));
    component.updateEmployee();
    expect(matDialogRefMock.close).toHaveBeenCalled();
  });

  it('createEmployee method should close dialogRef when EmployeeService has sent a response', () => {
    spyOn(component, 'prepareEmployeeDataToSend').and.returnValue(new FormData());
    spyOn(component[employeeService], 'postEmployee').and.returnValue(of(true));
    component.createEmployee();
    expect(matDialogRefMock.close).toHaveBeenCalled();
  });

  it('prepareEmployeeDataToSend should send formData', () => {
    component.employeeForm = fakeEmployeeForm;
    component.employeePositions = fakeEmployeePositions;
    component.receivingStations = fakeReceivingStations;
    component.selectedFile = false;
    component.data.id = 123;

    const res = component.prepareEmployeeDataToSend('fakeDto');
    const expectedAnswer =
      '{"firstName":"fake","lastName":"fake","phoneNumber":"fake","email":"fake","employeePositions":["fake"],"receivingStations":["fake"],"id":123}';
    expect(res.get('fakeDto')).toBe(expectedAnswer);
  });
});
