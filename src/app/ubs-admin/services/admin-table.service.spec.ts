import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AdminTableService } from './admin-table.service';

describe('AdminTableService', () => {
  let httpMock: HttpTestingController;
  let service: AdminTableService;
  const urlMock = 'https://greencity-ubs.azurewebsites.net/ubs/management';
  const isdMock = [1, 2, 3];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(AdminTableService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return table', () => {
    service.getTable('code', 0, 5, 'DESC').subscribe((data) => {
      expect(data).toBeDefined();
    });
    const req = httpMock.expectOne(`${urlMock}/bigOrderTable?sortBy=code&pageNumber=0&pageSize=5&sortDirection=DESC`);
    expect(req.request.method).toBe('GET');
  });

  it('should return columns', () => {
    service.getColumns().subscribe((data) => {
      expect(data).toBeDefined();
    });
    const req = httpMock.expectOne(`${urlMock}/tableParams/0`);
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
});
