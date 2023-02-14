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
    const dateRes = service.formatDate('Mon Feb 13 2023 21:57:55 GMT+0200 (за східноєвропейським стандартним часом)');
    expect(dateRes).toBe('2023-02-13');
  });
});
