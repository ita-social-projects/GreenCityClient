import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { UbsAdminEmployeeCardComponent } from './ubs-admin-employee-card.component';

fdescribe('UbsAdminEmployeeCardComponent', () => {
  let component: UbsAdminEmployeeCardComponent;
  let fixture: ComponentFixture<UbsAdminEmployeeCardComponent>;
  let matDialog: MatDialog;
  const dialogRefStub = {
    afterClosed() {
      return of();
    },
    open() {}
  };
  const matDialogRef = 'matDialogRef';
  const EmployeePositions = [
    {
      id: 12,
      name: 'fakeName'
    }
  ];
  const ReceivingStations = [
    {
      id: 34,
      name: 'fakeName'
    }
  ];
  const data = {
    email: 'fakeEmail',
    employeePositions: EmployeePositions,
    firstName: 'fakeFirstName',
    id: 789,
    image: 'fakeImage',
    lastName: 'fakeLastName',
    phoneNumber: 'fakePhoneNumber',
    receivingStations: ReceivingStations
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UbsAdminEmployeeCardComponent],
      imports: [TranslateModule.forRoot(), MatMenuModule, MatDialogModule, HttpClientTestingModule],
      providers: [{ provide: MatDialogRef, useValue: dialogRefStub }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsAdminEmployeeCardComponent);
    component = fixture.componentInstance;
    component.data = data;
    matDialog = TestBed.inject(MatDialog);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
