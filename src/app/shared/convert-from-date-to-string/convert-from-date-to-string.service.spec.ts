import { TestBed } from '@angular/core/testing';

import { ConvertFromDateToStringService } from './convert-from-date-to-string.service';

describe('ConvertFromDateToStringService', () => {
  let service: ConvertFromDateToStringService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConvertFromDateToStringService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should convert Date to string with TimezoneOffset', () => {
    const res = service.toISOStringWithTimezoneOffset('Tue Jul 26 2022 01:48:55 GMT+0300' as any);
    expect(res).toBe('2022-07-25');
  });

  it('should convert Date to string without TimezoneOffset', () => {
    const res = service.toISOStringWithTimezoneOffset('2022-07-26' as any);
    expect(res).toBe('2022-07-26');
  });
});
