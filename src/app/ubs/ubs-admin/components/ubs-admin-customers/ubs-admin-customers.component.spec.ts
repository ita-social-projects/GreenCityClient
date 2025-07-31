import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { UbsAdminCustomersComponent } from './ubs-admin-customers.component';
import { RouterTestingModule } from '@angular/router/testing';
import { TestBed, ComponentFixture, waitForAsync, fakeAsync, tick } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, ChangeDetectorRef } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommentPopUpComponent } from '../shared/components/comment-pop-up/comment-pop-up.component';
import { AdminCustomersService } from '@ubs/ubs-admin/services/admin-customers.service';
import { LocalStorageService } from 'src/app/shared/services/localstorage/local-storage.service';
import { ColumnParam } from './columnsParams';
import { ICustomerViolationTable } from '@ubs/ubs-admin/models/customer-violations-table.model';
import { ICustomerOrdersTable } from '@ubs/ubs-admin/models/customer-orders-table.model';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MatSnackBarService } from '@global-service/mat-snack-bar/mat-snack-bar.service';
import { GetCustomerTable } from 'src/app/store/actions/ubs-admin.actions';

describe('UbsAdminCustomersComponent', () => {
  let component: UbsAdminCustomersComponent;
  let fixture: ComponentFixture<UbsAdminCustomersComponent>;
  let adminCustomersServiceMock: AdminCustomersService;
  let matDialogMock: jasmine.SpyObj<MatDialog>;
  let dialogRefMock: jasmine.SpyObj<any>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBarService>;
  let mockStore: MockStore;

  const column: ColumnParam = { title: { ua: 'Заголовок', en: 'Title', key: 'titleKey' }, width: 60 };
  const chatLink = 'https://example.com';
  const userId = 'userId';
  const updatedData = 'newChatLink';
  const firstPage = {
    currentPage: 0,
    page: [{ chatId: null, userId: 39, clientName: 'Test', recipientPhone: '+380506693793', recipientEmail: 'test@gmail.com' }],
    totalElements: 2,
    totalPages: 2
  };
  const secondPage = {
    currentPage: 1,
    page: [{ chatId: null, userId: 40, clientName: 'Test 2', recipientPhone: '+380501111111', recipientEmail: 'test2@gmail.com' }],
    totalElements: 2,
    totalPages: 2
  };

  const localStorageServiceMock: LocalStorageService = jasmine.createSpyObj('LocalStorageService', [
    'getCustomer',
    'removeCurrentCustomer',
    'setCustomer',
    'getCurrentLanguage'
  ]);

  beforeEach(waitForAsync(() => {
    adminCustomersServiceMock = jasmine.createSpyObj('AdminCustomersService', [
      'getCustomers',
      'getCustomerOrders',
      'getCustomerViolations',
      'addChatLink',
      'openChat'
    ]);
    (adminCustomersServiceMock.getCustomers as jasmine.Spy).and.returnValues(of(firstPage), of(secondPage));
    adminCustomersServiceMock.getCustomerOrders = () => of({} as ICustomerOrdersTable);
    adminCustomersServiceMock.getCustomerViolations = () => of({} as ICustomerViolationTable);
    adminCustomersServiceMock.addChatLink = () => of(void 0);
    adminCustomersServiceMock.openChat = (chatUrl: string) => {
      chatUrl && window.open(chatUrl, '_blank');
    };

    matDialogMock = jasmine.createSpyObj('MatDialog', ['open']);
    dialogRefMock = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);

    snackBarSpy = jasmine.createSpyObj('MatSnackBarService', ['openSnackBar']);

    dialogRefMock.componentInstance = {
      comment: null,
      isLink: false,
      header: null
    };

    matDialogMock.open.and.returnValue(dialogRefMock);
    dialogRefMock.afterClosed.and.returnValue(of(null));

    (localStorageServiceMock.getCustomer as jasmine.Spy).and.returnValue({
      userId: '123',
      chatLink: 'https://example.com'
    });

    (localStorageServiceMock as any).languageBehaviourSubject = new BehaviorSubject('en');
    (localStorageServiceMock.getCurrentLanguage as jasmine.Spy).and.returnValue('en');

    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
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
        provideMockStore({ initialState: {} })
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsAdminCustomersComponent);
    component = fixture.componentInstance;
    mockStore = TestBed.inject(MockStore);
    spyOn(mockStore, 'dispatch');
    fixture.detectChanges();

    component.tableData = [{ userId: 'userId', titleKey: 'oldChatLink' }];
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

  describe('applyFilter', () => {
    it('should set filter value and reset current page', () => {
      const filterValueMock = 'test';
      component.currentPage = 5;
      const updateTableDataSpy = spyOn(component as any, 'updateTableData').and.callThrough();

      component.applyFilter(filterValueMock);

      expect(component.filterValue).toBe(filterValueMock);
      expect(component.currentPage).toBe(0);
      expect(updateTableDataSpy).toHaveBeenCalled();
    });
    it('applyFilter should apply filter and update the table', () => {
      const filterMock = 'user';
      const updateTableDataSpy = spyOn(component as any, 'updateTableData');
      component.applyFilter(filterMock);
      expect(component.filterValue).toEqual(filterMock);
      expect(component.currentPage).toEqual(0);
      expect(updateTableDataSpy).toHaveBeenCalled();
    });

    it('should handle empty filter value', () => {
      component.currentPage = 3;
      const updateTableDataSpy = spyOn(component as any, 'updateTableData');

      component.applyFilter('');

      expect(component.filterValue).toBe('');
      expect(component.currentPage).toBe(0);
      expect(updateTableDataSpy).toHaveBeenCalled();
    });
  });

  describe('getTable', () => {
    it('should use customerTable if available', fakeAsync(() => {
      component.currentPage = 0;
      component.customerTable = firstPage;
      const setTableDataSpy = spyOn(component as any, 'setTableData').and.callThrough();

      component['getTable']();
      tick();

      expect(setTableDataSpy).toHaveBeenCalled();
      expect(setTableDataSpy).toHaveBeenCalledWith(firstPage);
    }));

    it('should fetch data from service when there is no customerTable data', fakeAsync(() => {
      component.customerTable = undefined;
      component.currentPage = 0;
      const setTableDataSpy = spyOn(component as any, 'setTableData').and.callThrough();
      spyOn(of(secondPage), 'pipe').and.returnValue(of(secondPage));

      component['getTable']();
      tick();

      expect(adminCustomersServiceMock.getCustomers).toHaveBeenCalledWith('clientName', 0, '', '', 10, 'ASC');
      expect(mockStore.dispatch).toHaveBeenCalled();
      expect(mockStore.dispatch).toHaveBeenCalledWith(GetCustomerTable({ table: secondPage }));
      expect(adminCustomersServiceMock.getCustomers).toHaveBeenCalled();
      expect(setTableDataSpy).toHaveBeenCalledWith(secondPage);
    }));

    it('should use provided parameters', () => {
      component.currentPage = 0;
      (adminCustomersServiceMock.getCustomers as any).and.returnValue(of(firstPage));
      component['getTable']('filter', 'clientName', 'DESC');
      expect(adminCustomersServiceMock.getCustomers).toHaveBeenCalledWith('clientName', 0, '', 'filter', 10, 'DESC');
    });

    it('should use default values when parameters are empty', () => {
      component.currentPage = 0;
      (adminCustomersServiceMock.getCustomers as any).and.returnValue(of(firstPage));
      component['getTable']('', '', '');
      expect(adminCustomersServiceMock.getCustomers).toHaveBeenCalledWith('clientName', 1, '', '', 10, 'ASC');
    });
  });
  describe('setTableData', () => {
    it('should set customer table data', () => {
      const mockCustomerTable = {
        currentPage: 0,
        page: [{ chatId: null, userId: 39, clientName: 'Test', recipientPhone: '+380506693793', recipientEmail: 'test@gmail.com' }],
        totalElements: 1,
        totalPages: 1
      };

      component['setTableData'](mockCustomerTable);

      expect(component.tableData.length).toBe(1);
      expect(component.tableData[0].clientName).toBe('Test');
      expect(component.tableData).toEqual(mockCustomerTable.page);
      expect(component.dataSource.data).toEqual(mockCustomerTable.page);
      expect(component.isLoading).toBe(false);
      expect(component['totalPages']).toBe(mockCustomerTable.totalPages);
      expect(component.totalElements).toBe(mockCustomerTable.totalElements);
      expect(component.allElements).toBe(mockCustomerTable.totalElements);
      expect(component['isTableHeightSet']).toBe(false);
    });

    it('should not update allElements if already set', () => {
      component.allElements = 100;
      component['setTableData'](secondPage);
      expect(component.allElements).toBe(100);
    });

    it('should slice data based on totalElements', () => {
      const largeTable = {
        page: [
          { id: 1, clientName: 'ubs1' },
          { id: 2, clientName: 'ubs2' },
          { id: 3, clientName: 'ubs3' },
          { id: 4, clientName: 'ubs4' },
          { id: 5, clientName: 'ubs5' }
        ],
        totalPages: 1,
        totalElements: 3
      };
      component['setTableData'](largeTable as any);
      expect(component.tableData.length).toBe(3);
      expect(component.tableData).toEqual([
        { id: 1, clientName: 'ubs1' },
        { id: 2, clientName: 'ubs2' },
        { id: 3, clientName: 'ubs3' }
      ]);
    });
  });
  describe('updateTableData', () => {
    beforeEach(() => {
      component['sortingColumn'] = '';
      component['sortType'] = '';
      component.filterValue = '';
      component.currentPage = 0;
      component.tableData = [];
    });

    it('should set default sorting column when not provided', () => {
      (adminCustomersServiceMock.getCustomers as jasmine.Spy).and.returnValue(of(secondPage));
      component['updateTableData']();
      expect(component['sortingColumn']).toBe('clientName');
    });

    it('should fully execute updateTableData logic when no filters entered', fakeAsync(() => {
      (adminCustomersServiceMock.getCustomers as jasmine.Spy).and.returnValues(of(firstPage), of(secondPage));
      const updateTableDataSpy = spyOn(component as any, 'updateTableData').and.callThrough();
      component.adminTableOfCustomersSelector$ = of(firstPage);
      component.filterValue = '';
      component.currentPage = 0;
      component['updateTableData']();
      tick();

      expect(adminCustomersServiceMock.getCustomers).toHaveBeenCalledTimes(3);
      expect(component.tableData[0]).toEqual(firstPage.page[0]);
      expect(component.tableData[1]).toEqual(secondPage.page[0]);
      expect(component.tableData.length).toBe(2);
      expect(component.tableData[0].userId).toBe(39);
      expect(component.tableData[1].userId).toBe(40);
      expect(component.totalElements).toBe(2);
      expect(component['totalPages']).toBe(2);
      expect(component.currentPage).toBe(1);
      expect(component.dataSource instanceof MatTableDataSource).toBeTrue();
      expect(component.dataSource.data.length).toBe(2);
      expect(updateTableDataSpy).toHaveBeenCalledTimes(2);
    }));

    it('should append data for next pages or filtered results', () => {
      component.filterValue = 'test';
      component.tableData = [{ id: 0, clientName: 'Bodya Pavuk' }];
      (adminCustomersServiceMock.getCustomers as jasmine.Spy).and.returnValue(of(secondPage));
      component['updateTableData']();
      expect(component.tableData).toEqual([{ id: 0, clientName: 'Bodya Pavuk' }, ...secondPage.page]);
    });

    it('should handle page with current page not set to 0', () => {
      component.currentPage = 1;
      component.tableData = [{ id: 0, clientName: 'Bodya Pavuk' }];
      (adminCustomersServiceMock.getCustomers as jasmine.Spy).and.returnValue(of(secondPage));
      component['updateTableData']();
      expect(component.tableData).toEqual([{ id: 0, clientName: 'Bodya Pavuk' }, ...secondPage.page]);
    });

    it('should update totalElements and slice data when page has items', () => {
      component.tableData = [
        { id: 0, clientName: 'Bodya' },
        { id: 1, clientName: 'Pavuk' }
      ];
      (adminCustomersServiceMock.getCustomers as jasmine.Spy).and.returnValue(of(secondPage));
      component['updateTableData']();
      expect(component.totalElements).toBe(secondPage.totalElements);
      expect(component.tableData.length).toBe(2);
    });

    it('should not update totalElements when page is empty', () => {
      const emptyTableMock = {
        page: [],
        totalPages: 1,
        totalElements: 0
      };
      component.totalElements = 5;
      (adminCustomersServiceMock.getCustomers as jasmine.Spy).and.returnValue(of(emptyTableMock));
      component['updateTableData']();
      expect(component.totalElements).toBe(5);
    });

    it('should set correct properties after successful update', () => {
      (adminCustomersServiceMock.getCustomers as jasmine.Spy).and.returnValue(of(secondPage));
      component['updateTableData']();
      expect(component.dataSource.data).toEqual(component.tableData);
      expect(component['totalPages']).toBe(secondPage.totalPages);
      expect(component.isUpdate).toBe(false);
    });

    it('should dispatch store action with correct data', () => {
      (adminCustomersServiceMock.getCustomers as jasmine.Spy).and.returnValue(of(secondPage));
      component['updateTableData']();
      expect(mockStore.dispatch).toHaveBeenCalled();
      expect(mockStore.dispatch).toHaveBeenCalledWith(GetCustomerTable({ table: secondPage }));
    });

    it('should use correct service parameters', () => {
      component['sortingColumn'] = 'email';
      component.currentPage = 2;
      component['queryString'] = 'query';
      component.filterValue = 'filter';
      component.pageSize = 20;
      component['sortType'] = 'DESC';
      (adminCustomersServiceMock.getCustomers as jasmine.Spy).and.returnValue(of(secondPage));
      component['updateTableData']();
      expect(adminCustomersServiceMock.getCustomers).toHaveBeenCalledWith('email', 2, 'query', 'filter', 20, 'DESC');
    });

    it('should use default sort type when not provided', () => {
      component['sortType'] = '';
      (adminCustomersServiceMock.getCustomers as jasmine.Spy).and.returnValue(of(secondPage));
      component['updateTableData']();
      expect(adminCustomersServiceMock.getCustomers).toHaveBeenCalledWith('clientName', 0, '', '', 10, 'ASC');
    });
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

  it('should return early if userId is null', () => {
    component.openPopUp(column, 'chatLink', null);

    expect(matDialogMock.open).not.toHaveBeenCalled();
  });

  it('should open the dialog with correct configuration', () => {
    component.openPopUp(column, chatLink, userId);
    expect(matDialogMock.open).toHaveBeenCalledWith(CommentPopUpComponent, (component as any).dialogConfig);
    expect(dialogRefMock.componentInstance.comment).toBe(chatLink);
    expect(dialogRefMock.componentInstance.isLink).toBeTrue();
    expect(['Title', 'Заголовок']).toContain(dialogRefMock.componentInstance.header);
  });

  it('should do nothing if dialog closes without changes', () => {
    spyOn(adminCustomersServiceMock, 'addChatLink').and.stub();

    dialogRefMock.afterClosed.and.returnValue(of(null));
    component.openPopUp(column, chatLink, userId);

    expect(adminCustomersServiceMock.addChatLink).not.toHaveBeenCalled();
    expect(snackBarSpy.openSnackBar).not.toHaveBeenCalled();
  });

  it('should call addChatLink and show success message on dialog close with updated data', () => {
    dialogRefMock.afterClosed.and.returnValue(of(updatedData));

    spyOn(adminCustomersServiceMock, 'addChatLink').and.returnValue(of(void 0));
    spyOn(component as any, 'updateTableRow').and.callThrough();

    component.openPopUp(column, chatLink, userId);
    expect(adminCustomersServiceMock.addChatLink).toHaveBeenCalledWith(userId, updatedData);
    expect(component['updateTableRow']).toHaveBeenCalledWith(column, userId, updatedData);
    expect(snackBarSpy.openSnackBar).toHaveBeenCalledWith('successUpdateLink');
  });

  it('should show error message if addChatLink fails', () => {
    dialogRefMock.afterClosed.and.returnValue(of(updatedData));
    spyOn(adminCustomersServiceMock, 'addChatLink').and.returnValue(throwError(() => 'error'));

    component.openPopUp(column, chatLink, userId);

    expect(snackBarSpy.openSnackBar).toHaveBeenCalledWith('failUpdateLink');
  });
});
