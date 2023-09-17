import { Router } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { MatDialog } from '@angular/material/dialog';
import { AuthPageGuardService } from './auth-page-guard.service';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { BehaviorSubject } from 'rxjs';

describe('AuthPageGuardService', () => {
  let guard: AuthPageGuardService;
  const routerMock = {
    parseUrl: jasmine.createSpy('parseUrl')
  };
  const dialogMock = jasmine.createSpyObj('dialog', ['open']);
  const localStorageMock = jasmine.createSpyObj('LocalStorageService', ['userIdBehaviourSubject']);
  localStorageMock.userIdBehaviourSubject = new BehaviorSubject(1111);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: MatDialog, useValue: dialogMock },
        { provide: LocalStorageService, useValue: localStorageMock }
      ],
      imports: [BrowserDynamicTestingModule]
    });
    guard = TestBed.inject(AuthPageGuardService);
  });

  it('should create guard', () => {
    expect(guard).toBeTruthy();
  });
});
