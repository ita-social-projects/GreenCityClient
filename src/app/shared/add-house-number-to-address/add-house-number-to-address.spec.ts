import { TestBed } from '@angular/core/testing';

import { AddHouseNumberToAddressService } from './add-house-number-to-address';

describe('AddHouseNumberToAddressService', () => {
  let service: AddHouseNumberToAddressService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddHouseNumberToAddressService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
