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

  it('formatDate', () => {
    const dateRes = service.formatDate('2/19/2022');
    expect(dateRes).toBe('2022-02-19');
  });
});
