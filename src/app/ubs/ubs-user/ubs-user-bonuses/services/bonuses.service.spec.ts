import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { BonusesService } from './bonuses.service';
import { BonusesModel } from '../models/BonusesModel';
import { environment } from '@environment/environment';
import { IBonus } from '../models/IBonus.interface';

describe('BonusesService', () => {
  let service: BonusesService;
  let httpMock: HttpTestingController;

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

  const userBonusMock: IBonus = { points: 800 };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });

    service = TestBed.inject(BonusesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return bonuses and paid orders history', () => {
    service.getUserBonusesWithPaymentHistory().subscribe((bonuses) => {
      expect(bonuses).toEqual(testBonuses);
      expect(bonuses.userBonuses).toBe(100);
    });

    const req = httpMock.expectOne(`${environment.backendUbsLink}/ubs/client/users-pointsToUse`);
    expect(req.request.method).toBe('GET');
    req.flush(testBonuses);
  });

  it('should return bonuses', () => {
    service.getUserBonuses().subscribe((bonuses) => {
      expect(bonuses).toEqual(userBonusMock);
      expect(userBonusMock.points).toBe(800);
    });

    const req = httpMock.expectOne(`${environment.backendUbsLink}/ubs/client/user-bonuses`);
    expect(req.request.method).toBe('GET');
    req.flush(userBonusMock);
  });
});
