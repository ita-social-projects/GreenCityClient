import { TestBed } from '@angular/core/testing';

import { ToFirstCapitalLetterService } from './to-first-capital-letter.service';

describe('ToFirstCapitalLetterService', () => {
  let service: ToFirstCapitalLetterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToFirstCapitalLetterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
