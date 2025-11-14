import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatTableModule } from '@angular/material/table';
import { UbsAdminCustomersComponent } from './ubs-admin-customers.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { ChangeDetectorRef, CUSTOM_ELEMENTS_SCHEMA, Renderer2 } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MatNativeDateModule } from '@angular/material/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommentPopUpComponent } from '../shared/components/comment-pop-up/comment-pop-up.component';
import { AdminCustomersService } from '@ubs/ubs-admin/services/admin-customers.service';
import { LocalStorageService } from 'src/app/shared/services/localstorage/local-storage.service';
import { ColumnParam, columnsParams } from './columnsParams.mock';
import { ICustomerViolationTable } from '@ubs/ubs-admin/models/customer-violations-table.model';
import { ICustomerOrdersTable } from '@ubs/ubs-admin/models/customer-orders-table.model';
import { ICustomersTable } from '@ubs/ubs-admin/models/customers-table.model';
import { provideMockStore } from '@ngrx/store/testing';
import { MatSnackBarService } from '@global-service/mat-snack-bar/mat-snack-bar.service';
import { GetCustomerTable } from 'src/app/store/actions/ubs-admin.actions';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { TableHeightService } from '../../services/table-height.service';
import { MatDatepickerModule } from '@angular/material/datepicker';

