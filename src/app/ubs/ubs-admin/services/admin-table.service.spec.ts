import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AdminTableService } from './admin-table.service';
import { environment } from '@environment/environment.js';
import { IFilteredColumn } from '../models/ubs-admin.interface';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { IFilteredColumnValue } from '../models/ubs-admin.interface';

import { UbsAdminTableComponent } from '../components/ubs-admin-table/ubs-admin-table.component';

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

  it('method changeFilters should set value to localStorageService', () => {
    let option: IFilteredColumnValue;
    option = { key: 'FORMED', ua: 'Сформовано', en: 'Formed', filtered: false };
    service.changeFilters(true, 'orderStatus', option);
    expect(localStorageService.getUbsAdminOrdersTableTitleColumnFilter()).toContain({ orderStatus: option.key });
  });

  /*it('Should open sign in modal window', () => {
      spyOn(component, 'changeDateFilters');

      const column = 'deliveryDate';

      const nativeElement = fixture.nativeElement;
      const checkbox = nativeElement.querySelector(`#${column}`);
      checkbox.dispatchEvent(new Event('checked'));

      fixture.detectChanges();

      expect(component.changeDateFilters).toHaveBeenCalledWith('sign-in');
    });/** */

  /*it('method changeInputDateFilters should set value to columnsForFiltering', () => {
    let mocked = {
      en: 'Order date',
      key: 'orderDate',
      ua: 'Дата замовлення',
      values: [
        {
          orderDateFrom: '2022-09-02',
          orderDateTo: '2022-11-03',
          filtered: true
        }
      ]
    };
    service.filters = [{ orderDateFrom: '2022-09-02', orderDateTo: '2022-11-03' }];

    service.changeInputDateFilters('2022-09-02', 'orderDate', 'From');
    expect(service.changeInputDateFilters).not.toHaveBeenCalled();
    //expect(service.columnsForFiltering).toContain(mocked);
    //expect(localStorageService.getUbsAdminOrdersTableTitleColumnFilter()).toContain({orderStatus: option.key});
  });/** */
});
