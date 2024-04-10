import { TestBed } from '@angular/core/testing';

import { FormBridgeService } from './form-bridge.service';

describe('FormBridgeService', () => {
  let service: FormBridgeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormBridgeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
