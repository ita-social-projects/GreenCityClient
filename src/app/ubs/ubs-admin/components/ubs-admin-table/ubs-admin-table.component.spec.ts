import { MatMenuModule } from '@angular/material/menu';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CdkTableModule } from '@angular/cdk/table';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from 'src/app/shared/shared.module';
import { UbsAdminTableComponent } from './ubs-admin-table.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { TranslateModule } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA, Renderer2, ChangeDetectorRef, DebugElement } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { MatDialogConfig } from '@angular/material/dialog';
import { ServerTranslatePipe } from 'src/app/shared/translate-pipe/translate-pipe.pipe';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { SelectionModel } from '@angular/cdk/collections';
import { Language } from 'src/app/main/i18n/Language';
import { DateAdapter } from '@angular/material/core';
import { FormBuilder } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { OrderStatus } from 'src/app/ubs/ubs/order-status.enum';
import { TableHeightService } from '../../services/table-height.service';
import { Router } from '@angular/router';

describe('UsbAdminTableComponent', () => {
  let component: UbsAdminTableComponent;
  let fixture: ComponentFixture<UbsAdminTableComponent>;
  const storeMock = jasmine.createSpyObj('store', ['select', 'dispatch']);
  let router: Router;

  const initDateMock = {
    orderDateFrom: '',
    orderDateTo: '',
    orderDateCheck: false,
    dateOfExportFrom: '',
    dateOfExportTo: '',
    dateOfExportCheck: false,
    paymentDateFrom: '',
    paymentDateTo: '',
    paymentDateCheck: false
  };

  const dateMock = {
    orderDateFrom: '2022-10-10',
    orderDateTo: '2022-10-10',
    orderDateCheck: false,
    dateOfExportFrom: '2022-10-10',
    dateOfExportTo: '2022-10-10',
    dateOfExportCheck: false,
    paymentDateFrom: '2022-10-10',
    paymentDateTo: '2022-10-10',
    paymentDateCheck: false
  };

  const localStorageServiceMock = jasmine.createSpyObj('localStorageService', [
    'setUbsAdminOrdersTableTitleColumnFilter',
    'getUbsAdminOrdersTableTitleColumnFilter',
    'languageBehaviourSubject',
    'getCurrentLanguage',
    'removeAdminOrderFilters',
    'getAdminOrdersDateFilter',
    'setAdminOrdersDateFilter',
    'removeAdminOrderDateFilters'
  ]);
  localStorageServiceMock.languageBehaviourSubject = new BehaviorSubject('ua');
  localStorageServiceMock.getCurrentLanguage = () => 'ua' as Language;
  localStorageServiceMock.languageSubject = of('ua');

  const tableServiceMock = jasmine.createSpyObj('tableHeightService', [
    'setTableHeightToContainerHeight',
    'getUbsAdminOrdersTableColumnsWidthPreference',
    'setUbsAdminOrdersTableColumnsWidthPreference'
  ]);

  const FakeMatDialogConfig = jasmine.createSpyObj('dialog', ['open']);

  const rendererMock = jasmine.createSpyObj('renderer', ['listen', 'setStyle']);

  const changeDetectorMock = jasmine.createSpyObj('cdr', ['detectChanges']);
  changeDetectorMock.detectChanges();

  const dateAdapterMock = jasmine.createSpyObj('adapter', ['setLocale']);
  dateAdapterMock.setLocale = () => of('en-GB');

  const formBuilderMock: FormBuilder = new FormBuilder();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        MatIconModule,
        MatMenuModule,
        MatPaginatorModule,
        MatTableModule,
        CdkTableModule,
        DragDropModule,
        HttpClientTestingModule,
        MatCheckboxModule,
        BrowserAnimationsModule,
        SharedModule,
        InfiniteScrollModule,
        TranslateModule.forRoot(),
        MatTooltipModule
      ],
      declarations: [UbsAdminTableComponent, ServerTranslatePipe],
      providers: [
        { provide: Store, useValue: storeMock },
        { provide: LocalStorageService, useValue: localStorageServiceMock },
        { provide: TableHeightService, useValue: tableServiceMock },
        { provide: MatDialogConfig, useValue: FakeMatDialogConfig },
        { provide: ChangeDetectorRef, useValue: changeDetectorMock },
        { provide: Renderer2, useValue: rendererMock },
        { provide: FormBuilder, useValue: formBuilderMock },
        { provide: DateAdapter, useValue: dateAdapterMock }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    localStorageServiceMock.getUbsAdminOrdersTableTitleColumnFilter = () => {
      return [{ orderStatus: OrderStatus.FORMED }];
    };

    localStorageServiceMock.getAdminOrdersDateFilter = () => {
      return dateMock;
    };

    storeMock.select = () => of(false);
    fixture = TestBed.createComponent(UbsAdminTableComponent);
    component = fixture.componentInstance;
    spyOn(component.modelChanged, 'pipe').and.returnValue(of({}));
    component.ordersViewParameters$ = of(false) as any;
    component.bigOrderTableParams$ = of(false) as any;
    component.bigOrderTable$ = of(false) as any;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  afterEach(() => {
    spyOn(component, 'ngOnDestroy').and.callFake(() => {});
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit', () => {
    component.ngOnInit();
    expect(component.modelChanged.pipe).toHaveBeenCalled();
  });

  it('ngOnInit component.noFiltersApplied initially true ', () => {
    component.ngOnInit();
    expect(component.noFiltersApplied).toEqual(true);
  });

  it('ngOnInit should call initDateForm and set component dateForm', () => {
    spyOn(component, 'initDateForm');
    component.ngOnInit();
    expect(component.initDateForm).toHaveBeenCalledTimes(1);
    expect(component.dateForm.value).toEqual(dateMock);
  });

  it('ordersViewParameters$ expect displayedColumns should be [title]', () => {
    component.ordersViewParameters$ = of({ titles: 'title' });
    component.ngOnInit();
    component.ordersViewParameters$.subscribe((item: any) => {
      expect(component.displayedColumns).toEqual(['title']);
    });
  });

  it('bigOrderTable$ expect formatTableData has call', () => {
    spyOn(component, 'formatTableData');
    component.bigOrderTable$ = of({ number: 2, totalElements: 10, content: [{ content: 'content' }], totalPages: 1 }) as any;
    component.ngOnInit();
    component.bigOrderTable$.subscribe((items: any) => {
      expect(component.currentPage).toBe(2);
      expect(component.tableData[0].content).toBe('content');
      expect(component.formatTableData).toHaveBeenCalled();
    });
  });

  it('bigOrderTable$ expect detectChanges has call', () => {
    component.bigOrderTable$.subscribe((items: any) => {
      expect(changeDetectorMock.detectChanges).toHaveBeenCalledTimes(1);
    });
  });

  it('bigOrderTable$ expect totalElements to be 10 ', () => {
    component.bigOrderTable$ = of({ number: 2, totalElements: 10, content: [{ content: 'content' }], totalPages: 1 }) as any;
    component.firstPageLoad = true;
    component.ngOnInit();
    component.bigOrderTable$.subscribe((items: any) => {
      expect(component.totalElements).toBe(10);
    });
  });

  it('bigOrderTableParams ', () => {
    spyOn(component, 'setColumnsForFiltering');
    spyOn(component, 'sortColumnsToDisplay');
    spyOn(component as any, 'getTable');
    const bigOrderTableParamsMock = of({
      columnBelongingList: ['columnBelongingList'],
      columnDTOList: [
        {
          columnBelonging: 'string',
          editType: 'string',
          filtered: false,
          index: 1,
          title: { key: 'key', ua: 'ua', en: 'en', filtered: false }
        }
      ],
      orderSearchCriteria: {},
      page: {}
    });
    component.bigOrderTableParams$ = bigOrderTableParamsMock as any;
    component.isStoreEmpty = true;
    component.ngOnInit();
    component.bigOrderTableParams$.subscribe((columns: any) => {
      expect(component.tableViewHeaders).toEqual(['columnBelongingList']);
      expect(component.displayedColumnsViewTitles).toEqual(['key']);
      expect(component.setColumnsForFiltering).toHaveBeenCalledTimes(1);
      expect((component as any).getTable).toHaveBeenCalled();
      expect(component.sortColumnsToDisplay).toHaveBeenCalledTimes(2);
    });
  });

  it('ngOnInit should call checkAllColumnsDisplayed()', () => {
    spyOn(component, 'checkAllColumnsDisplayed');
    component.ngOnInit();
    expect(component.checkAllColumnsDisplayed).toHaveBeenCalled();
  });

  it('ngAfterViewChecked ', () => {
    component.isTableHeightSet = false;
    tableServiceMock.setTableHeightToContainerHeight.and.returnValue(true);
    spyOn(component, 'onScroll');
    component.ngAfterViewChecked();
    expect(component.isTableHeightSet).toBe(true);
  });

  it('ngAfterViewChecked should call detectChanges', () => {
    component.ngAfterViewChecked();
    expect(changeDetectorMock.detectChanges).toHaveBeenCalledTimes(1);
  });

  it('should call getLocalDateForm', () => {
    spyOn(component as any, 'getLocalDateForm');
    component.initDateForm();
    expect((component as any).getLocalDateForm).toHaveBeenCalledTimes(1);
  });

  it('should call initDateForm and set component dateForm', () => {
    spyOn(component, 'initDateForm');
    component.initDateForm();
    expect(component.initDateForm).toHaveBeenCalledTimes(1);
    expect(component.dateForm.value).toEqual(dateMock);
  });

  it('should not call dateForm setValue method on initDateForm if getLocalForm is false', () => {
    (component as any).getLocalDateForm = () => {
      return false;
    };
    const val = (component as any).getLocalDateForm();
    expect(val).toBe(false);
  });

  it('should not call dateForm setValue method on initDateForm if getLocalForm is false', () => {
    const dateForm = component.dateForm;
    spyOn(dateForm, 'setValue');
    (component as any).getLocalDateForm = () => {
      return false;
    };
    component.initDateForm();
    expect(dateForm.setValue).not.toHaveBeenCalled();
  });

  it('should set default value for dateForm on initDateForm if getLocalForm is false', () => {
    (component as any).getLocalDateForm = () => {
      return false;
    };
    component.initDateForm();
    expect(component.dateForm.value).toEqual(initDateMock);
  });

  it('isAllColumnsDisplayed sould be true ', () => {
    component.displayedColumnsView.length = 4;
    component.displayedColumns = ['title1', 'title2', 'title3', 'title4'];
    component.checkAllColumnsDisplayed();

    expect(component.isAllColumnsDisplayed).toBe(true);
  });

  it('isAllColumnsDisplayed sould be false ', () => {
    component.displayedColumnsView.length = 4;
    component.displayedColumns = ['title1', 'title2', 'title4'];
    component.checkAllColumnsDisplayed();

    expect(component.isAllColumnsDisplayed).toBe(false);
  });

  it('should call getControlValue', () => {
    spyOn(component, 'getControlValue');
    const column = 'orderDate';
    const suffix = 'From';
    component.getControlValue(column, suffix);
    expect(component.getControlValue).toHaveBeenCalledWith('orderDate', 'From');
  });

  it('should call getControlValue and return string value', () => {
    const column = 'orderDate';
    const suffix = 'From';
    const controlVal = component.getControlValue(column, suffix);
    expect(controlVal).toBe('2022-10-10');
  });

  it('should call getControlValue and return boolean value', () => {
    const column = 'orderDate';
    const suffix = 'Check';
    const controlVal = component.getControlValue(column, suffix);
    expect(controlVal).toBe(false);
  });

  it('should return control value', () => {
    const columns = [
      'orderDate',
      'orderDate',
      'orderDate',
      'dateOfExport',
      'dateOfExport',
      'dateOfExport',
      'paymentDate',
      'paymentDate',
      'paymentDate'
    ];
    const suffix = ['From', 'To', 'Check', 'From', 'To', 'Check', 'From', 'To', 'Check'];
    const mockedValues = ['2022-10-10', '2022-10-10', false, '2022-10-10', '2022-10-10', false, '2022-10-10', '2022-10-10', false];

    columns.forEach((column) => {
      const contolValue = component.dateForm.get(`${column}${suffix[columns.indexOf(column)]}`).value;
      expect(contolValue).toEqual(mockedValues[columns.indexOf(column)]);
    });
  });

  it('applyFilter call, expect modelChanged should been called with filter', () => {
    const filter = 'filter';
    spyOn(component.modelChanged, 'next');
    component.applyFilter(filter);
    expect(component.modelChanged.next).toHaveBeenCalledWith('filter');
  });

  it('should select all checkboxes without disabled', () => {
    const data = { data: [{ id: 1 }, { id: 2 }, { id: 3 }] };
    const event: MatCheckboxChange = { source: {} as any, checked: true };

    component.tableData = [
      { id: 1, orderStatus: OrderStatus.DONE },
      { id: 2, orderStatus: 'NEW' },
      { id: 3, orderStatus: 'NEW' }
    ];

    component.idsToChange = [];
    component.selection = new SelectionModel([] as any);
    component.dataSource = data as any;
    component.masterToggle(event);

    expect(component.allChecked).toBe(true);
    expect(component.idsToChange).toEqual([2, 3]);
    expect(component.selection.selected).toEqual([{ id: 2 }, { id: 3 }]);
  });

  it('checkboxLabel should return select all', () => {
    component.dataSource = { data: [{ id: 1 }] } as any;
    component.tableData = [{ id: 1, orderStatus: 'NEW' }];
    component.selection = new SelectionModel(false, [{ id: 1 }] as any);

    const Res = component.checkboxLabel();

    expect(Res).toBe('select all');
  });

  it('checkboxLabel should return deselect all', () => {
    component.dataSource = { data: [{ id: 2 }] } as any;
    component.tableData = [{ id: 2, orderStatus: OrderStatus.DONE }];
    const Res = component.checkboxLabel();

    expect(Res).toBe('deselect all');
  });

  it('checkboxLabel should return select row 2', () => {
    const Res = component.checkboxLabel({ id: 1 });
    expect(Res).toBe('select row 2');
  });

  it('showBlockedMessage', () => {
    component.dataSource = { filteredData: [{ id: 1 }] } as any;
    component.showBlockedMessage([{ orderId: 1, userName: 'name' }]);
    expect(component.blockedInfo[0].userName).toEqual('name');
  });

  it('changeColumns expect component.isAllColumnsDisplayed to be true', () => {
    component.isAllColumnsDisplayed = false;
    component.displayedColumnsView.length = 4;
    component.displayedColumns = ['title1', 'title2', 'title4'];
    component.changeColumns(true, 'title3', 2);
    expect(component.isAllColumnsDisplayed).toBe(true);
  });

  it('changeColumns expect component.isAllColumnsDisplayed to be false', () => {
    component.columns = [{ title: { key: 'title1' } }, { title: { key: 'title2' } }, { title: { key: 'title3' } }];
    component.isAllColumnsDisplayed = true;
    component.displayedColumns.length = 4;
    component.displayedColumns = ['title1', 'title2', 'title3'];
    component.changeColumns(false, 'title2', 2);
    expect(component.isAllColumnsDisplayed).toBe(false);
  });

  it('sortColumnsToDisplay expect to filter columns when box is unchecked', () => {
    component.columns = [{ title: { key: 'title1' } }, { title: { key: 'title2' } }, { title: { key: 'title3' } }];
    component.displayedColumns = ['title1', 'title2', 'title3'];
    component.changeColumns(false, 'title1', 1);
    component.sortColumnsToDisplay();
    expect(component.columns).toEqual([
      { title: { key: 'title2' }, index: 0 },
      { title: { key: 'title3' }, index: 1 },
      { title: { key: 'title1' }, index: 2 }
    ]);
  });

  it('changeColumns expect to add column when box is checked ', () => {
    component.columns = [{ title: { key: 'title1' } }, { title: { key: 'title2' } }, { title: { key: 'title4' } }];
    component.displayedColumns = ['title1', 'title2', 'title4'];
    component.changeColumns(true, 'title3', 2);
    component.sortColumnsToDisplay();
    expect(component.displayedColumns).toEqual(['title1', 'title2', 'title3', 'title4']);
  });

  it('toggleFilters expect set filtersOpened to !filtersOpened', () => {
    component.isFiltersOpened = false;
    component.toggleFilters();

    expect(component.isFiltersOpened).toEqual(true);
  });

  it('toggleTableView expect store.dispatch have been called', () => {
    storeMock.dispatch.calls.reset();
    component.displayedColumns = ['1', '2'];
    component.isPopupOpen = true;
    component.toggleTableView();
    expect(component.previousSettings).toEqual(['1', '2']);
    expect((component as any).store.dispatch).toHaveBeenCalledTimes(1);
  });

  it('showAllColumns called with false expect setDisplayedColumns has been called', () => {
    spyOn(component as any, 'setDisplayedColumns');
    component.showAllColumns(false);
    expect((component as any).setDisplayedColumns).toHaveBeenCalledTimes(1);
  });

  it('showAllColumns called with true expect setUnDisplayedColumns has been called', () => {
    spyOn(component as any, 'setUnDisplayedColumns');
    component.showAllColumns(true);
    expect((component as any).setUnDisplayedColumns).toHaveBeenCalledTimes(1);
  });

  it('getColumns should call store.dispatch', () => {
    storeMock.dispatch.calls.reset();
    (component as any).getColumns();
    expect((component as any).store.dispatch).toHaveBeenCalledTimes(1);
  });

  it('getTable', () => {
    storeMock.dispatch.calls.reset();
    component.isLoading = false;
    (component as any).getTable('filterValue');
    expect((component as any).store.dispatch).toHaveBeenCalledTimes(1);
    expect(component.isLoading).toBe(true);
  });

  it('formatTableData expect tableData should change view', () => {
    component.tableData = [
      { amountDue: '5.4hrn', totalOrderSum: '300hrn', orderCertificateCode: '1, 2', generalDiscount: 6, totalPayment: '250' }
    ];
    component.formatTableData();
    expect(component.tableData[0]).toEqual({
      amountDue: '5.40 грн',
      orderCertificateCode: '1, 2',
      orderCertificatePoints: '3',
      totalOrderSum: '300.00 грн',
      generalDiscount: '6.00 грн',
      totalPayment: '250.00 грн'
    });
  });

  it('updateTableData should call store.dispatch', () => {
    storeMock.dispatch.calls.reset();
    component.updateTableData();
    expect((component as any).store.dispatch).toHaveBeenCalledTimes(1);
  });

  it('getSortingData', () => {
    component.arrowDirection = '';
    component.filterValue = 'filterValue';
    spyOn(component as any, 'getTable');
    component.getSortingData('columnName', 'sortingType');
    expect((component as any).getTable).toHaveBeenCalledWith('filterValue', 'columnName', 'sortingType', true);
    expect(component.arrowDirection).toBe('columnName');
  });

  it('onScroll', () => {
    spyOn(component, 'updateTableData');
    component.isUpdate = false;
    component.currentPage = 1;
    component.totalPages = 2;
    component.onScroll();
    expect(component.updateTableData).toHaveBeenCalledTimes(1);
    expect(component.currentPage).toBe(2);
  });

  it('editDetails', () => {
    spyOn(component.dataForPopUp, 'push');
    component.displayedColumnsView = [{ title: { key: 'receivingStation' } }, { title: { key: '' } }];
    component.editDetails();
    expect(component.dataForPopUp.push).toHaveBeenCalledTimes(1);
  });

  it('openPopUpRequires', () => {
    component.showPopUp = true;
    component.idsToChange = [];
    component.tableData = [{ id: 1 }];
    component.openPopUpRequires(1);
    expect(component.showPopUp).toBe(false);
  });

  it('selectRowsToChange true', () => {
    component.idsToChange = [];
    component.selectRowsToChange({ checked: true } as any, { id: 1 });
    expect(component.idsToChange).toEqual([1]);
  });

  it('selectRowsToChange false expect idsToChange change', () => {
    component.idsToChange = [2, 1];
    component.selectRowsToChange({ checked: false } as any, { id: 1 });
    expect(component.idsToChange).toEqual([2]);
  });

  it('editCell expect editAll has called', () => {
    component.idsToChange.length = 1;
    spyOn(component as any, 'editAll');
    component.allChecked = true;
    component.editCell({ id: 1, nameOfColumn: '3', newValue: 'value' });
    expect((component as any).editAll).toHaveBeenCalledWith({ id: 1, nameOfColumn: '3', newValue: 'value' });
  });

  it('editCell expect editSingle has called', () => {
    component.idsToChange.length = 0;
    spyOn(component as any, 'editSingle');
    component.allChecked = false;
    component.editCell({ id: 1, nameOfColumn: '3', newValue: 'value' });
    expect((component as any).editSingle).toHaveBeenCalledWith({ id: 1, nameOfColumn: '3', newValue: 'value' });
  });

  it('editCell expect editGroup has called', () => {
    component.idsToChange.length = 1;
    spyOn(component as any, 'editGroup');
    component.allChecked = false;
    component.editCell({ id: 1, nameOfColumn: '3', newValue: 'value' });
    expect((component as any).editGroup).toHaveBeenCalledWith({ id: 1, nameOfColumn: '3', newValue: 'value' });
  });

  it('cancelEditCell ', () => {
    component.idsToChange = [1];
    component.allChecked = true;
    spyOn((component as any).adminTableService, 'cancelEdit').and.returnValue(of({}));
    component.cancelEditCell([1, 2]);
    expect((component as any).adminTableService.cancelEdit).toHaveBeenCalledWith([1, 2]);
    expect(component.idsToChange).toEqual([]);
    expect(component.allChecked).toBe(false);
  });

  it('closeAlertMess expect blockedInfo to be empty ', () => {
    component.blockedInfo = [{ orderId: 1, userName: 'name}' }];
    component.closeAlertMess();
    expect(component.blockedInfo).toEqual([]);
  });

  it('setDisplayedColumns  expect displayedColumnsViewTitles should change', () => {
    component.isAllColumnsDisplayed = false;
    component.displayedColumnsView = [{ title: { key: 'key' } }];
    (component as any).setDisplayedColumns();
    expect(component.displayedColumnsViewTitles).toEqual(['key']);
    expect(component.count).toBe(1);
    expect(component.isAllColumnsDisplayed).toBe(true);
  });

  it('setUnDisplayedColumns expect displayedColumnsViewTitles should be empty', () => {
    component.displayedColumnsViewTitles = ['not empty'];
    component.isAllColumnsDisplayed = true;
    (component as any).setUnDisplayedColumns();
    expect(component.displayedColumnsViewTitles).toEqual([]);
    expect(component.isAllColumnsDisplayed).toBe(false);
  });

  it('editSingle expect openPopUpRequires and postData should be call', () => {
    spyOn(component, 'openPopUpRequires');
    spyOn(component as any, 'postData');
    component.tableData = [{ id: 2, columnName: 'prevValue' }];
    (component as any).editSingle({ id: 2, nameOfColumn: 'columnName', newValue: 'value' });
    expect(component.tableData).toEqual([{ id: 2, columnName: 'value' }]);
    expect(component.openPopUpRequires).toHaveBeenCalledWith(0);
    expect((component as any).postData).toHaveBeenCalledWith([2], 'columnName', 'value');
  });

  it('editGroup expect postData should be call', () => {
    spyOn(component as any, 'postData');
    component.idsToChange = [1, 2];
    component.tableData = [{ id: 2, columnName: 'prevValue' }];
    (component as any).editGroup({ id: 2, nameOfColumn: 'columnName', newValue: 'value' });
    expect(component.tableData).toEqual([{ id: 2, columnName: 'value' }]);
    expect((component as any).postData).toHaveBeenCalledWith([1, 2], 'columnName', 'value');
  });

  it('editAll expect postData should be call with arguments', () => {
    spyOn(component as any, 'postData');
    component.idsToChange = [1, 2];
    component.tableData = [{ id: 2, columnName: 'prevValue' }];
    (component as any).editAll({ id: 2, nameOfColumn: 'columnName', newValue: 'value' });
    expect(component.idsToChange).toEqual([]);
    expect((component as any).postData).toHaveBeenCalledWith([], 'columnName', 'value');
  });

  it('postData expect store.dispatch should be call', () => {
    component.isPostData = false;
    storeMock.dispatch.calls.reset();
    (component as any).postData([1, 2], 'columnName', 'value');
    expect((component as any).store.dispatch).toHaveBeenCalledTimes(1);
    expect((component as any).store.dispatch).toHaveBeenCalledWith({
      orderData: [{ orderId: [1, 2], columnName: 'columnName', newValue: 'value' }],
      type: '[BigOrderTable] Changing Order Data'
    });
    expect(component.isPostData).toBe(true);
  });

  it('postData expect store.dispatch should be call if cancellationReason not null', () => {
    component.isPostData = false;
    component.cancellationReason = 'fakeReason';
    storeMock.dispatch.calls.reset();
    (component as any).postData([1, 2], 'columnName', 'value');
    expect((component as any).store.dispatch).toHaveBeenCalledTimes(1);
    expect((component as any).store.dispatch).toHaveBeenCalledWith({
      orderData: [
        { orderId: [1, 2], columnName: 'columnName', newValue: 'value' },
        { orderId: [1, 2], columnName: 'cancellationReason', newValue: 'fakeReason' }
      ],
      type: '[BigOrderTable] Changing Order Data'
    });
    expect(component.isPostData).toBe(true);
  });

  it('postData expect store.dispatch should be call if cancellationComment not null', () => {
    component.isPostData = false;
    component.cancellationComment = 'fake comment';
    storeMock.dispatch.calls.reset();
    (component as any).postData([1, 2], 'columnName', 'value');
    expect((component as any).store.dispatch).toHaveBeenCalledTimes(1);
    expect((component as any).store.dispatch).toHaveBeenCalledWith({
      orderData: [
        { orderId: [1, 2], columnName: 'columnName', newValue: 'value' },
        { orderId: [1, 2], columnName: 'cancellationComment', newValue: 'fake comment' }
      ],
      type: '[BigOrderTable] Changing Order Data'
    });
    expect(component.isPostData).toBe(true);
  });

  it('addOrderCancellationData expect cancellationReason and cancellationComment should be changed', () => {
    component.cancellationReason = '';
    component.cancellationComment = '';
    component.addOrderCancellationData({ cancellationReason: 'cancellation reason', cancellationComment: 'cancellation comment' });
    expect(component.cancellationReason).toBe('cancellation reason');
    expect(component.cancellationComment).toBe('cancellation comment');
  });

  it('openOrder expect router.navigate should be called with arguments', fakeAsync(() => {
    spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
    component.openOrder(1);
    tick();
    expect(router.navigate).toHaveBeenCalledWith(['ubs-admin', 'order', '1']);
  }));

  it('showTooltip', () => {
    const event = jasmine.createSpyObj('event', ['stopImmediatePropagation']);
    const tooltip = jasmine.createSpyObj('tooltip', ['toggle', 'show', 'hide']);

    component.currentLang = 'ua';
    component.showTooltip(event, { ua: 'title on Ukrainian', en: '' }, tooltip);
    expect(tooltip.toggle).toHaveBeenCalledTimes(1);
  });

  it('getColumnsForFiltering should return object', () => {
    (component as any).adminTableService.columnsForFiltering = [{ value: 'one' }] as any;
    const Res = component.getColumnsForFiltering();
    expect(Res[0]).toEqual({ value: 'one' } as any);
  });

  it('should call changeFilters', () => {
    const checked = true;
    const currentColumn = 'currentColumn';
    const option = { filtered: true };
    spyOn((component as any).adminTableService, 'changeFilters');
    spyOn(component, 'applyFilters');
    component.changeFilters(checked, currentColumn, option);
    expect((component as any).adminTableService.changeFilters).toHaveBeenCalledWith(true, 'currentColumn', { filtered: true });
    expect(component.applyFilters).toHaveBeenCalled();
  });

  it('should change noFiltersApplied value to false changeFilters', () => {
    const checked = true;
    const currentColumn = 'currentColumn';
    const option = { filtered: true };
    component.changeFilters(checked, currentColumn, option);
    expect((component as any).adminTableService.filters.length).toBe(1);
    expect(component.noFiltersApplied).toBe(false);
  });

  it('should noFilters applied to be false', () => {
    const checked = true;
    const currentColumn = 'currentColumn';
    const option = { filtered: true };
    component.changeFilters(checked, currentColumn, option);
    expect(component.noFiltersApplied).toBe(false);
  });

  it('should change noFiltersApplied to false on changeInputDate', () => {
    const check = false;
    const currentColumn = 'orderDate';
    const suffix = 'From';
    component.changeInputDate(check, currentColumn, suffix);
    const noFilt = component.noFiltersApplied;
    expect(noFilt).toBe(false);
  });

  it('should conver date value on changeInputDate', () => {
    spyOn((component as any).adminTableService, 'setDateFormat');
    const date = 'Mon Nov 12 2022 13:01:36 GMT+0200 (за східноєвропейським стандартним часом)';
    (component as any).adminTableService.setDateFormat(date);
    expect((component as any).adminTableService.setDateFormat).toHaveBeenCalledWith(
      'Mon Nov 12 2022 13:01:36 GMT+0200 (за східноєвропейським стандартним часом)'
    );
  });

  it('should conver date value on changeInputDate', () => {
    const date = 'Mon Nov 12 2022 13:01:36 GMT+0200 (за східноєвропейським стандартним часом)';
    const value = (component as any).adminTableService.setDateFormat(date);
    expect(value).toBe('2022-11-12');
  });

  it('should get checkControl on changeInputDate', () => {
    const check = true;
    const currentColumn = 'orderDate';
    const suffix = 'From';
    const checkControl = component.dateForm.get(`orderDateCheck`).value;
    component.changeInputDate(check, currentColumn, suffix);
    expect(checkControl).toBe(false);
  });

  it('should set filters', () => {
    const val = component.dateForm.value;
    component.changeInputDate(false, 'orderDate', 'From');
    expect(component.filters).toEqual(val);
  });

  it('should call all methods by clearFilters', () => {
    spyOn((component as any).adminTableService, 'setFilters');
    spyOn(component, 'setColumnsForFiltering');
    spyOn(component, 'applyFilters');
    spyOn(component.dateForm, 'reset');
    spyOn(component, 'initDateForm');
    (component as any).adminTableService.columnsForFiltering = [{ values: [{ filtered: true }] }];
    component.clearFilters();
    expect(component.setColumnsForFiltering).toHaveBeenCalledWith([{ values: [{ filtered: false }] }]);
    expect(component.applyFilters).toHaveBeenCalledTimes(1);
    expect((component as any).adminTableService.setFilters).toHaveBeenCalledWith([]);
    expect(localStorageServiceMock.removeAdminOrderFilters).toHaveBeenCalled();
    expect(localStorageServiceMock.removeAdminOrderDateFilters).toHaveBeenCalled();
    expect(component.dateForm.reset).toHaveBeenCalledTimes(1);
    expect(component.initDateForm).toHaveBeenCalledTimes(1);
  });

  it('should call initDateForm on clearFilters', () => {
    localStorageServiceMock.getAdminOrdersDateFilter = () => {
      return initDateMock;
    };
    component.clearFilters();
    expect(component.dateForm.value).toEqual(initDateMock);
  });

  it('applyFilters', () => {
    component.currentPage = 1;
    component.firstPageLoad = false;
    spyOn(component as any, 'getTable');
    component.applyFilters();
    expect(component.currentPage).toBe(0);
    expect(component.firstPageLoad).toBe(true);
    expect((component as any).getTable).toHaveBeenCalledTimes(1);
  });

  it('openColumnFilterPopup expect dialog.open shoud be call', () => {
    spyOn(component, 'applyFilters');
    spyOn(component.dialog, 'open').and.returnValue({
      afterClosed() {
        return new Observable((observer) => {});
      }
    } as any);

    component.openColumnFilterPopup({} as any, { title: { key: 'key' } });
    expect(component.dialog.open).toHaveBeenCalledTimes(1);
  });

  it('sortColumnsToDisplay expect columns.length to be 3', () => {
    component.columns = [{ title: { key: 'key' } }, { title: { key: 'gg' } }, { title: { key: 'dd' } }];
    component.displayedColumns = ['key', 'kol'];
    component.sortColumnsToDisplay();
    expect(component.columns.length).toBe(3);
  });

  it('setColumnsForFiltering', () => {
    spyOn((component as any).adminTableService, 'setColumnsForFiltering');
    component.setColumnsForFiltering('columns');
    expect((component as any).adminTableService.setColumnsForFiltering).toHaveBeenCalledWith('columns');
  });

  it('checkStatusOfOrders', () => {
    component.tableData = [{ id: 1, orderStatus: OrderStatus.DONE }];
    const Res = component.checkStatusOfOrders(1);
    expect(Res).toBe(true);
  });

  it('checkForCheckedBoxes', () => {
    const column = {
      key: 'orderStatus',
      en: 'orderStatus',
      ua: 'Статус замовлення',
      values: [
        {
          key: 'done',
          en: 'done',
          ua: 'виконано',
          filtered: true
        },
        {
          key: 'formed',
          en: 'formed',
          ua: 'сформовано',
          filtered: false
        }
      ]
    };

    const result = component.checkForCheckedBoxes(column);

    expect(result).toBe(true);
  });

  it('checkIfFilteredBy', () => {
    (component as any).adminTableService.filters = [{ orderStatus: 'done' }];
    const result = component.checkIfFilteredBy('orderStatus');

    expect(result).toBe(true);
  });
});
