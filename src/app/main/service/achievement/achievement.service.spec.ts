import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';

import { AchievementService } from './achievement.service';

describe('AchievementService', () => {
  let httpMock: HttpTestingController;
  let service: AchievementService;

  const localStorageServiceMock: LocalStorageService = jasmine.createSpyObj('LocalStorageService', ['unsetFirstSignIn']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: LocalStorageService, useValue: localStorageServiceMock }]
    });
    service = TestBed.inject(AchievementService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return achievements', () => {
    const spy = spyOn(service, 'loadAchievements');
    service.loadAchievements();
    expect(spy).toHaveBeenCalled();
    expect(service.achievements).toBeDefined();
  });

  it('should log out', () => {
    const spy = spyOn(service, 'onLogout');
    service.onLogout();
    expect(spy).toHaveBeenCalled();
  });
});
