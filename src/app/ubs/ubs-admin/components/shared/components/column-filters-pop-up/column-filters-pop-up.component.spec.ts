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

  it('outside click should close popup', fakeAsync(() => {
    component.isPopupOpened = true;
    fixture.detectChanges();
    document.dispatchEvent(new MouseEvent('click'));
    expect(fakeDialog.close).toHaveBeenCalled();
  }));

  it('method setPopupPosUnderButton should set size anp pos', () => {
    (component as any).setPopupPosUnderButton();
    expect(fakeDialog.updatePosition).toHaveBeenCalled();
    expect(fakeDialog.updateSize).toHaveBeenCalled();
  });

  it('method getOptionsForFiltering should return options', () => {
    component.getOptionsForFiltering();
    expect(component.filteredValues).toEqual(fakeAdminTableService.columnsForFiltering[0].values);
  });

  it('method getColumnsForFiltering should return columnsForFiltering from service', () => {
    const columnsForFilteringTest = component.getColumnsForFiltering();
    expect(columnsForFilteringTest).toEqual(fakeAdminTableService.columnsForFiltering);
  });
});
