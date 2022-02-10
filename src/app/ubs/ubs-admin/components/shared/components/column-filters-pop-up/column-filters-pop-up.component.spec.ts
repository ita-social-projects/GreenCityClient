import { CUSTOM_ELEMENTS_SCHEMA, ElementRef } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { AdminTableService } from 'src/app/ubs/ubs-admin/services/admin-table.service';
import { ColumnFiltersPopUpComponent } from './column-filters-pop-up.component';

describe('ColumnFiltersPopUpComponent', () => {
  let component: ColumnFiltersPopUpComponent;
  let fixture: ComponentFixture<ColumnFiltersPopUpComponent>;
  const fakeAdminTableService = jasmine.createSpyObj('fakeAdminTableService', [
    'changeFilters',
    'getDateChecked',
    'getDateValue',
    'changeDateFilters',
    'changeInputDateFilters'
  ]);
  const matDialogDataMock = {
    columnName: 'test',
    trigger: new ElementRef(document.createElement('div'))
  };
  const dialogMock = {
    close: () => {},
    updatePosition: () => {},
    updateSize: () => {}
  };
  const columnsForFilteringMock = [
    {
      key: 'test',
      en: 'test',
      ua: 'test',
      values: []
    }
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), MatDialogModule, SharedModule],
      declarations: [ColumnFiltersPopUpComponent],
      providers: [
        { provide: AdminTableService, useValue: fakeAdminTableService },
        { provide: MAT_DIALOG_DATA, useValue: matDialogDataMock },
        { provide: MatDialogRef, useValue: dialogMock }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColumnFiltersPopUpComponent);
    component = fixture.componentInstance;
    fakeAdminTableService.columnsForFiltering = columnsForFilteringMock;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
