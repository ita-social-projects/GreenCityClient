import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TariffsService } from './tariffs.service';

describe('TariffsService', () => {
  let service: TariffsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TariffsService],
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(TariffsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
