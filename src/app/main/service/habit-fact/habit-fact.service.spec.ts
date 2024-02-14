import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HabitFactService } from './habit-fact.service';
import { habitFactRandomLink } from '../../links';

describe('HabitFactService', () => {
  let service: HabitFactService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HabitFactService],
      imports: [HttpClientTestingModule]
    });

    service = TestBed.inject(HabitFactService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get habit fact', () => {
    const habitFact = {
      id: 1,
      content: 'fake',
      habitDictionaryId: 2,
      habitDictionaryName: 'fake'
    };

    (service as any).getHabitFact(1, 'english').subscribe((info) => {
      expect(info.id).toBe(1);
    });

    const req = httpMock.expectOne(`${habitFactRandomLink}1?language=english`);
    expect(req.request.method).toBe('GET');
    req.flush(habitFact);
  });
});
