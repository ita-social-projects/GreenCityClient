import { TestBed } from '@angular/core/testing';

import { CheckTokenService } from './check-token.service';

describe('CheckTokenService', () => {
  let service: CheckTokenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CheckTokenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
