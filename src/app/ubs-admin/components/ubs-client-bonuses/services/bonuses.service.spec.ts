import { TestBed } from '@angular/core/testing';

import { BonusesService } from './bonuses.service';

describe('BonusesService', () => {
  let service: BonusesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BonusesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
