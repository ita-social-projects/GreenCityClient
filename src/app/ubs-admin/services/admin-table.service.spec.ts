import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { AdminTableService } from './admin-table.service';

describe('AdminTableService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    })
  );

  it('should be created', () => {
    const service: AdminTableService = TestBed.get(AdminTableService);
    expect(service).toBeTruthy();
  });
});
