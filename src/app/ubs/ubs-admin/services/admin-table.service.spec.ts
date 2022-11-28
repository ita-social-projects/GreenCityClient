import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AdminTableService } from './admin-table.service';
import { environment } from '@environment/environment.js';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { IFilteredColumnValue } from '../models/ubs-admin.interface';
import { MatCheckboxChange } from '@angular/material/checkbox';

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

  it('should set objKeys if filters lengs 1', () => {
    service.filters = [{ filt: 'test' }];
    service.getTable('code', 0, '', 5, 'DESC');
    service.filters.forEach((el) => {
      const objKeys = Object.keys(el);
      expect(objKeys[0]).toBe('filt');
    });
  });

  it('should set objKeys if filters lengs 2', () => {
    service.filters = [{ paymentDateFrom: '2022-10-08', paymentDateTo: '2022-10-08' }];
    service.getTable('code', 0, '', 5, 'DESC');
    service.filters.forEach((el) => {
      const objKeys = Object.keys(el);
      expect(objKeys[0]).toBe('paymentDateFrom');
      expect(objKeys[1]).toBe('paymentDateTo');
    });
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

  it('method changeFilters should set value to localStorageService', () => {
    let option: IFilteredColumnValue;
    option = { key: 'FORMED', ua: 'Сформовано', en: 'Formed', filtered: false };
    service.changeFilters(true, 'orderStatus', option);
    expect(localStorageService.getUbsAdminOrdersTableTitleColumnFilter()).toContain({ orderStatus: option.key });
  });

  it('should url mock be equal url', () => {
    expect(service.url).toEqual(urlMock + '/');
  });

  it('getDateValue expect getDateValue shoud be call', () => {
    spyOn(service, 'getDateValue');
    service.getDateValue('From', 'dateColumn');
    expect(service.getDateValue).toHaveBeenCalledWith('From', 'dateColumn');
  });

  it('should convert date format by convertDate', () => {
    const date = 'Mon Nov 28 2022 13:01:36 GMT+0200 (за східноєвропейським стандартним часом)';
    spyOn(service, 'convertDate');
    service.convertDate(date);
    expect(service.convertDate).toHaveBeenCalledWith('Mon Nov 28 2022 13:01:36 GMT+0200 (за східноєвропейським стандартним часом)');
  });

  it('saveDateFilters should be call', () => {
    spyOn(service, 'saveDateFilters');
    service.saveDateFilters(true, 'dateColumn', 'From');
    expect(service.saveDateFilters).toHaveBeenCalledWith(true, 'dateColumn', 'From');
  });

  it('getDateChecked should be call', () => {
    spyOn(service, 'getDateChecked');
    service.getDateChecked('dateColumn');
    expect(service.getDateChecked).toHaveBeenCalledWith('dateColumn');
  });

  it('changeInputDateFilters should be call', () => {
    spyOn(service, 'changeInputDateFilters');
    service.changeInputDateFilters('true', 'dateColumn', 'From');
    expect(service.changeInputDateFilters).toHaveBeenCalledWith('true', 'dateColumn', 'From');
  });

  it('changeDateFilters should be call', () => {
    spyOn(service, 'changeDateFilters');
    const event = new MatCheckboxChange();
    service.changeDateFilters(event, true, 'dateColumn');
    expect(service.changeDateFilters).toHaveBeenCalledWith(event, true, 'dateColumn');
  });
});
