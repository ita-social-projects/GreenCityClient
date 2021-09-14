import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ClientOrdersService } from './admin-orders.service';

describe('AdminOrdersService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    })
  );

  it('should be created', () => {
    const service: ClientOrdersService = TestBed.inject(ClientOrdersService);
    expect(service).toBeTruthy();
  });
});
