import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AdminCustomersService } from './admin-customers.service';
import { TestBed } from '@angular/core/testing';

describe('AdminCertificateService', () => {
  let httpMock: HttpTestingController;
  let service: AdminCustomersService;
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

  xit('should return customers table', () => {
    service.getCustomers('code', 0, 'DESC').subscribe((data) => {
      expect(data).toBeDefined();
    });
    const req = httpMock.expectOne(`${urlMock}/usersAll?page=0&columnName=code&sortingOrder=DESC`);
    expect(req.request.method).toBe('GET');
  });
});