describe('UbsAdminCustomersComponent', () => {
  let component: UbsAdminCustomersComponent;
  let fixture: ComponentFixture<UbsAdminCustomersComponent>;
  let adminCustomersServiceMock: jasmine.SpyObj<AdminCustomersService>;
  let matDialogMock: jasmine.SpyObj<MatDialog>;
  let dialogRefMock: jasmine.SpyObj<any>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBarService>;
  let store: Store;
  let router: Router;
  let tableHeightServiceMock: jasmine.SpyObj<TableHeightService>;
  let rendererMock: jasmine.SpyObj<Renderer2>;

  const MOCK_CUSTOMER_DATA: ICustomersTable = {
    currentPage: 0,
    page: [
      {
        userId: 'testUser1',
        clientName: 'Test User One',
        email: 'test1@example.com',
        phoneNumber: '1234567890',
        registrationDate: '2023-01-01',
        lastOrderDate: '2023-05-15',
        number_of_orders: 5,
        violations: 0,
        currentBonuses: 100,
        chatId: 'https://chat.example.com/user1',
        address: 'Some Address 1',
        status: 'ACTIVATED'
      },
      {
        userId: 'testUser2',
        clientName: 'Test User Two',
        email: 'test2@example.com',
        phoneNumber: '0987654321',
        registrationDate: '2023-02-01',
        lastOrderDate: '2023-06-20',
        number_of_orders: 2,
        violations: 1,
        currentBonuses: 50,
        chatId: null,
        address: 'Some Address 2',
        status: 'ACTIVATED'
      }
    ],
    totalElements: 2,
    totalPages: 1
  };

  const localStorageServiceMock: LocalStorageService = jasmine.createSpyObj('LocalStorageService', [
    'getCustomer',
    'removeCurrentCustomer',
    'setCustomer',
    'getCurrentLanguage',
    'languageBehaviourSubject'
  ]);
  localStorageServiceMock.languageBehaviourSubject = new BehaviorSubject('en');

  beforeEach(waitForAsync(() => {
    adminCustomersServiceMock = jasmine.createSpyObj('AdminCustomersService', [
      'getCustomers',
      'getCustomerOrders',
      'getCustomerViolations',
      'addChatLink',
      'openChat'
    ]);
    adminCustomersServiceMock.getCustomers.and.returnValue(of(MOCK_CUSTOMER_DATA));
    adminCustomersServiceMock.getCustomerOrders.and.returnValue(of({} as ICustomerOrdersTable));
    adminCustomersServiceMock.getCustomerViolations.and.returnValue(of({} as ICustomerViolationTable));
    adminCustomersServiceMock.addChatLink.and.returnValue(of(void 0));

    matDialogMock = jasmine.createSpyObj('MatDialog', ['open']);
    dialogRefMock = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);

    snackBarSpy = jasmine.createSpyObj('MatSnackBarService', ['openSnackBar']);
    tableHeightServiceMock = jasmine.createSpyObj('TableHeightService', ['setTableHeightToContainerHeight']);
    tableHeightServiceMock.setTableHeightToContainerHeight.and.returnValue(true);

    rendererMock = jasmine.createSpyObj('Renderer2', ['listen']);
    rendererMock.listen.and.returnValue(() => {});

    dialogRefMock.componentInstance = {
      comment: null,
      isLink: false,
      header: null
    };

    matDialogMock.open.and.returnValue(dialogRefMock);
    dialogRefMock.afterClosed.and.returnValue(of(null));

    (localStorageServiceMock.getCustomer as jasmine.Spy).and.returnValue({
      userId: '123',
      chatId: 12
    });

    (localStorageServiceMock as any).languageBehaviourSubject = new BehaviorSubject('en');
    (localStorageServiceMock.getCurrentLanguage as jasmine.Spy).and.returnValue('en');

    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule,
        MatTableModule,
        SharedModule,
        TranslateModule.forRoot(),
        InfiniteScrollModule,
        MatDatepickerModule,
        MatNativeDateModule,
        ReactiveFormsModule
      ],
      declarations: [UbsAdminCustomersComponent, CommentPopUpComponent],
      providers: [
        { provide: MatSnackBarService, useValue: snackBarSpy },
        { provide: MatDialog, useValue: matDialogMock },
        { provide: AdminCustomersService, useValue: adminCustomersServiceMock },
        { provide: LocalStorageService, useValue: localStorageServiceMock },
        { provide: TableHeightService, useValue: tableHeightServiceMock },
        { provide: Renderer2, useValue: rendererMock },
        provideMockStore({
          initialState: {
            employees: {
              employeesPermissions: ['EDIT_CLIENT'],
              employees: null,
              error: null
            }
          }
        }),
        FormBuilder
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsAdminCustomersComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    router = TestBed.inject(Router);

    spyOn(store, 'dispatch').and.callThrough();
    spyOn(router, 'navigate').and.stub();

    fixture.detectChanges();

    component.tableData = [{ userId: 'userId', titleKey: 'oldChatLink' }];

    (component as any).AdminCustomersService = adminCustomersServiceMock;

    component.filterForm = new FormBuilder().group({
      registrationDateFrom: [''],
      registrationDateTo: [''],
      lastOrderDateFrom: [''],
      lastOrderDateTo: [''],
      ordersCountFrom: [''],
      ordersCountTo: [''],
      violationsFrom: [''],
      violationsTo: [''],
      bonusesFrom: [''],
      bonusesTo: ['']
    });
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });
  it('should have spy on getCustomers', () => {
    expect(jasmine.isSpy(adminCustomersServiceMock.getCustomers)).toBeTrue();

    const serviceInComponent = fixture.debugElement.injector.get(AdminCustomersService);
    expect(serviceInComponent).toBe(adminCustomersServiceMock);
    expect(jasmine.isSpy(serviceInComponent.getCustomers)).toBeTrue();
  });

  it('should set filter value, reset current page and call getTable', () => {
    const filterValueMock = 'test';
    component.currentPage = 5;
    const getTableSpy = spyOn(component as any, 'getTable');

    component.applyFilter(filterValueMock);

    expect(component.filterValue).toBe(filterValueMock);
    expect(component.currentPage).toBe(0);
    expect(getTableSpy).toHaveBeenCalled();
    expect(component.hasChange).toBeTrue();
  });

  it('detects changes', () => {
    const changeDetectorRef = fixture.debugElement.injector.get(ChangeDetectorRef);
    const detectChangesSpy = spyOn(changeDetectorRef.constructor.prototype, 'detectChanges');

    component.ngAfterViewChecked();

    expect(detectChangesSpy).toHaveBeenCalled();
  });

  it('method togglePopUp should toggle display', () => {
    component.display = 'block';
    component.togglePopUp();
    expect(component.display).toBe('none');
  });

  it('method onDeleteFilter should reset data in filterForm', () => {
    component.onDeleteFilter('bonusesFrom', 'bonusesTo');
    expect(component.filterForm.value.bonusesFrom).toBe('');
    expect(component.filterForm.value.bonusesTo).toBe('');
  });

  it('on onOpenChat should redirect to chat with a client', () => {
    const chatIdMock = 12;

    component.onOpenChat(chatIdMock);

    expect(router.navigate).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['ubs/admin', 'chat-page'], { queryParams: { chatId: chatIdMock } });
  });

  it('should call getCustomers and dispatch GetCustomerTable action on ngOnInit', () => {
    (store as any).setState({
      ubsAdmin: {
        table: MOCK_CUSTOMER_DATA
      }
    });
    const spyGetTable = spyOn<any>(component, 'getTable').and.callThrough();

    component.ngOnInit();

    expect(spyGetTable).toHaveBeenCalled();
    expect(adminCustomersServiceMock.getCustomers).toHaveBeenCalled();
    expect(store.dispatch).toHaveBeenCalledWith(GetCustomerTable({ table: MOCK_CUSTOMER_DATA }));
    expect(component.columns).toEqual(columnsParams);
    expect(component.displayedColumns.length).toBeGreaterThan(0);
  });

  it('should call getTable with correct sorting data', () => {
    spyOn<any>(component, 'getTable').and.callThrough();
    const newColumnName = 'clientName';
    const newSortingType = 'DESC';

    component.getSortingData(newColumnName, newSortingType);

    expect(component['sortingColumn']).toBe(newColumnName);
    expect(component['sortType']).toBe(newSortingType);
    expect(component.arrowDirection).toBe(newColumnName);
    expect(component.currentPage).toBe(0);
    expect((component as any)['getTable']).toHaveBeenCalled();

    component.getSortingData(newColumnName, newSortingType);
    expect(component.arrowDirection).toBeNull();
  });

  it('should correctly identify pointer columns', () => {
    const pointerColumn: ColumnParam = { title: { uk: 'Клієнт', en: 'Client Name', key: 'clientName' }, width: 100 };
    const nonPointerColumn: ColumnParam = { title: { uk: 'Дата', en: 'Date', key: 'registrationDate' }, width: 100 };

    expect(component.isPointerColumn(pointerColumn)).toBeTrue();
    expect(component.isPointerColumn(nonPointerColumn)).toBeFalse();
  });

  it('should check if key is a number', () => {
    let event = new KeyboardEvent('keydown', { key: '5' });
    expect(component.checkOnNumber(event)).toBeTrue();

    event = new KeyboardEvent('keydown', { key: 'a' });
    expect(component.checkOnNumber(event)).toBeFalse();
  });

  it('should increment number form control value', () => {
    component.filterForm.get('bonusesFrom').setValue(10);
    component.numberPlusOrMinus('bonusesFrom', true);
    expect(component.filterForm.get('bonusesFrom').value).toBe(11);
  });

  it('should decrement number form control value', () => {
    component.filterForm.get('bonusesFrom').setValue(10);
    component.numberPlusOrMinus('bonusesFrom', false);
    expect(component.filterForm.get('bonusesFrom').value).toBe(9);
  });

  it('should submit filter form and call getTable if query string changes', () => {
    spyOn<any>(component, 'getTable').and.callThrough();
    component.filterForm.get('bonusesFrom').setValue('10');
    component.submitFilterForm();
    expect((component as any)['getTable']).toHaveBeenCalled();
    expect(component['queryString']).toContain('numberOfBonuses=10');
    expect(component.currentPage).toBe(0);
  });

  it('should submit filter form with "from" and "to" values', () => {
    spyOn<any>(component, 'getTable').and.callThrough();
    component.filterForm.get('bonusesFrom').setValue('10');
    component.filterForm.get('bonusesTo').setValue('20');
    component.submitFilterForm();
    expect(component['queryString']).toContain('numberOfBonuses=10&numberOfBonuses=20');
  });

  it('should submit filter form with only "to" value (adds 0 as "from")', () => {
    spyOn<any>(component, 'getTable').and.callThrough();
    component.filterForm.get('ordersCountTo').setValue('5');
    component.submitFilterForm();
    expect(component['queryString']).toContain('numberOfOrders=0&numberOfOrders=5');
  });

  it('should not call getTable if query string does not change', () => {
    component['queryString'] = 'someQuery';
    spyOn<any>(component, 'getTable').and.callThrough();
    component.submitFilterForm();
    component['queryString'] = 'someQuery';
    expect((component as any)['getTable']).toHaveBeenCalledTimes(1);
  });

  it('should clear all filters and submit form', () => {
    component.filterForm.get('bonusesFrom').setValue('10');
    spyOn(component, 'submitFilterForm').and.callThrough();
    component.onClearFilters();
    expect(component.filterForm.get('bonusesFrom').value).toBe('');
    expect(component.submitFilterForm).toHaveBeenCalled();
  });

  it('should increment currentPage and call updateTableData on scroll', () => {
    spyOn<any>(component, 'updateTableData').and.callThrough();
    component.currentPage = 0;
    component['totalPages'] = 2;
    component.isUpdate = false;

    component.onScroll();

    expect(component.currentPage).toBe(1);
    expect((component as any)['updateTableData']).toHaveBeenCalled();
  });

  it('should not increment currentPage or call updateTableData if already updating', () => {
    spyOn<any>(component, 'updateTableData').and.stub();
    component.isUpdate = true;
    component.onScroll();
    expect(component.currentPage).toBe(0);
    expect((component as any)['updateTableData']).not.toHaveBeenCalled();
  });

  it('should not increment currentPage or call updateTableData if on last page', () => {
    spyOn<any>(component, 'updateTableData').and.stub();
    component.currentPage = 0;
    component['totalPages'] = 1;
    component.isUpdate = false;
    component.onScroll();
    expect(component.currentPage).toBe(0);
    expect((component as any)['updateTableData']).not.toHaveBeenCalled();
  });

  it('should call openPages on "Enter" key down', () => {
    spyOn(component, 'openPages').and.callThrough();
    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    spyOn(event, 'preventDefault');
    const row = MOCK_CUSTOMER_DATA.page[0];
    component.onKeyDown(event, 'clientName', row);
    expect(component.openPages).toHaveBeenCalledWith('clientName', row);
    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('should call openPages on "Space" key down', () => {
    spyOn(component, 'openPages').and.callThrough();
    const event = new KeyboardEvent('keydown', { key: ' ' });
    spyOn(event, 'preventDefault');
    const row = MOCK_CUSTOMER_DATA.page[0];
    component.onKeyDown(event, 'clientName', row);
    expect(component.openPages).toHaveBeenCalledWith('clientName', row);
    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('should set filterValue', () => {
    const filterText = 'some search';
    component.applyFilter(filterText);
    expect(component.filterValue).toBe(filterText);
  });

  it('should navigate to customer details for clientName column', () => {
    const row = MOCK_CUSTOMER_DATA.page[0];
    component.openPages('clientName', row);
    expect(localStorageServiceMock.setCustomer).toHaveBeenCalledWith(row);
    expect(router.navigate).toHaveBeenCalledWith(['ubs/admin', 'customers', 'TestUserOne']);
  });

  it('should navigate to customer orders for number_of_orders column', () => {
    const row = MOCK_CUSTOMER_DATA.page[0];
    component.openPages('number_of_orders', row);
    expect(router.navigate).toHaveBeenCalledWith(['ubs/admin', 'customerOrders', 'testUser1']);
  });

  it('should navigate to customer violations for violations column if violations exist', () => {
    const rowWithViolations = MOCK_CUSTOMER_DATA.page[1];
    component.openPages('violations', rowWithViolations);
    expect(router.navigate).toHaveBeenCalledWith(['ubs/admin', 'customerViolations', 'testUser2']);
  });

  it('should not navigate to customer violations for violations column if no violations', () => {
    const rowWithoutViolations = { ...MOCK_CUSTOMER_DATA.page[0], violations: 0 };
    component.openPages('violations', rowWithoutViolations);
    expect(router.navigate).not.toHaveBeenCalledWith(['ubs/admin', 'customerViolations', jasmine.any(String)]);
  });

  it('should update table data on successful `getCustomers` call from updateTableData', () => {
    const newPageData = [
      {
        userId: 'testUser3',
        clientName: 'Test User Three',
        email: 'test3@example.com',
        phoneNumber: '1112223333',
        registrationDate: '2023-03-01',
        lastOrderDate: '2023-07-01',
        number_of_orders: 1,
        violations: 0,
        currentBonuses: 20,
        chatLink: null,
        address: 'Some Address 3'
      }
    ];
    const nextPageCustomers: ICustomersTable = {
      currentPage: 1,
      page: newPageData,
      totalElements: 3,
      totalPages: 2
    };

    adminCustomersServiceMock.getCustomers.and.returnValue(of(nextPageCustomers));
    component.tableData = MOCK_CUSTOMER_DATA.page;
    component.currentPage = 0;
    component['sortType'] = 'ASC';

    (component as any)['updateTableData']();

    expect(component.isUpdate).toBeFalse();
    expect(component.tableData.length).toBe(MOCK_CUSTOMER_DATA.page.length + newPageData.length);
    expect(component.tableData).toEqual([...MOCK_CUSTOMER_DATA.page, ...newPageData]);
    expect(component.dataSource.data).toEqual([...MOCK_CUSTOMER_DATA.page, ...newPageData]);
    expect(component['totalPages']).toBe(nextPageCustomers.totalPages);
    expect(component.totalElements).toBe(nextPageCustomers.totalElements);
    expect(store.dispatch).toHaveBeenCalledWith(GetCustomerTable({ table: nextPageCustomers }));
  });

  it('should handle empty page in updateTableData', () => {
    const emptyPageCustomers: ICustomersTable = {
      currentPage: 1,
      page: [],
      totalElements: 2,
      totalPages: 1
    };
    adminCustomersServiceMock.getCustomers.and.returnValue(of(emptyPageCustomers));
    component.tableData = MOCK_CUSTOMER_DATA.page;
    component.currentPage = 0;
    component['sortType'] = 'ASC';

    (component as any)['updateTableData']();

    expect(component.isUpdate).toBeFalse();
    expect(component.tableData.length).toBe(MOCK_CUSTOMER_DATA.page.length);
    expect(component.tableData).toEqual(MOCK_CUSTOMER_DATA.page);
    expect(component.dataSource.data).toEqual(MOCK_CUSTOMER_DATA.page);
    expect(component['totalPages']).toBe(emptyPageCustomers.totalPages);
    expect(component.totalElements).toBe(MOCK_CUSTOMER_DATA.totalElements);
  });

  it('should set table data correctly', () => {
    const newCustomerTable: ICustomersTable = {
      currentPage: 0,
      page: [{ userId: 'new', clientName: 'New User' }],
      totalElements: 1,
      totalPages: 1
    };
    component.isLoading = true;
    component.allElements = 0;

    (component as any)['setTableData'](newCustomerTable);

    expect(component.tableData).toEqual(newCustomerTable.page);
    expect(component.dataSource.data).toEqual(newCustomerTable.page);
    expect(component.isLoading).toBeFalse();
    expect(component['totalPages']).toBe(newCustomerTable.totalPages);
    expect(component.totalElements).toBe(newCustomerTable.totalElements);
    expect(component.allElements).toBe(newCustomerTable.totalElements);
    expect(component['isTableHeightSet']).toBeFalse();
  });

  it('should set allElements once during initial load', () => {
    const newCustomerTable: ICustomersTable = {
      currentPage: 0,
      page: [{ userId: 'new', clientName: 'New User' }],
      totalElements: 1,
      totalPages: 1
    };
    component.isLoading = true;
    component.allElements = 50;

    (component as any)['setTableData'](newCustomerTable);

    expect(component.allElements).toBe(50);
  });

  it('should set displayed columns correctly', () => {
    component.columns = [
      { title: { key: 'col1', uk: 'К1', en: 'C1' }, width: 100 },
      { title: { key: 'col2', uk: 'К2', en: 'C2' }, width: 100 }
    ];
    component.displayedColumns = [];

    (component as any)['setDisplayedColumns']();

    expect(component.displayedColumns).toEqual(['col1', 'col2']);
    expect(component.columns[0].index).toBe(0);
    expect(component.columns[1].index).toBe(1);
  });

  it('should set hasChange to false when filter form resets to initial values', () => {
    (component as any)['initialFilterValues'] = { registrationDateFrom: '', bonusesFrom: '' };
    component.filterForm.get('bonusesFrom').setValue('1');
    fixture.detectChanges();

    component.filterForm.reset((component as any)['initialFilterValues']);
    fixture.detectChanges();
    expect(component.hasChange).toBeFalse();
  });

  it('should initialize filter form and filters', () => {
    component.filterForm = null;
    (component as any)['initFilterForm']();

    expect(component.filterForm).toBeInstanceOf(FormGroup);
    expect(component.filterForm.value.registrationDateFrom).toBe('');
    expect(component.filters).toEqual(component.filterForm.value);
  });

  it('should call setTableResize on window resize event', () => {
    spyOn(component as any, 'setTableResize').and.stub();
    window.dispatchEvent(new Event('resize'));

    expect((component as any)['setTableResize']).toHaveBeenCalledWith(jasmine.any(Number));
  });

  it('should set resize properties on onResizeColumn', () => {
    (component as any).matTableRef = {
      nativeElement: {
        children: [{ children: [{ getBoundingClientRect: () => ({ right: 100, width: 50 }) }] }]
      }
    };
    const event = {
      pageX: 90,
      target: { clientWidth: 60 },
      preventDefault: () => {}
    };
    spyOn(event, 'preventDefault');

    component.onResizeColumn(event, 0);

    expect(component['pressed']).toBeTrue();
    expect(component['startX']).toBe(event.pageX);
    expect(component['startWidth']).toBe(event.target.clientWidth);
    expect(component['currentResizeIndex']).toBe(0);
    expect(component['isResizingRight']).toBeTrue();
    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('should set table resize dimensions based on total width', () => {
    component.columns = [
      { title: { key: 'col1', uk: 'кол1', en: 'col1' }, width: 50 },
      { title: { key: 'col2', uk: 'кол2', en: 'col2' }, width: 150 }
    ];
    spyOn(component as any, 'setColumnWidth').and.stub();
    const tableWidth = 200;

    (component as any)['setTableResize'](tableWidth);

    expect(component.columns[0].width).toBeCloseTo(48.75);
    expect(component.columns[1].width).toBeCloseTo(146.25);
    expect((component as any)['setColumnWidth']).toHaveBeenCalledTimes(2);
  });

  it('should call applyFilter after debounce if enterPressed is false', fakeAsync(() => {
    const testValue = 'test';
    component.enterPressed = false;
    const applyFilterSpy = spyOn(component, 'applyFilter');

    component['filterSubject'].next(testValue);
    tick(1000);

    expect(applyFilterSpy).toHaveBeenCalledWith(testValue);
  }));

  it('should NOT call applyFilter if enterPressed is true, but reset it', fakeAsync(() => {
    const testValue = 'test';
    component.enterPressed = true;
    const applyFilterSpy = spyOn(component, 'applyFilter');

    component['filterSubject'].next(testValue);
    tick(1000);

    expect(applyFilterSpy).not.toHaveBeenCalled();
    expect(component.enterPressed).toBeFalse();
  }));

  it('getFilteredTable should call applyFilter immediately and set enterPressed as true if enter was pressed', () => {
    const filterMock = 'test';
    const enterClicked = true;
    const applyFilterSpy = spyOn(component, 'applyFilter');

    component.getFilteredTable(filterMock, enterClicked);

    expect(applyFilterSpy).toHaveBeenCalled();
    expect(applyFilterSpy).toHaveBeenCalledWith(filterMock);
    expect(component.enterPressed).toBeTrue();
  });
});
