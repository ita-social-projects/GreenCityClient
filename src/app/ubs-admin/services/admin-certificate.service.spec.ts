import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AdminCertificateService } from './admin-certificate.service';

describe('AdminCertificateService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    })
  );

  it('should be created', () => {
    const service: AdminCertificateService = TestBed.inject(AdminCertificateService);
    expect(service).toBeTruthy();
  });
});
