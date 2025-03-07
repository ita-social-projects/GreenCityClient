import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { VerifyEmailService } from './verify-email.service';

describe('VerifyEmailService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    })
  );

  it('should be created', () => {
    const service: VerifyEmailService = TestBed.inject(VerifyEmailService);
    expect(service).toBeTruthy();
  });
});
