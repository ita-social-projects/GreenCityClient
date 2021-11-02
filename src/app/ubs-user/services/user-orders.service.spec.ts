import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserOrdersService } from './user-orders.service';

describe('UserOrdersService', () => {
  let httpMock: HttpTestingController;
  const url = 'https://greencity-ubs.azurewebsites.net/ubs/client';
  let service: UserOrdersService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(UserOrdersService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return all users orders on ua language', () => {
    const lang = 1;
    service.getAllUserOrders().subscribe((data) => {
      expect(data).toBeDefined();
    });
    const req = httpMock.expectOne(`${url}/get-all-orders-data/${lang}`);
    expect(req.request.method).toBe('GET');
  });
});
