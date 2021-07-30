import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AdminOrdersService } from './admin-orders.service';

describe('AdminOrdersService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    })
  );

  it('should be created', () => {
    const service: AdminOrdersService = TestBed.get(AdminOrdersService);
    expect(service).toBeTruthy();
  });
});
