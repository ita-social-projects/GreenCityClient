import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AdminCertificateService } from './admin-certificate.service';
import { environment } from '@environment/environment';

describe('AdminCertificateService', () => {
  let httpMock: HttpTestingController;
  let service: AdminCertificateService;
  const urlMock = environment.ubsAdmin.backendUbsAdminLink + '/management';

  const certificateMock = {
    code: '1111-2222',
    monthCount: 6,
    points: 500,
    initialPointsValue: 500
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(AdminCertificateService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return certificates table', () => {
    service.getTable('code', 0, '', 5, 'DESC').subscribe((data) => {
      expect(data).toBeDefined();
    });
    const req = httpMock.expectOne(`${urlMock}/getAllCertificates?pageNumber=0&pageSize=5&search=&sortBy=code&sortDirection=DESC`);
    expect(req.request.method).toBe('GET');
    req.flush(certificateMock);
  });

  it('should create new sertificate', () => {
    service.createCertificate(certificateMock).subscribe((data) => {
      expect(data).toBeDefined();
    });
    const req = httpMock.expectOne(`${urlMock}/addCertificate`);
    expect(req.request.method).toBe('POST');
    req.flush(certificateMock);
  });
});
