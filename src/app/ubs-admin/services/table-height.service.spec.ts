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

  it('should set height of table container', () => {
    const table = document.createElement('table');
    const tableContainer = document.createElement('tbody');
    const res = service.setTableHeightToContainerHeight(table, tableContainer);
    expect(res).toBe(true);
  });
});
