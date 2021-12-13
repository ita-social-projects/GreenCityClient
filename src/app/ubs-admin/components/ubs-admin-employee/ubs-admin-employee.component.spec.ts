import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Location } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgxPaginationModule, PaginatePipe } from 'ngx-pagination';
import { Observable, of } from 'rxjs';
import { UbsAdminEmployeeService } from '../../services/ubs-admin-employee.service';

import { UbsAdminEmployeeComponent } from './ubs-admin-employee.component';

describe('UbsAdminEmployeeComponent', () => {
  let component: UbsAdminEmployeeComponent;
  let fixture: ComponentFixture<UbsAdminEmployeeComponent>;
  let activatedRoute: ActivatedRoute;
  let dialog: MatDialog;
  const fakeParams = {
    page: 3
  };
  const fakePage = {
    email: 'fakeEmail'
  };
  const fakeItems = {
    page: [{ email: 'newFakeEmail' }],
    totalElements: 555
  };
  const ubsAdminEmployeeServiceMock = jasmine.createSpyObj('ubsAdminEmployeeServiceMock', ['getEmployees']);
  const fakeLocation = jasmine.createSpyObj('fakeLocation', ['go']);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UbsAdminEmployeeComponent, PaginatePipe],
      imports: [TranslateModule.forRoot(), RouterTestingModule, HttpClientTestingModule, MatDialogModule, NgxPaginationModule],
      providers: [
        { provide: UbsAdminEmployeeService, useValue: ubsAdminEmployeeServiceMock },
        { provide: Location, useValue: fakeLocation }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsAdminEmployeeComponent);
    component = fixture.componentInstance;
    activatedRoute = TestBed.inject(ActivatedRoute);
    dialog = TestBed.inject(MatDialog);
    ubsAdminEmployeeServiceMock.getEmployees.and.returnValue(of('fake'));
    component.paginPage = 3;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getEmployees inside ngOnInit', () => {
    component.tiles = false;
    activatedRoute.params = Observable.of(fakeParams);
    const spy = spyOn(component, 'getEmployees');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
    expect(component.tiles).toBe(true);
    expect(component.paginPage).toBe(2);
  });

  it('should call setData inside getEmployees', () => {
    const spy = spyOn(component, 'setData');
    component.getEmployees();
    expect(spy).toHaveBeenCalledWith('fake');
  });

  it('should change the init data after calling setData', () => {
    component.employeesData = [fakePage as any];
    component.totalLength = 0;
    component.setData(fakeItems as any);
    expect(component.employeesData).toEqual([{ email: 'newFakeEmail' } as any]);
    expect(component.totalLength).toBe(555);
  });

  it('should call getEmployees and location.go inside changeCurrentPage', () => {
    component.currentPage = 0;
    component.paginPage = 0;
    const spyEmployee = spyOn(component, 'getEmployees');
    component.changeCurrentPage(3);
    expect(fakeLocation.go).toHaveBeenCalledWith('/ubs-admin/employee/3');
    expect(spyEmployee).toHaveBeenCalled();
    expect(component.currentPage).toBe(3);
    expect(component.paginPage).toBe(2);
  });

  it('should call setData inside getEmployees', () => {
    const spy = spyOn(dialog, 'open');
    component.openDialog();
    expect(spy).toHaveBeenCalled();
  });

  it('should change the init data after calling openTable', () => {
    component.tiles = true;
    component.openTable();
    expect(component.tiles).toBe(false);
  });

  it('should change the init data after calling openTiles', () => {
    component.tiles = false;
    component.openTiles();
    expect(component.tiles).toBe(true);
  });
});
