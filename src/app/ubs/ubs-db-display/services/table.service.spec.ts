import { TestBed } from '@angular/core/testing';

import { TableService } from './table.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('TableService', () => {
  let service: TableService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(TableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
