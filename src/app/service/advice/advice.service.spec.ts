import { TestBed } from '@angular/core/testing';

import { AdviceService } from './advice.service';

describe('AdviceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AdviceService = TestBed.get(AdviceService);
    expect(service).toBeTruthy();
  });
});
