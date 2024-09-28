import { CUSTOM_ELEMENTS_SCHEMA, ElementRef } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule, MatDialog } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { AdminTableService } from 'src/app/ubs/ubs-admin/services/admin-table.service';
import { ColumnFiltersPopUpComponent } from './column-filters-pop-up.component';
import { provideMockStore } from '@ngrx/store/testing';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { IFilteredColumnValue } from '@ubs/ubs-admin/models/ubs-admin.interface';

describe('ColumnFiltersPopUpComponent', () => {
  let component: ColumnFiltersPopUpComponent;
  let fixture: ComponentFixture<ColumnFiltersPopUpComponent>;
  let dialogMock: MatDialog;
  const fakeAdminTableService = jasmine.createSpyObj('fakeAdminTableService', [
    'changeFilters',
    'getDateChecked',
    'getDateValue',
    'changeDateFilters',
    'changeInputDateFilters',
    'isFilterChecked',
    'setNewFilters',
    'swapDatesIfNeeded',
    'setDateFormat',
    'setNewDateRange',
    'setNewDateChecked',
    'setCurrentFilters'
  ]);
  const fakeDialog = jasmine.createSpyObj('fakeDialog', ['close', 'updatePosition', 'updateSize', 'discardChanges']);
  const matDialogDataMock = {
    columnName: 'test',
    trigger: new ElementRef(document.createElement('div'))
  };

  const columnsForFilteringMock = [
    {
      key: 'test',
      en: 'test',
      ua: 'test',
      values: ['a', 'b', 'c']
    }
  ];

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), MatDialogModule, SharedModule, MatDatepickerModule, MatNativeDateModule, ReactiveFormsModule],
      declarations: [ColumnFiltersPopUpComponent],
      providers: [
        { provide: AdminTableService, useValue: fakeAdminTableService },
        { provide: MAT_DIALOG_DATA, useValue: matDialogDataMock },
        { provide: MatDialogRef, useValue: fakeDialog },
        MatDatepickerModule,
        provideMockStore()
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColumnFiltersPopUpComponent);
    component = fixture.componentInstance;
    dialogMock = TestBed.inject(MatDialog);
    fakeAdminTableService.columnsForFiltering = columnsForFilteringMock;
    fakeDialog.componentInstance = {
      elementRef: {
        nativeElement: document.createElement('div')
      }
    };

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit should invoke setPopupPosUnderButton method', () => {
    const spy = spyOn(component, 'ngOnInit').and.returnValue();
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('should set showButtons to true and call setNewFilters on filter change', () => {
    const checked = true;
    const currentColumn = 'testColumn';
    const option = { en: 'Option En', key: 'optionKey' };

    component.onFilterChange(checked, currentColumn, option);

    expect(component.showButtons).toBeTrue();
    expect(fakeAdminTableService.setNewFilters).toHaveBeenCalledWith(checked, currentColumn, option);
  });

  it('should update date values and call setNewDateRange with formatted dates', () => {
    const dateFrom = new Date('2024-09-01');
    const dateTo = new Date('2024-09-30');
    const formattedDateFrom = '01-09-2024';
    const formattedDateTo = '30-09-2024';
    const columnName = 'testColumn';

    component.dateFrom = dateFrom;
    component.dateTo = dateTo;
    component.dateChecked = true;
    component.data = { columnName };

    fakeAdminTableService.swapDatesIfNeeded.and.returnValue({ dateFrom, dateTo });
    fakeAdminTableService.setDateFormat.and.callFake((date) => {
      if (date === dateFrom) {
        return formattedDateFrom;
      }
      if (date === dateTo) {
        return formattedDateTo;
      }
      return '';
    });

    component.onDateChange();

    expect(component.showButtons).toBeTrue();
    expect(fakeAdminTableService.swapDatesIfNeeded).toHaveBeenCalledWith(dateFrom, dateTo, component.dateChecked);
    expect(fakeAdminTableService.setDateFormat).toHaveBeenCalledWith(dateFrom);
    expect(fakeAdminTableService.setDateFormat).toHaveBeenCalledWith(dateTo);
    expect(fakeAdminTableService.setNewDateRange).toHaveBeenCalledWith(columnName, formattedDateFrom, formattedDateTo);
  });

  it('should call onDateChange and setNewDateChecked on checkbox change', () => {
    const columnName = 'testColumn';
    const checked = true;
    const mockEvent = { checked } as MatCheckboxChange;

    component.data = { columnName };
    spyOn(component, 'onDateChange').and.callThrough();

    component.onDateChecked(mockEvent, checked);

    expect(component.onDateChange).toHaveBeenCalled();
    expect(fakeAdminTableService.setNewDateChecked).toHaveBeenCalledWith(columnName, checked);
  });

  it('should return the result of adminTableService.isFilterChecked', () => {
    const columnName = 'testColumn';
    const option: IFilteredColumnValue = { key: 'testKey', en: 'Test' };
    const expectedResult = true;

    fakeAdminTableService.isFilterChecked.and.returnValue(expectedResult);
    const result = component.isChecked(columnName, option);

    expect(fakeAdminTableService.isFilterChecked).toHaveBeenCalledWith(columnName, option);
    expect(result).toBe(expectedResult);
  });

  it('should call stopPropagation and update dates correctly when type is "from"', () => {
    const event = { stopPropagation: jasmine.createSpy('stopPropagation') } as unknown as Event;

    fakeAdminTableService.swapDatesIfNeeded.and.returnValue({
      dateFrom: null,
      dateTo: new Date('2024-09-30T00:00:00Z')
    });

    component.dateFrom = new Date('2024-09-01T00:00:00Z');
    component.dateTo = new Date('2024-09-30T00:00:00Z');
    const onDateChangeSpy = spyOn(component, 'onDateChange').and.callThrough();
    component.discardDateChanges('from', event);

    expect(event.stopPropagation).toHaveBeenCalled();

    expect(component.dateFrom).toBeNull();
    expect(component.dateTo).toEqual(new Date('2024-09-30T00:00:00Z'));
    expect(onDateChangeSpy).toHaveBeenCalled();
  });
});
