import { TestBed } from '@angular/core/testing';

import { AdminCertificateService } from './admin-certificate.service';

describe('AdminCertificateService', () => {
  let service: AdminCertificateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminCertificateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
