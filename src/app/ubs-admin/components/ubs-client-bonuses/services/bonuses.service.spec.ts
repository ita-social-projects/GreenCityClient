import { TestBed } from '@angular/core/testing';

import { BonusesService } from './bonuses.service';

describe('BonusesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    const service: BonusesService = TestBed.get(BonusesService);
    expect(service).toBeTruthy();
  });
});
