import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ClientOrdersService } from './client-orders.service';

describe('ClientOrdersService', () => {
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
