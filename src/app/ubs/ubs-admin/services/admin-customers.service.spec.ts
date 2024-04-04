import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AdminCustomersService } from './admin-customers.service';
import { ICustomersTable } from '../models/customers-table.model';
import { environment } from '@environment/environment';

describe('AdminCustomersService', () => {
  let httpMock: HttpTestingController;
  let service: AdminCustomersService;
  let fakeResponse: ICustomersTable;
  const urlMock = environment.ubsAdmin.backendUbsAdminLink + '/management';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(AdminCustomersService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return customers table', () => {
    fakeResponse = {
      currentPage: 0,
      page: ['fake'],
      totalElements: 10,
      totalPages: 3
    };
    service.getCustomers('code', 0, '', '', 10, 'ASC').subscribe((data) => {
      expect(data).toBeDefined();
      expect(data).toEqual(fakeResponse);
    });
    const req = httpMock.expectOne(`${urlMock}/usersAll?pageNumber=0&pageSize=10&columnName=code&&search=&sortingOrder=ASC`);
    expect(req.request.method).toBe('GET');
    req.flush(fakeResponse);
  });
});
