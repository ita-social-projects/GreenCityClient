import { TestBed } from '@angular/core/testing';

import { GeocoderService } from './geocoder.service';

describe('GeocoderService', () => {
  let service: GeocoderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GeocoderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
