import { ChangeDetectorRef, CUSTOM_ELEMENTS_SCHEMA, ElementRef } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule, MatDialog } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { AdminTableService } from 'src/app/ubs/ubs-admin/services/admin-table.service';
import { ColumnFiltersPopUpComponent } from './column-filters-pop-up.component';

describe('ColumnFiltersPopUpComponent', () => {
  let component: ColumnFiltersPopUpComponent;
  let fixture: ComponentFixture<ColumnFiltersPopUpComponent>;
  let dialogMock: MatDialog;
  const fakeAdminTableService = jasmine.createSpyObj('fakeAdminTableService', [
    'changeFilters',
    'getDateChecked',
    'getDateValue',
    'changeDateFilters',
    'changeInputDateFilters'
  ]);
  const fakeDialog = jasmine.createSpyObj('fakeDialog', ['close', 'updatePosition', 'updateSize']);
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
        MatDatepickerModule
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

  it('outside click should close popup', fakeAsync(() => {
    component.isPopupOpened = true;
    fixture.detectChanges();
    document.dispatchEvent(new MouseEvent('click'));
    expect(fakeDialog.close).toHaveBeenCalled();
  }));

  it('method setPopupPosUnderButton should should set size anp pos', () => {
    // @ts-ignore
    component.setPopupPosUnderButton();
    expect(fakeDialog.updatePosition).toHaveBeenCalled();
    expect(fakeDialog.updateSize).toHaveBeenCalled();
  });

  it('method changeColumnFilters should invoke changeColumnFilters from service', () => {
    component.changeColumnFilters(true, 'test', { filtered: true });
    expect(fakeAdminTableService.changeFilters).toHaveBeenCalled();
  });

  it('method getDateChecked should invoke getDateChecked from service', () => {
    fakeAdminTableService.getDateChecked.and.returnValue(true);
    const res = component.getDateChecked();
    expect(res).toBeTruthy();
  });

  it('method getDateValue should invoke getDateValue from service', () => {
    fakeAdminTableService.getDateValue.and.returnValue(true);
    const res = component.getDateValue('To');
    expect(res).toBeTruthy();
  });

  it('method changeInputDateFilters should invoke changeInputDateFilters from service', () => {
    component.changeInputDateFilters('test', 'test');
    expect(fakeAdminTableService.changeInputDateFilters).toHaveBeenCalled();
  });

  it('method changeDateFilters should invoke changeDateFilters from service', () => {
    const event = new MatCheckboxChange();
    component.changeDateFilters(event, true);
    expect(fakeAdminTableService.changeDateFilters).toHaveBeenCalled();
  });

  it('method getOptionsForFiltering should return options', () => {
    const options = component.getOptionsForFiltering();
    expect(options).toEqual(fakeAdminTableService.columnsForFiltering[0].values);
  });

  it('method getColumnsForFiltering should return columnsForFiltering from service', () => {
    const columnsForFilteringTest = component.getColumnsForFiltering();
    expect(columnsForFilteringTest).toEqual(fakeAdminTableService.columnsForFiltering);
  });
});
