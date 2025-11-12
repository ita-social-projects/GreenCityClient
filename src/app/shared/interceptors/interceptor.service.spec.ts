import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS, HttpRequest, HttpEvent, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { InterceptorService } from './interceptor.service';
import { LocalStorageService } from '../services/localstorage/local-storage.service';
import { MatSnackBarService } from '@global-service/mat-snack-bar/mat-snack-bar.service';
import { Router } from '@angular/router';
import { UserOwnAuthService } from 'src/app/shared/services/auth/user-own-auth.service';
import { UBSOrderFormService } from 'src/app/ubs/ubs/services/ubs-order-form.service';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { BAD_REQUEST, FORBIDDEN, UNAUTHORIZED } from '../../main/http-response-status';
import { AuthModalComponent } from '@global-auth/auth-modal/auth-modal.component';
import { updateAccessTokenLink } from '../../main/links';

describe('InterceptorService', () => {
  let service: InterceptorService;
  let httpMock: HttpTestingController;
  let localStorageServiceMock: Partial<LocalStorageService>;
  let snackBarServiceMock: Partial<MatSnackBarService>;
  let routerMock: Partial<Router>;
  let userOwnAuthServiceMock: Partial<UserOwnAuthService>;
  let ubsOrderFormServiceMock: Partial<UBSOrderFormService>;
  let dialogMock: Partial<MatDialog>;

  let mockNextHandler: jasmine.SpyObj<HttpHandler>;

  let newAccessToken: string;
  let newRefreshToken: string;

  beforeEach(() => {
    localStorageServiceMock = {
      getAccessToken: jasmine.createSpy('getAccessToken').and.returnValue(null),
      getRefreshToken: jasmine.createSpy('getRefreshToken').and.returnValue(null),
      setAccessToken: jasmine.createSpy('setAccessToken'),
      setRefreshToken: jasmine.createSpy('setRefreshToken'),
      clear: jasmine.createSpy('clear'),
      setUbsRegistration: jasmine.createSpy('setUbsRegistration')
    };

    snackBarServiceMock = {
      openSnackBar: jasmine.createSpy('openSnackBar')
    };

    routerMock = {
      url: '/some/path',
      navigate: jasmine.createSpy('navigate'),
      navigateByUrl: jasmine.createSpy('navigateByUrl')
    };

    userOwnAuthServiceMock = {
      isLoginUserSubject: new BehaviorSubject(true)
    };
    spyOn(userOwnAuthServiceMock.isLoginUserSubject, 'next').and.callThrough();

    ubsOrderFormServiceMock = {
      setOrderResponseErrorStatus: jasmine.createSpy('setOrderResponseErrorStatus')
    };

    dialogMock = {
      open: jasmine.createSpy('open').and.returnValue({ afterClosed: () => of(true) }),
      closeAll: jasmine.createSpy('closeAll')
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        InterceptorService,
        { provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true },
        { provide: LocalStorageService, useValue: localStorageServiceMock },
        { provide: MatSnackBarService, useValue: snackBarServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: UserOwnAuthService, useValue: userOwnAuthServiceMock },
        { provide: UBSOrderFormService, useValue: ubsOrderFormServiceMock },
        { provide: MatDialog, useValue: dialogMock }
      ]
    });

    service = TestBed.inject(InterceptorService);
    httpMock = TestBed.inject(HttpTestingController);

    mockNextHandler = jasmine.createSpyObj('HttpHandler', ['handle']);
    mockNextHandler.handle.and.returnValue(of({} as HttpEvent<any>));

    newAccessToken = 'newAccessToken';
    newRefreshToken = 'newRefreshToken';
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should open error window for no internet connection', (done) => {
    const originalOnline = window.navigator.onLine;
    Object.defineProperty(window.navigator, 'onLine', { value: false, writable: true });

    mockNextHandler.handle.and.returnValue(throwError(() => new HttpErrorResponse({ status: 0, statusText: 'Network Error' })));

    service.intercept(new HttpRequest('GET', '/test'), mockNextHandler).subscribe({
      next: () => fail('Should not emit next for no internet'),
      error: () => {
        expect(snackBarServiceMock.openSnackBar).toHaveBeenCalledWith('noInternet');
        Object.defineProperty(window.navigator, 'onLine', { value: originalOnline, writable: true });
        done();
      }
    });
  });

  it('should not intercept blacklisted URLs', (done) => {
    const blacklistedReq = new HttpRequest('GET', 'https://csb/api/some-data');
    mockNextHandler.handle.and.returnValue(of({} as HttpEvent<any>));

    service.intercept(blacklistedReq, mockNextHandler).subscribe(() => {
      expect(mockNextHandler.handle).toHaveBeenCalledWith(blacklistedReq);
      expect(localStorageServiceMock.getAccessToken).not.toHaveBeenCalled();
      done();
    });
  });

  it('should not add access token if none exists', (done) => {
    (localStorageServiceMock.getAccessToken as jasmine.Spy).and.returnValue(null);
    const req = new HttpRequest('GET', '/api/data');
    mockNextHandler.handle.and.returnValue(of({} as HttpEvent<any>));

    service.intercept(req, mockNextHandler).subscribe(() => {
      expect(mockNextHandler.handle).toHaveBeenCalledWith(req);
      done();
    });
  });

  it('should add access token to header if exists', (done) => {
    (localStorageServiceMock.getAccessToken as jasmine.Spy).and.returnValue('mockAccessToken');
    const req = new HttpRequest('GET', '/api/data');
    mockNextHandler.handle.and.returnValue(of({} as HttpEvent<any>));

    service.intercept(req, mockNextHandler).subscribe(() => {
      const handledReq = mockNextHandler.handle.calls.first().args[0];
      expect(handledReq.headers.get('Authorization')).toBe('Bearer mockAccessToken');
      done();
    });
  });

  it('should handle errors for security queries (status 0)', (done) => {
    const securityReq = new HttpRequest('GET', '/ownSecurity/login');
    const mockErrorResponse = new HttpErrorResponse({ status: 0, statusText: 'Unknown Error' });
    mockNextHandler.handle.and.returnValue(throwError(() => mockErrorResponse));

    service.intercept(securityReq, mockNextHandler).subscribe({
      error: (err) => {
        expect(snackBarServiceMock.openSnackBar).toHaveBeenCalledWith('Error');
        expect(err).toBe(mockErrorResponse);
        done();
      }
    });
  });

  it('should set order response error status for general 400+ on process order queries', (done) => {
    const processOrderReq = new HttpRequest('GET', '/processOrder');
    mockNextHandler.handle.and.returnValue(throwError(() => new HttpErrorResponse({ status: 404 })));

    service.intercept(processOrderReq, mockNextHandler).subscribe({
      error: (err) => {
        expect(ubsOrderFormServiceMock.setOrderResponseErrorStatus).toHaveBeenCalledWith(true);
        expect(err.status).toBe(404);
        done();
      }
    });
  });

  it('should open snackbar for "not enough bonus points" on process order queries', (done) => {
    const processOrderReq = new HttpRequest('GET', '/processOrder');
    mockNextHandler.handle.and.returnValue(
      throwError(() => new HttpErrorResponse({ status: 400, error: `User doesn't have enough bonus points.` }))
    );

    service.intercept(processOrderReq, mockNextHandler).subscribe({
      error: () => {
        expect(snackBarServiceMock.openSnackBar).toHaveBeenCalledWith('snack-bar.error.not-enough-points');
        done();
      }
    });
  });

  it('should open snackbar for "certificate not valid" on process order queries', (done) => {
    const processOrderReq = new HttpRequest('GET', '/processOrder');
    mockNextHandler.handle.and.returnValue(
      throwError(() => new HttpErrorResponse({ status: 400, error: `The certificate has been used before or is not activated.` }))
    );

    service.intercept(processOrderReq, mockNextHandler).subscribe({
      error: () => {
        expect(snackBarServiceMock.openSnackBar).toHaveBeenCalledWith('snack-bar.error.cartificate-not-valid');
        done();
      }
    });
  });

  it('should handle admin ubs-employee requests with array of errors', (done) => {
    const ubsEmployeeReq = new HttpRequest('GET', '/admin/ubs-employee/users');
    const errorsArray = [
      { name: 'Field1', message: 'Error1' },
      { name: 'Field2', message: 'Error2' }
    ];
    mockNextHandler.handle.and.returnValue(throwError(() => new HttpErrorResponse({ status: BAD_REQUEST, error: errorsArray })));

    service.intercept(ubsEmployeeReq, mockNextHandler).subscribe({
      error: () => {
        expect(snackBarServiceMock.openSnackBar).toHaveBeenCalledWith('Field1: Error1, Field2: Error2');
        done();
      }
    });
  });

  it('should handle admin ubs-employee requests with single error message', (done) => {
    const ubsEmployeeReq = new HttpRequest('GET', '/admin/ubs-employee/users');
    mockNextHandler.handle.and.returnValue(
      throwError(
        () =>
          new HttpErrorResponse({
            status: BAD_REQUEST,
            error: { message: 'Some single error' }
          })
      )
    );

    service.intercept(ubsEmployeeReq, mockNextHandler).subscribe({
      error: () => {
        expect(snackBarServiceMock.openSnackBar).toHaveBeenCalledWith('Some single error');
        done();
      }
    });
  });

  it('should handle admin ubs-employee requests with default error message', (done) => {
    const ubsEmployeeReq = new HttpRequest('GET', '/admin/ubs-employee/users');
    mockNextHandler.handle.and.returnValue(throwError(() => new HttpErrorResponse({ status: BAD_REQUEST, error: { message: 'Error' } })));

    service.intercept(ubsEmployeeReq, mockNextHandler).subscribe({
      error: () => {
        expect(snackBarServiceMock.openSnackBar).toHaveBeenCalledWith('Error');
        done();
      }
    });
  });

  it('should return EMPTY for BAD_REQUEST on /greenCity/events/addAttender', (done) => {
    const addAttenderReq = new HttpRequest('GET', '/greenCity/events/addAttender');
    mockNextHandler.handle.and.returnValue(throwError(() => new HttpErrorResponse({ status: BAD_REQUEST })));

    service.intercept(addAttenderReq, mockNextHandler).subscribe({
      next: () => fail('Should not emit next'),
      error: () => fail('Should not emit error'),
      complete: () => {
        expect(snackBarServiceMock.openSnackBar).not.toHaveBeenCalled();
        done();
      }
    });
  });

  it('should open snackbar for general BAD_REQUEST errors', (done) => {
    const req = new HttpRequest('GET', '/api/data');
    mockNextHandler.handle.and.returnValue(
      throwError(
        () =>
          new HttpErrorResponse({
            status: BAD_REQUEST,
            error: { message: 'Bad request error' }
          })
      )
    );

    service.intercept(req, mockNextHandler).subscribe({
      error: () => {
        expect(snackBarServiceMock.openSnackBar).toHaveBeenCalledWith('Bad request error');
        done();
      }
    });
  });

  it('should open snackbar for FORBIDDEN errors', (done) => {
    const req = new HttpRequest('GET', '/api/data');
    mockNextHandler.handle.and.returnValue(throwError(() => new HttpErrorResponse({ status: FORBIDDEN, statusText: 'Forbidden access' })));

    service.intercept(req, mockNextHandler).subscribe({
      error: (err) => {
        expect(snackBarServiceMock.openSnackBar).toHaveBeenCalledWith(err.message);
        done();
      }
    });
  });

  it('should refresh token on 401 and retry request successfully', fakeAsync(() => {
    const originalReq = new HttpRequest('GET', '/api/protected');

    let firstCallToHandle = true;
    mockNextHandler.handle.and.callFake((req: HttpRequest<any>) => {
      if (firstCallToHandle) {
        firstCallToHandle = false;
        return throwError(() => new HttpErrorResponse({ status: UNAUTHORIZED }));
      } else {
        return of({} as HttpEvent<any>);
      }
    });

    (localStorageServiceMock.getRefreshToken as jasmine.Spy).and.returnValue('mockRefreshToken');

    service.intercept(originalReq, mockNextHandler).subscribe();

    const tokenRefreshReq = httpMock.expectOne(`${updateAccessTokenLink}?refreshToken=mockRefreshToken&projectName=GREENCITY`);
    expect(tokenRefreshReq.request.method).toBe('GET');

    tokenRefreshReq.flush({ accessToken: newAccessToken, refreshToken: newRefreshToken });

    tick();

    expect(localStorageServiceMock.setAccessToken).toHaveBeenCalledWith(newAccessToken);
    expect(localStorageServiceMock.setRefreshToken).toHaveBeenCalledWith(newRefreshToken);

    expect(mockNextHandler.handle).toHaveBeenCalledTimes(2);
    const retriedRequest = mockNextHandler.handle.calls.mostRecent().args[0];
    expect(retriedRequest.headers.get('Authorization')).toBe(`Bearer ${newAccessToken}`);

    tick();
    expect((service as any).isRefreshing).toBe(false);
  }));

  it('should handle invalid refresh token by clearing storage and opening dialog', fakeAsync(() => {
    const originalReq = new HttpRequest('GET', '/api/protected');
    (localStorageServiceMock.getRefreshToken as jasmine.Spy).and.returnValue('invalidRefreshToken');
    (routerMock.url as string) = '/ubs/order';

    mockNextHandler.handle.and.returnValue(throwError(() => new HttpErrorResponse({ status: UNAUTHORIZED })));

    service.intercept(originalReq, mockNextHandler).subscribe();

    const tokenRefreshReq = httpMock.expectOne(`${updateAccessTokenLink}?refreshToken=invalidRefreshToken&projectName=PICKUP`);
    expect(tokenRefreshReq.request.method).toBe('GET');

    tokenRefreshReq.flush({}, { status: BAD_REQUEST, statusText: 'Bad Request' });

    tick();

    expect(localStorageServiceMock.clear).toHaveBeenCalled();
    expect(dialogMock.closeAll).toHaveBeenCalled();
    expect(userOwnAuthServiceMock.isLoginUserSubject.next).toHaveBeenCalledWith(false);
    expect(localStorageServiceMock.setUbsRegistration).toHaveBeenCalledWith(true);
    expect(dialogMock.open).toHaveBeenCalledWith(AuthModalComponent, jasmine.any(Object));

    (dialogMock.open as jasmine.Spy).calls.first().returnValue.afterClosed().subscribe();
    tick();

    expect(routerMock.navigate).toHaveBeenCalledWith(['ubs']);
  }));

  it('should queue subsequent 401 requests while a token refresh is in progress', fakeAsync(() => {
    const originalReq1 = new HttpRequest('GET', '/api/protected/1');
    const originalReq2 = new HttpRequest('GET', '/api/protected/2');

    (localStorageServiceMock.getAccessToken as jasmine.Spy).and.returnValue('initialToken');
    (localStorageServiceMock.getRefreshToken as jasmine.Spy).and.returnValue('mockRefreshToken');

    let callCount = 0;
    mockNextHandler.handle.and.callFake((req: HttpRequest<any>) => {
      callCount++;
      if (callCount <= 2) {
        return throwError(() => new HttpErrorResponse({ status: UNAUTHORIZED }));
      } else {
        return of({} as HttpEvent<any>);
      }
    });

    let firstRequestCompleted = false;
    let secondRequestCompleted = false;

    service.intercept(originalReq1, mockNextHandler).subscribe(() => {
      firstRequestCompleted = true;
    });

    service.intercept(originalReq2, mockNextHandler).subscribe(() => {
      secondRequestCompleted = true;
    });

    const tokenRefreshReq = httpMock.expectOne(`${updateAccessTokenLink}?refreshToken=mockRefreshToken&projectName=GREENCITY`);
    expect(tokenRefreshReq.request.method).toBe('GET');

    tick();

    expect(firstRequestCompleted).toBe(false);
    expect(secondRequestCompleted).toBe(false);

    tokenRefreshReq.flush({ accessToken: newAccessToken, refreshToken: newRefreshToken });

    tick();

    expect(mockNextHandler.handle).toHaveBeenCalledTimes(4);

    const retriedReq1 = mockNextHandler.handle.calls.argsFor(2)[0];
    expect(retriedReq1.url).toBe('/api/protected/2');
    expect(retriedReq1.headers.get('Authorization')).toBe(`Bearer ${newAccessToken}`);

    const retriedReq2 = mockNextHandler.handle.calls.argsFor(3)[0];
    expect(retriedReq2.url).toBe('/api/protected/1');
    expect(retriedReq2.headers.get('Authorization')).toBe(`Bearer ${newAccessToken}`);

    tick();

    expect(firstRequestCompleted).toBe(true);
    expect(secondRequestCompleted).toBe(true);
  }));

  it('should rethrow "Tariff or location is deactivated" error without snackbar', (done) => {
    const req = new HttpRequest('GET', '/any-api');
    const errorMessage = `Tariff or location is deactivated.`;
    const mockErrorResponse = new HttpErrorResponse({ status: 400, error: { message: errorMessage } });
    mockNextHandler.handle.and.returnValue(throwError(() => mockErrorResponse));

    service.intercept(req, mockNextHandler).subscribe({
      error: (err) => {
        expect(err.error.message).toBe(errorMessage);
        expect(snackBarServiceMock.openSnackBar).not.toHaveBeenCalled();
        done();
      }
    });
  });
});
