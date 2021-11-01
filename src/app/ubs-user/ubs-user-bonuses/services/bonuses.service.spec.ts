import { getTestBed, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { BonusesService } from './bonuses.service';
import { BonusesModel } from '../models/BonusesModel';
import { environment } from '@environment/environment';

describe('BonusesService', () => {
  let service: BonusesService;
  let httpMock: HttpTestingController;
  let injector: TestBed;

  const testBonuses: BonusesModel = {
    ubsUserBonuses: [
      {
        amount: 40,
        dateOfEnrollment: new Date(),
        numberOfOrder: 10
      },
      {
        amount: 60,
        dateOfEnrollment: new Date(),
        numberOfOrder: 10
      }
    ],
    userBonuses: 100
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });

    injector = getTestBed();
    service = injector.get(BonusesService);
    httpMock = injector.get(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return bonuses', () => {
    service.getUserBonuses().subscribe((bonuses) => {
      expect(bonuses).toEqual(testBonuses);
      expect(bonuses.userBonuses).toBe(100);
    });

    const req = httpMock.expectOne(`${environment.backendUbsLink}/ubs/client/users-pointsToUse`);
    expect(req.request.method).toBe('GET');
    req.flush(testBonuses);
  });
});
