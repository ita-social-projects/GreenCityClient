import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { MatTableModule } from '@angular/material/table';
import { TranslateModule } from '@ngx-translate/core';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MatMenuModule } from '@angular/material/menu';

import { UbsAdminEmployeeService } from 'src/app/ubs/ubs-admin/services/ubs-admin-employee.service';
import { EmployeeFormComponent } from '../employee-form/employee-form.component';
import { UbsAdminEmployeeTableComponent } from './ubs-admin-employee-table.component';

describe('UbsAdminEmployeeTableComponent', () => {
  let component: UbsAdminEmployeeTableComponent;
  let fixture: ComponentFixture<UbsAdminEmployeeTableComponent>;

  const ubsAdminEmployeeServiceMock = jasmine.createSpyObj('ubsAdminEmployeeServiceMock', ['getAllStations', 'getAllPositions']);
  const dialogRefStub = {
    afterClosed() {
      return of(true);
    }
  };
  const fakeTableItems = {
    content: ['fakeData1', 'fakeData2'],
    totalPages: 7
  };
  const fakeTableDataStations = [
    {
      receivingStations: [{ id: 1 }, { id: 2 }, { id: 3 }]
    },
    {
      receivingStations: [{ id: 11 }, { id: 22 }, { id: 33 }]
    },
    {
      receivingStations: [{ id: 11 }, { id: 12 }, { id: 13 }]
    }
  ];
  const fakeTableDataPositions = [
    {
      employeePositions: [{ id: 1 }, { id: 2 }, { id: 3 }]
    },
    {
      employeePositions: [{ id: 11 }, { id: 22 }, { id: 33 }]
    },
    {
      employeePositions: [{ id: 11 }, { id: 12 }, { id: 13 }]
    }
  ];
  const fakeSelectedPositions = ['3', '12', '44'];
  const fakeSelectedStations = ['1', '2', '3'];
  const expectedAnswerForPositions = [
    {
      employeePositions: [{ id: 1 }, { id: 2 }, { id: 3 }]
    },
    {
      employeePositions: [{ id: 11 }, { id: 12 }, { id: 13 }]
    }
  ];
  const expectedAnswerForStations = [
    {
      receivingStations: [{ id: 1 }, { id: 2 }, { id: 3 }]
    }
  ];

  ubsAdminEmployeeServiceMock.getAllStations.and.returnValue(of(['fakeStation1', 'fakeStation2', 'fakeStation3']));
  ubsAdminEmployeeServiceMock.getAllPositions.and.returnValue(of(['fakePosition1', 'fakePosition2', 'fakePosition3']));
  const storeMock = jasmine.createSpyObj('store', ['select', 'dispatch']);
  storeMock.select = () => of(fakeTableItems as any);
  const matDialogMock = jasmine.createSpyObj('matDialog', ['open']);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UbsAdminEmployeeTableComponent],
      imports: [
        HttpClientTestingModule,
        MatDialogModule,
        MatTableModule,
        InfiniteScrollModule,
        ReactiveFormsModule,
        MatMenuModule,
        TranslateModule.forRoot()
      ],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefStub },
        { provide: MatDialog, useValue: matDialogMock },
        { provide: Store, useValue: storeMock },
        { provide: UbsAdminEmployeeService, useValue: ubsAdminEmployeeServiceMock }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsAdminEmployeeTableComponent);
    component = fixture.componentInstance;
    spyOn(component.searchValue, 'pipe').and.returnValue(of(''));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getTable inside ngOnInit', () => {
    const spy = spyOn(component, 'getTable');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('should change the init data after calling updateTable', () => {
    component.updateTable();
    expect(storeMock.dispatch).toHaveBeenCalled();
  });

  it('should call getTable inside onScroll', () => {
    component.isUpdateTable = false;
    component.currentPageForTable = 3;
    component.totalPagesForTable = 9;
    const spy = spyOn(component, 'updateTable');
    component.onScroll();
    expect(spy).toHaveBeenCalled();
    expect(component.currentPageForTable).toBe(4);
  });

  it('should change the init data after calling openPositions', () => {
    component.isPositionsOpen = true;
    component.allPositions = [];
    component.selectedPositions = ['fake'];
    component.openPositions();
    expect(component.allPositions).toEqual(['fakePosition1', 'fakePosition2', 'fakePosition3']);
    expect(component.selectedPositions).toEqual([]);
  });

  it('should change the init data after calling openStations', () => {
    component.isStationsOpen = true;
    component.allStations = [];
    component.selectedStations = ['fake'];
    component.openStations();
    expect(component.allStations).toEqual(['fakeStation1', 'fakeStation2', 'fakeStation3']);
    expect(component.selectedStations).toEqual([]);
  });

  it('should call onPositionSelected inside positionsFilter if length !== 0', () => {
    component.selectedPositions = ['fake'];
    const spy = spyOn(component, 'onPositionSelected');
    component.positionsFilter();
    expect(spy).toHaveBeenCalled();
  });

  it('should call onPositionSelected inside stationsFilter if length !== 0', () => {
    component.selectedStations = ['fake'];
    const spy = spyOn(component, 'onStationSelected');
    component.stationsFilter();
    expect(spy).toHaveBeenCalled();
  });

  it('should call positionsFilter inside getPositionId if checked', () => {
    const e = { target: { checked: true } };
    component.selectedPositions = [];
    const spy = spyOn(component, 'positionsFilter');
    component.getPositionId(e, '132');
    expect(spy).toHaveBeenCalled();
    expect(component.selectedPositions).toEqual(['132']);
  });

  it('should call positionsFilter inside getPositionId if not checked', () => {
    const e = { target: { checked: false } };
    component.selectedPositions = ['132', '312'];
    const spy = spyOn(component, 'positionsFilter');
    component.getPositionId(e, '312');
    expect(spy).toHaveBeenCalled();
    expect(component.selectedPositions).toEqual(['132']);
  });

  it('should call stationsFilter inside getStationId if checked', () => {
    const e = { target: { checked: true } };
    component.selectedStations = [];
    const spy = spyOn(component, 'stationsFilter');
    component.getStationId(e, '132');
    expect(spy).toHaveBeenCalled();
    expect(component.selectedStations).toEqual(['132']);
  });

  it('should call stationsFilter inside getStationId if not checked', () => {
    const e = { target: { checked: false } };
    component.selectedStations = ['132', '312'];
    const spy = spyOn(component, 'stationsFilter');
    component.getStationId(e, '312');
    expect(spy).toHaveBeenCalled();
    expect(component.selectedStations).toEqual(['132']);
  });

  it('should call open inside openModal', () => {
    const employeeData = { data: 'fake' };
    component.openModal(employeeData as any);
    expect(matDialogMock.open).toHaveBeenCalledWith(EmployeeFormComponent, {
      data: employeeData,
      hasBackdrop: true,
      closeOnNavigation: true,
      disableClose: true,
      panelClass: 'custom-dialog-container'
    });
  });
});
