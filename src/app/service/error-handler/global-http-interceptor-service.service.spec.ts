import { TestBed } from '@angular/core/testing';

import { GlobalHttpInterceptorServiceService } from './global-http-interceptor-service.service';

describe('GlobalHttpInterceptorServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GlobalHttpInterceptorServiceService = TestBed.get(GlobalHttpInterceptorServiceService);
    expect(service).toBeTruthy();
  });
});
