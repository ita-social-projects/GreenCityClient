import { TestBed } from '@angular/core/testing';

import { FormatDateService } from './format-date.service';

describe('FormatDateService', () => {
  let service: FormatDateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormatDateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
