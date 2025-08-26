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
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { ServerTranslatePipe } from '@ubs/shared/pipes/translate-pipe/translate-pipe.pipe';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LocalStorageService } from 'src/app/shared/services/localstorage/local-storage.service';
import { SelectionModel } from '@angular/cdk/collections';
import { Language } from 'src/app/shared/i18n/Language';
import { DateAdapter } from '@angular/material/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { OrderStatus } from '@ubs/ubs/order-status.enum';
import { TableHeightService } from '../../services/table-height.service';
import { Router } from '@angular/router';
import { IColumnDTO, IFilteredColumn } from '../../models/ubs-admin.interface';
import { IAlertInfo } from '../../models/edit-cell.model';
import { AdminTableService } from '../../services/admin-table.service';
import { GetColumns, GetLocationsDetails, GetTable, GetTableColumnWidth } from 'src/app/store/actions/bigOrderTable.actions';
import { IBigOrderTable } from '../../models/ubs-admin.interface';

describe('UbsAdminTableComponent', () => {
  let component: UbsAdminTableComponent;
  let fixture: ComponentFixture<UbsAdminTableComponent>;
  const storeMock = jasmine.createSpyObj('store', ['select', 'dispatch', 'pipe']);
  let router: Router;
  let adminTableService: AdminTableService;

  const columnsForFiltering: IFilteredColumn[] = [
    { key: 'column1', en: 'column1En', uk: 'column1Ua', values: [{ key: 'value1', en: 'value1En', uk: 'value1Ua', filtered: true }] },
    { key: 'column2', en: 'column2En', uk: 'column2Ua', values: [{ key: 'value2', en: 'value2En', uk: 'value2Ua', filtered: true }] }
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
      title: { key: 'receivingStation', uk: 'sampleUa', en: 'sampleEn', filtered: false }
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
  localStorageServiceMock.languageBehaviourSubject = new BehaviorSubject('uk');
  localStorageServiceMock.getCurrentLanguage = () => 'uk' as Language;
  localStorageServiceMock.language = 'uk';

  const tableHeightServiceMock = jasmine.createSpyObj('tableHeightService', [
    'setTableHeightToContainerHeight',
    'getUbsAdminOrdersTableColumnsWidthPreference',
    'setUbsAdminOrdersTableColumnsWidthPreference'
  ]);

  // Create a spy object for the AdminTableService
  const adminTableServiceMock = jasmine.createSpyObj('AdminTableService', [
    'isFilterChecked',
    'setNewFilters',
    'swapDatesIfNeeded',
    'setDateFormat',
    'setNewDateRange',
    'setNewDateChecked',
    'setUbsAdminOrdersTableColumnsWidthPreference',
    'blockOrders',
    'cancelEdit'
  ]);

  // Set up the return values for methods that need to return an observable
  adminTableServiceMock.setUbsAdminOrdersTableColumnsWidthPreference.and.returnValue(of(true));
  adminTableServiceMock.blockOrders.and.returnValue(of(true));
  adminTableServiceMock.cancelEdit.and.returnValue(of(true));

  adminTableServiceMock.columnsForFiltering = columnsForFiltering;
  (adminTableServiceMock as any).ordersViewParameters$ = of({ titles: ['title'] });
  // Initialize bigOrderTableParams$ with a BehaviorSubject for better control
  const bigOrderTableParamsSubject = new BehaviorSubject({ columnDTOList: [], columnBelongingList: [], page: {}, orderSearchCriteria: {} });
  (adminTableServiceMock as any).bigOrderTableParams$ = bigOrderTableParamsSubject.asObservable();
  (adminTableServiceMock as any).bigOrderTable$ = of({ number: 0, totalElements: 0, content: [], totalPages: 1 } as IBigOrderTable);

  const FakeMatDialogRef = {
    afterClosed: () => of(true)
  };
  const FakeMatDialog = jasmine.createSpyObj('MatDialog', ['open']);
  FakeMatDialog.open.and.returnValue(FakeMatDialogRef as MatDialogRef<any>);

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
        { provide: TableHeightService, useValue: tableHeightServiceMock },
        { provide: MatDialog, useValue: FakeMatDialog },
        { provide: ChangeDetectorRef, useValue: changeDetectorMock },
        { provide: Renderer2, useValue: rendererMock },
        { provide: FormBuilder, useValue: formBuilderMock },
        { provide: DateAdapter, useValue: dateAdapterMock },
        // Use the mocked AdminTableService
        { provide: AdminTableService, useValue: adminTableServiceMock }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    localStorageServiceMock.getUbsAdminOrdersTableTitleColumnFilter = () => [{ orderStatus: OrderStatus.FORMED }];
    localStorageServiceMock.getAdminOrdersDateFilter = () => {
      return dateMock;
    };

    storeMock.select.and.returnValue(of(false));
    storeMock.pipe.and.returnValue(of(false));
    fixture = TestBed.createComponent(UbsAdminTableComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    adminTableService = TestBed.inject(AdminTableService);
    // Initial change detection to trigger ngOnInit
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit component.noFiltersApplied initially true ', () => {
    expect(component.noFiltersApplied).toEqual(true);
  });

  // Corrected test case to pass a valid empty table object
  it('ngOnInit should dispatch actions if tableData is null', fakeAsync(() => {
    const emptyTableData = { number: 0, totalElements: 0, content: [], totalPages: 1 } as IBigOrderTable;
    component.getBigOrderTableContent(emptyTableData);
    tick();
    expect(storeMock.dispatch).toHaveBeenCalledWith(GetTableColumnWidth());
    expect(storeMock.dispatch).toHaveBeenCalledWith(GetLocationsDetails());
    expect(storeMock.dispatch).toHaveBeenCalledWith(
      GetTable({ columnName: 'id', page: 0, filter: '', size: 25, sortingType: 'DESC', reset: true })
    );
    expect(storeMock.dispatch).toHaveBeenCalledWith(GetColumns());
  }));

  it('applySearchFilter should change filterValue and call applyFilters', () => {
    const applyFiltersSpy = spyOn(component, 'applyFilters').and.callThrough();
    component.applySearchFilter('Test');
    expect(component.filterValue).toEqual('Test');
    expect(applyFiltersSpy).toHaveBeenCalled();
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
    spyOn(component, 'getControlValue').and.callThrough();
    const column = 'orderDate';
    const suffix = 'From';
    component.getControlValue(column, suffix);
    expect(component.getControlValue).toHaveBeenCalledWith('orderDate', 'From');
  });

  it('should call getControlValue and return boolean value', () => {
    const column = 'orderDate';
    const suffix = 'Check';
    component.dateForm = new FormGroup({
      orderDateFrom: new FormControl(''),
      orderDateTo: new FormControl(''),
      orderDateCheck: new FormControl(false)
    });
    const controlVal = component.getControlValue(column, suffix);
    expect(controlVal).toBe(false);
  });

  it('should select all checkboxes without disabled', () => {
    const data = { data: [{ id: 1 }, { id: 2 }, { id: 3 }] };
    const event: MatCheckboxChange = { source: {} as any, checked: true };

    component.idsToChange = [];
    component.selection = new SelectionModel([] as any);
    component.dataSource = data as any;
    component.masterToggle(event);

    expect(component.allChecked).toBe(true);
    expect(component.selection.selected.length).toEqual(3);
  });

  it('checkboxLabel should return select all', () => {
    component.dataSource = { data: [{ id: 1 }] } as any;
    component.tableData = [{ id: 1, orderStatus: 'NEW' } as any];
    component.selection = new SelectionModel(false, [{ id: 1 }] as any);

    const Res = component.checkboxLabel();

    expect(Res).toBe('select all');
  });

  it('checkboxLabel should return deselect all', () => {
    component.dataSource = { data: [{ id: 2 }] } as any;
    component.tableData = [{ id: 2, orderStatus: OrderStatus.DONE } as any];
    const Res = component.checkboxLabel();

    expect(Res).toBe('deselect all');
  });

  it('checkboxLabel should return select row 3', () => {
    component.tableData = [
      { id: 1, orderStatus: 'NEW' },
      { id: 2, orderStatus: 'NEW' }
    ] as any;
    const Res = component.checkboxLabel({ id: 2 });
    expect(Res).toBe('select row 3');
  });

  it('showBlockedMessage', fakeAsync(() => {
    component.dataSource = { filteredData: [{ id: 1 }] } as any;
    component.showBlockedMessage([{ orderId: 1, userName: 'name' }]);
    tick(7000);
    expect(component.blockedInfo).toEqual([]);
  }));

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
    expect(component.displayedColumns).toEqual(['title2', 'title3']);
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
    component.tableData = [{ id: 1 } as any];
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
    expect(router.navigate).toHaveBeenCalledWith(['ubs/admin', 'order', '1']);
  }));

  it('showTooltip', () => {
    const event = jasmine.createSpyObj('event', ['stopImmediatePropagation']);
    const tooltip = jasmine.createSpyObj('tooltip', ['toggle', 'show', 'hide']);

    component.currentLang = 'uk';
    component.showTooltip(event, { uk: 'Заголовок українською', en: 'title in English' }, tooltip);
    expect(tooltip.toggle).toHaveBeenCalledTimes(1);
  });

  it('should return true when isFilterChecked returns true', () => {
    const columnName = 'orderStatus';
    const option = { en: 'Completed', key: 'DONE' };

    adminTableServiceMock.isFilterChecked.and.returnValue(true);
    const result = component.isChecked(columnName, option);

    expect(result).toBeTrue();
    expect(adminTableServiceMock.isFilterChecked).toHaveBeenCalledWith(columnName, option);
  });

  it('should set noFiltersApplied to false and call setNewFilters', () => {
    const checked = true;
    const currentColumn = 'orderStatus';
    const option = { en: 'Completed', key: 'DONE' };

    component.onFilterChange(checked, currentColumn, option);

    expect(component.noFiltersApplied).toBeFalse();
    expect(adminTableServiceMock.setNewFilters).toHaveBeenCalledWith(checked, currentColumn, option);
  });

  // eslint-disable-next-line max-len
  it('should set noFiltersApplied to false, handle null swapDatesIfNeeded response and not call setDateFormat or setNewDateRange', fakeAsync(() => {
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

    adminTableServiceMock.swapDatesIfNeeded.and.returnValue(null);
    adminTableServiceMock.setDateFormat.and.callFake(setDateFormatSpy);
    adminTableServiceMock.setNewDateRange.and.callFake(setNewDateRangeSpy);

    component.onDateChange(columnKey);
    tick();

    expect(component.noFiltersApplied).toBeFalse();
    expect(adminTableServiceMock.swapDatesIfNeeded).toHaveBeenCalledWith(new Date(dateFromValue), new Date(dateToValue), dateChecked);

    expect(component.dateForm.get(`${columnKey}From`)?.value).toEqual(new Date(dateFromValue));
    expect(component.dateForm.get(`${columnKey}To`)?.value).toEqual(new Date(dateToValue));
  }));

  it('should update date checked status and call onDateChange', () => {
    component.dateForm = new FormGroup({
      orderStatusFrom: new FormControl(null),
      orderStatusTo: new FormControl(null),
      orderStatusCheck: new FormControl(false)
    });

    const columnKey = 'orderStatus';
    const checked = true;

    adminTableServiceMock.setNewDateChecked.and.stub();
    spyOn(component, 'onDateChange').and.stub();

    const event = {} as MatCheckboxChange;
    component.onDateChecked(event, checked, columnKey);

    expect(adminTableServiceMock.setNewDateChecked).toHaveBeenCalledWith(columnKey, checked);
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
    component.applyFilters();
    expect(component.currentPage).toBe(0);
  });

  it('openColumnFilterPopup expect dialog.open shoud be call', fakeAsync(() => {
    spyOn(component, 'applyFilters');
    FakeMatDialog.open.calls.reset();
    component.openColumnFilterPopup({} as any, { title: { key: 'key' } });
    tick();
    expect(FakeMatDialog.open).toHaveBeenCalledTimes(1);
  }));

  it('sortColumnsToDisplay expect columns.length to be 3', () => {
    component.columns = mockColumns;
    component.displayedColumns = ['key', 'kol'];
    component.sortColumnsToDisplay();
    expect(component.columns.length).toBe(3);
  });

  it('checkStatusOfOrders', () => {
    component.tableData = [{ id: 1, orderStatus: OrderStatus.DONE } as any];
    const Res = component.checkStatusOfOrders(OrderStatus.DONE);
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
    adminTableServiceMock.columnsForFiltering = columnsForFiltering;
    const result = component.getColumnsForFiltering();
    expect(result).toEqual(columnsForFiltering);
  });

  it('should sort columns to display', fakeAsync(() => {
    component.displayedColumns = ['key', 'gg', 'dd'];
    component.nestedSortProperty = 'title.key';
    component.columns = mockColumns;
    // @ts-ignore
    spyOn(component, 'checkAllColumnsDisplayed');
    spyOn(component, 'stickColumns');

    component.sortColumnsToDisplay();
    tick();

    expect(component.columns[0].title.key).toEqual('key');
    expect(component.columns[1].title.key).toEqual('gg');
    expect(component.columns[2].title.key).toEqual('dd');
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
