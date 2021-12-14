import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AdminCustomersService } from './admin-customers.service';
import { ICustomersTable } from '../models/customers-table.model';

describe('AdminCertificateService', () => {
  let httpMock: HttpTestingController;
  let service: AdminCustomersService;
  let fakeResponse: ICustomersTable;
  const urlMock = 'https://greencity-ubs.azurewebsites.net/ubs/management';

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
      currentPage: 1,
      page: ['fake'],
      totalElements: 2,
      totalPages: 3
    };
    service.getCustomers('code', 0, 'DESC').subscribe((data) => {
      expect(data).toBeDefined();
      expect(data).toEqual(fakeResponse);
    });
    const req = httpMock.expectOne(`${urlMock}/usersAll?page=0&columnName=code&DESC&sortingOrder=undefined`);
    req.flush(fakeResponse);
    expect(req.request.method).toBe('GET');
  });
});
