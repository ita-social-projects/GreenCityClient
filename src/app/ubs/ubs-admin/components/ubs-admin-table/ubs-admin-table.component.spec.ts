import { MatMenuModule } from '@angular/material/menu';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CdkTableModule } from '@angular/cdk/table';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from 'src/app/shared/shared.module';
import { UbsAdminTableComponent } from './ubs-admin-table.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { TranslateModule } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA, Renderer2, ChangeDetectorRef } from '@angular/core';
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
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { OrderStatus } from 'src/app/ubs/ubs/order-status.enum';
import { TableHeightService } from '../../services/table-height.service';
import { Router } from '@angular/router';
import { IColumnDTO, IFilteredColumn } from '../../models/ubs-admin.interface';
import { IAlertInfo } from '../../models/edit-cell.model';
import { AdminTableService } from '../../services/admin-table.service';

xdescribe('UbsAdminTableComponent', () => {
  let component: UbsAdminTableComponent;
  let fixture: ComponentFixture<UbsAdminTableComponent>;
  const storeMock = jasmine.createSpyObj('store', ['select', 'dispatch', 'pipe']);
  let router: Router;
  let adminTableService: AdminTableService;

  const columnsForFiltering: IFilteredColumn[] = [
    { key: 'column1', en: 'column1En', ua: 'column1Ua', values: [{ key: 'value1', en: 'value1En', ua: 'value1Ua', filtered: true }] },
    { key: 'column2', en: 'column2En', ua: 'column2Ua', values: [{ key: 'value2', en: 'value2En', ua: 'value2Ua', filtered: true }] }
  ];
  const mockColumns = [{ title: { key: 'key' } }, { title: { key: 'gg' } }, { title: { key: 'dd' } }] as IColumnDTO[];
  const mockColumnDTO: IColumnDTO[] = [
    {
      checked: [],
      columnBelonging: 'sampleColumnBelonging',
      editType: 'sampleEditType',
      filtered: false,
      index: 0,
      sticky: false,
      titleForSorting: 'sampleTitleForSorting',
      visible: true,
      weight: 0,
      title: { key: 'receivingStation', ua: 'sampleUa', en: 'sampleEn', filtered: false }
    }
  ];
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

  beforeEach(waitForAsync(() => {
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
    localStorageServiceMock.getUbsAdminOrdersTableTitleColumnFilter = () => [{ orderStatus: OrderStatus.FORMED }];

    localStorageServiceMock.getAdminOrdersDateFilter = () => {
      return dateMock;
    };
    adminTableService = TestBed.inject(AdminTableService);
    storeMock.select = () => of(false);
    storeMock.pipe = () => of(false);
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
    component.bigOrderTableParams$.subscribe(() => {
      expect(component.tableViewHeaders).toEqual(['columnBelongingList']);
      expect(component.displayedColumnsViewTitles).toEqual(['key']);
      expect(component.setColumnsForFiltering).toHaveBeenCalledTimes(1);
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

  it('should call getControlValue and return boolean value', () => {
    const column = 'orderDate';
    const suffix = 'Check';
    const controlVal = component.getControlValue(column, suffix);
    expect(controlVal).toBe(false);
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
    component.columns = [{ title: { key: 'title1' } }, { title: { key: 'title2' } }, { title: { key: 'title3' } }] as IColumnDTO[];
    component.isAllColumnsDisplayed = true;
    component.displayedColumns.length = 4;
    component.displayedColumns = ['title1', 'title2', 'title3'];
    component.changeColumns(false, 'title2', 2);
    expect(component.isAllColumnsDisplayed).toBe(false);
  });

  it('sortColumnsToDisplay expect to filter columns when box is unchecked', () => {
    const expected = [{ title: { key: 'title1' } }, { title: { key: 'title2' } }, { title: { key: 'title3' } }] as IColumnDTO[];
    component.columns = expected;
    component.displayedColumns = ['title1', 'title2', 'title3'];
    component.changeColumns(false, 'title1', 1);
    component.sortColumnsToDisplay();
    for (let i = 0; i < component.columns.length; i++) {
      expect(component.columns[i].title.key).toEqual(expected[i].title.key);
    }
  });

  it('changeColumns expect to add column when box is checked ', () => {
    component.columns = [{ title: { key: 'title1' } }, { title: { key: 'title2' } }, { title: { key: 'title4' } }] as IColumnDTO[];
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

  it('getSortingData', () => {
    component.arrowDirection = '';
    component.filterValue = 'filterValue';
    component.getSortingData('columnName', 'sortingType');
    expect(component.arrowDirection).toBe('columnName');
  });

  it('onScroll', () => {
    spyOn(component, 'updateTableData');
    component.isUpdate = false;
    component.currentPage = 0;
    component.totalPages = 2;
    component.onScroll();
    expect(component.updateTableData).toHaveBeenCalledTimes(1);
    expect(component.currentPage).toBe(1);
  });

  it('editDetails', () => {
    spyOn(component.dataForPopUp, 'push');
    component.displayedColumnsView = mockColumnDTO;
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

  it('cancelEditCell ', () => {
    component.idsToChange = [1];
    component.allChecked = true;
    component.cancelEditCell([1, 2]);
    expect(component.idsToChange).toEqual([]);
    expect(component.allChecked).toBe(false);
  });

  it('closeAlertMess expect blockedInfo to be empty ', () => {
    component.blockedInfo = [{ orderId: 1, userName: 'name}' }];
    component.closeAlertMess();
    expect(component.blockedInfo).toEqual([]);
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

  it('should return true when isFilterChecked returns true', () => {
    const columnName = 'orderStatus';
    const option = { en: 'Completed', key: 'DONE' };

    spyOn(adminTableService, 'isFilterChecked').and.returnValue(true);
    const result = component.isChecked(columnName, option);

    expect(result).toBeTrue();
    expect(adminTableService.isFilterChecked).toHaveBeenCalledWith(columnName, option);
  });

  it('should set noFiltersApplied to false and call setNewFilters', () => {
    const checked = true;
    const currentColumn = 'orderStatus';
    const option = { en: 'Completed', key: 'DONE' };

    spyOn(adminTableService, 'setNewFilters');
    component.onFilterChange(checked, currentColumn, option);

    expect(component.noFiltersApplied).toBeFalse();
    expect(adminTableService.setNewFilters).toHaveBeenCalledWith(checked, currentColumn, option);
  });

  it('should set noFiltersApplied to false, handle null swapDatesIfNeeded response, and not call setDateFormat or setNewDateRange', () => {
    component.dateForm = new FormGroup({
      orderStatusFrom: new FormControl(null),
      orderStatusTo: new FormControl(null),
      orderStatusCheck: new FormControl(true)
    });

    const columnKey = 'orderStatus';
    const dateFromValue = '2024-09-17';
    const dateToValue = '2024-09-18';
    const dateChecked = true;

    spyOn(component, 'getControlValue').and.callFake((key: string, type: string) => {
      if (type === 'From') {
        return dateFromValue;
      }
      if (type === 'To') {
        return dateToValue;
      }
      if (type === 'Check') {
        return dateChecked;
      }
      return null;
    });
    const setDateFormatSpy = jasmine.createSpy('setDateFormat');
    const setNewDateRangeSpy = jasmine.createSpy('setNewDateRange');

    spyOn(adminTableService, 'swapDatesIfNeeded').and.returnValue(null);
    spyOn(adminTableService, 'setDateFormat').and.callFake(setDateFormatSpy);
    spyOn(adminTableService, 'setNewDateRange').and.callFake(setNewDateRangeSpy);

    component.onDateChange(columnKey);

    expect(component.noFiltersApplied).toBeFalse();
    expect(adminTableService.swapDatesIfNeeded).toHaveBeenCalledWith(new Date(dateFromValue), new Date(dateToValue), dateChecked);

    expect(component.dateForm.get(`${columnKey}From`)?.value).toEqual(new Date(dateFromValue));
    expect(component.dateForm.get(`${columnKey}To`)?.value).toEqual(new Date(dateToValue));
    expect(setDateFormatSpy).toHaveBeenCalled();
    expect(setNewDateRangeSpy).toHaveBeenCalled();
  });

  it('should update date checked status and call onDateChange', () => {
    component.dateForm = new FormGroup({
      orderStatusFrom: new FormControl(null),
      orderStatusTo: new FormControl(null),
      orderStatusCheck: new FormControl(false)
    });

    const columnKey = 'orderStatus';
    const checked = true;

    spyOn(adminTableService, 'setNewDateChecked');
    spyOn(component, 'onDateChange');

    const event = {} as MatCheckboxChange;
    component.onDateChecked(event, checked, columnKey);

    expect(adminTableService.setNewDateChecked).toHaveBeenCalledWith(columnKey, checked);
    expect(component.onDateChange).toHaveBeenCalledWith(columnKey);
  });

  it('should discard date changes and call onDateChange', () => {
    component.dateForm = new FormGroup({
      orderStatusFrom: new FormControl('2024-09-18'),
      orderStatusTo: new FormControl('2024-09-20')
    });

    spyOn(component, 'onDateChange');
    const event = new Event('click');

    component.discardDateChanges(event, 'orderStatus', 'from');
    expect(component.dateForm.get('orderStatusFrom')?.value).toBe('');
    expect(component.dateForm.get('orderStatusTo')?.value).toBe('2024-09-20');
    expect(component.onDateChange).toHaveBeenCalledWith('orderStatus');

    component.discardDateChanges(event, 'orderStatus', 'to');
    expect(component.dateForm.get('orderStatusFrom')?.value).toBe('');
    expect(component.dateForm.get('orderStatusTo')?.value).toBe('');
    expect(component.onDateChange).toHaveBeenCalledWith('orderStatus');
  });

  it('should set dateForm values from local storage if available', () => {
    spyOn(localStorageServiceMock, 'getAdminOrdersDateFilter').and.returnValue(initDateMock);
    component.initDateForm();
    expect(component.dateForm.value).toEqual(initDateMock);
  });

  it('applyFilters', () => {
    component.currentPage = 1;
    component.firstPageLoad = false;
    component.applyFilters();
    expect(component.currentPage).toBe(0);
    expect(component.firstPageLoad).toBe(true);
  });

  it('openColumnFilterPopup expect dialog.open shoud be call', () => {
    spyOn(component, 'applyFilters');
    spyOn(component.dialog, 'open').and.returnValue({
      afterClosed() {
        return new Observable(() => {});
      }
    } as any);

    component.openColumnFilterPopup({} as any, { title: { key: 'key' } });
    expect(component.dialog.open).toHaveBeenCalledTimes(1);
  });

  it('sortColumnsToDisplay expect columns.length to be 3', () => {
    component.columns = mockColumns;
    component.displayedColumns = ['key', 'kol'];
    component.sortColumnsToDisplay();
    expect(component.columns.length).toBe(3);
  });

  it('checkStatusOfOrders', () => {
    component.tableData = [{ id: 1, orderStatus: OrderStatus.DONE }];
    const Res = component.checkStatusOfOrders(1);
    expect(Res).toBe(true);
  });

  it('should reset column widths to default', () => {
    const defaultColumnsWidth = new Map();
    defaultColumnsWidth.set('address', '100px');
    defaultColumnsWidth.set('city', '200px');
    component.defaultColumnsWidth = defaultColumnsWidth;
    component.resetDefaultWidth();
    expect(component.columnsWidthPreference).toEqual(defaultColumnsWidth);
  });
  it('should set isTimePickerOpened', () => {
    component.setIsTimePickerOpened(true);
    expect(component.isTimePickerOpened).toBeTruthy();

    component.setIsTimePickerOpened(false);
    expect(component.isTimePickerOpened).toBeFalsy();
  });

  it('should clear blockedInfo array', () => {
    component.blockedInfo = [{ orderId: 1, userName: 'name' }];
    component.closeAlertMess();
    expect(component.blockedInfo).toEqual([]);
  });

  it('should set blockedInfo', () => {
    const blockedInfo: IAlertInfo[] = [{ orderId: 1, userName: 'name' }];
    component.blockedInfo = blockedInfo;
    expect(component.blockedInfo).toEqual(blockedInfo);
  });

  it('should get columns for filtering', () => {
    adminTableService.columnsForFiltering = columnsForFiltering;
    const result = component.getColumnsForFiltering();
    expect(result).toEqual(columnsForFiltering);
  });

  it('should sort columns to display', fakeAsync(() => {
    component.displayedColumns = ['key', 'gg', 'dd'];
    component.nestedSortProperty = 'title.key';
    component.columns = mockColumns;
    spyOn(component, 'applyColumnsWidthPreference');
    spyOn(component, 'checkAllColumnsDisplayed');
    spyOn(component, 'stickColumns');

    component.sortColumnsToDisplay();
    tick();

    expect(component.columns[0].title.key).toEqual('key');
    expect(component.columns[1].title.key).toEqual('gg');
    expect(component.columns[2].title.key).toEqual('dd');
    expect(component.applyColumnsWidthPreference).toHaveBeenCalled();
    expect(component.checkAllColumnsDisplayed).toHaveBeenCalled();
    expect(component.stickColumns).toHaveBeenCalled();
  }));

  it('should process blockedInfo and reset it after 7 seconds', fakeAsync(() => {
    const info: IAlertInfo[] = [
      { userName: 'user1', orderId: 1 },
      { userName: 'user1', orderId: 2 },
      { userName: 'user2', orderId: 3 }
    ];

    component.dataSource = new MatTableDataSource([{ id: 1 }, { id: 2 }, { id: 3 }]);
    component.selection = jasmine.createSpyObj('selection', ['deselect']);
    component.idsToChange = [1, 2, 3];

    component.showBlockedMessage(info);

    tick(7000);
    expect(component.blockedInfo).toEqual([]);
  }));
});
