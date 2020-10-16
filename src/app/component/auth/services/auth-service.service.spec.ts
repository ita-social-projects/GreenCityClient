import { TestBed } from '@angular/core/testing';

import { AuthModalServiceService } from './auth-service.service';

describe('AuthServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AuthModalServiceService = TestBed.get(AuthModalServiceService);
    expect(service).toBeTruthy();
  });
});
