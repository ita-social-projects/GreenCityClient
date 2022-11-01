import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AdminTableService } from './admin-table.service';
import { environment } from '@environment/environment.js';
import { IFilteredColumn } from '../models/ubs-admin.interface';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';

describe('AdminTableService', () => {
  let httpMock: HttpTestingController;
  let service: AdminTableService;
  let localStorageService: LocalStorageService;
  const urlMock = environment.ubsAdmin.backendUbsAdminLink + '/management';
  const isdMock = [1, 2, 3];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(AdminTableService);
    localStorageService = TestBed.inject(LocalStorageService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return table', () => {
    service.getTable('code', 0, '', 5, 'DESC').subscribe((data) => {
      expect(data).toBeDefined();
    });
    const req = httpMock.expectOne(`${urlMock}/bigOrderTable?sortBy=code&pageNumber=0&pageSize=5&sortDirection=DESC`);
    expect(req.request.method).toBe('GET');
  });

  it('should return columns', () => {
    service.getColumns().subscribe((data) => {
      expect(data).toBeDefined();
    });
    const req = httpMock.expectOne(`${urlMock}/tableParams`);
    expect(req.request.method).toBe('GET');
  });

  it('blockOrders should be called', () => {
    service.blockOrders(isdMock).subscribe((data) => {
      expect(data).toBeDefined();
    });
    const req = httpMock.expectOne(`${urlMock}/blockOrders`);
    expect(req.request.method).toBe('PUT');
  });

  it('should put data according to order id and column', () => {
    service.postData([3000], 'orderStatus', 'Changed').subscribe((data) => {
      expect(data).toBeDefined();
    });
    const req = httpMock.expectOne(`${urlMock}/changingOrder`);
    expect(req.request.method).toBe('PUT');
  });

  it('cancelEdit should be called', () => {
    service.cancelEdit(isdMock).subscribe((data) => {
      expect(data).toBeDefined();
    });
    const req = httpMock.expectOne(`${urlMock}/unblockOrders`);
    expect(req.request.method).toBe('PUT');
  });

  it('should return [] when howChangeCell is called', () => {
    const change = service.howChangeCell(true, [], null);
    expect(change).toEqual([]);
  });
  it('should return group with numbers when howChangeCell is called', () => {
    const change = service.howChangeCell(false, [1, 2], null);
    expect(change).toEqual([1, 2]);
  });
  it('should return singhle number when howChangeCell is called', () => {
    const change = service.howChangeCell(false, [], 3);
    expect(change).toEqual([3]);
  });

  it('should return column equal to table names', () => {
    const columns = [
      'deliveryDate',
      'responsibleDriverId',
      'responsibleNavigatorId',
      'responsibleCallerId',
      'responsibleLogicManId',
      'orderStatus'
    ];
    const mockedColumns = [
      'dateOfExport',
      'responsibleDriver',
      'responsibleNavigator',
      'responsibleCaller',
      'responsibleLogicMan',
      'orderStatus'
    ];

    columns.forEach((column) => {
      const change = service.changeColumnNameEqualToTable(column);
      expect(change).toEqual(mockedColumns[columns.indexOf(column)]);
    });
  });

  it('should return column equal to endpont names', () => {
    const columns = [
      'dateOfExport',
      'responsibleDriver',
      'responsibleNavigator',
      'responsibleCaller',
      'responsibleLogicMan',
      'orderStatus'
    ];
    const mockedColumns = [
      'deliveryDate',
      'responsibleDriverId',
      'responsibleNavigatorId',
      'responsibleCallerId',
      'responsibleLogicManId',
      'orderStatus'
    ];

    columns.forEach((column) => {
      const change = service.changeColumnNameEqualToEndPoint(column);
      expect(change).toEqual(mockedColumns[columns.indexOf(column)]);
    });
  });

  it('should set as checked column', () => {
    const column = 'orderStatus';
    service.columnsForFiltering = [
      {
        en: 'Order status',
        key: 'orderStatus',
        ua: 'Статус замовлення',
        values: [
          { en: 'Formed', filtered: false, key: 'FORMED', ua: 'Сформовано' },
          { en: 'Canceled', filtered: false, key: 'CANCELED', ua: 'Скасовано' },
          { en: 'Completed', filtered: false, key: 'COMPLETED', ua: 'Завершено' }
        ]
      }
    ];

    const currentColumnDateFilter = service.columnsForFiltering.find((col) => {
      return col.key === column;
    });
    service.setDateCheckedFromStorage(column);
    expect(currentColumnDateFilter.values[0].filtered).toBeTruthy();
  });

  it('should set data to local storage', () => {
    const mockedData = [{ orderStatus: 'FORMED' }, { deliveryDateTo: '2022-05-01', deliveryDateFrom: '2021-05-01' }];

    localStorageService.setUbsAdminOrdersTableTitleColumnFilter(mockedData);
    expect(localStorageService.getUbsAdminOrdersTableTitleColumnFilter()).toEqual(mockedData);
  });

  it('should return howChangeCell to be empty array', () => {
    const change = service.howChangeCell(true, [], 3);
    expect(change).toEqual([]);
  });

  it('should return howChangeCell to be  group', () => {
    const change = service.howChangeCell(false, [1, 2], 3);
    expect(change).toEqual([1, 2]);
  });

  it('should return howChangeCell to be single', () => {
    const change = service.howChangeCell(false, [], 3);
    expect(change).toEqual([3]);
  });
});
