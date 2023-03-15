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

  it('should convert value that just first letter will be capital', () => {
    const res = service.convFirstLetterToCapital('street Name');
    expect(res).toBe('Street name');
  });
});
