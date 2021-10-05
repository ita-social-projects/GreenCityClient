import { TestBed } from '@angular/core/testing';

import { TableHeightService } from './table-height.service';

describe('TableHeightService', () => {
  let service: TableHeightService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TableHeightService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
