import { RouterTestingModule } from '@angular/router/testing';
import { HttpErrorResponse, HttpResponse, HttpHeaders, HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpRequest, HTTP_INTERCEPTORS } from '@angular/common/http';
import { InterceptorService } from './interceptor.service';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { UserOwnAuthService } from '@global-service/auth/user-own-auth.service';
import { BehaviorSubject, of } from 'rxjs';
import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';
import { MatSnackBarModule } from '@angular/material';

describe(`InterceptorService`, () => {
  const mockAccessToken = 'testAccessToken';
  const mockRefreshToken = 'testRefreshToken';
  let client: HttpClient;
  let httpMock: HttpTestingController;
  let service: InterceptorService;
  let localStorageServiceMock: LocalStorageService;
  localStorageServiceMock = jasmine.createSpyObj('LocalStorageService', ['getAccessToken', 'getRefreshToken', 'clear']);
  let userOwnAuthServiceMock: UserOwnAuthService;
  userOwnAuthServiceMock = jasmine.createSpyObj('UserOwnAuthService', ['isLoginUserSubject']);
  userOwnAuthServiceMock.isLoginUserSubject = new BehaviorSubject(true);
  let MatSnackBarMock: MatSnackBarComponent;
  MatSnackBarMock = jasmine.createSpyObj('MatSnackBarComponent', ['openSnackBar']);
  class Fake {}

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        MatSnackBarModule,
        RouterTestingModule.withRoutes([
          {
            path: 'welcome',
            component: Fake
          }
        ])
      ],
      providers: [
        InterceptorService,
        { provide: UserOwnAuthService, useValue: userOwnAuthServiceMock },
        { provide: LocalStorageService, useValue: localStorageServiceMock },
        { provide: MatSnackBarComponent, useValue: MatSnackBarMock },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: InterceptorService,
          multi: true
        }
      ]
    });
    httpMock = TestBed.get(HttpTestingController);
    service = TestBed.get(InterceptorService);
    client = TestBed.get(HttpClient);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add an Authorization header', () => {
    const token: string = mockAccessToken;
    let httpHeaders = new HttpHeaders();
    const request: HttpRequest<any> = new HttpRequest<any>('GET', '/api', httpHeaders);

    service.addAccessTokenToHeader(request, token);
    expect(request.headers.get('Authorization')).toEqual('Bearer testAccessToken');
  });

  it('should be status of response equal 0 if url contains ownSecurity', () => {
    const request: HttpRequest<any> = new HttpRequest<any>('GET', '/api/ownSecurity');
    const payload = {};
    const response: HttpErrorResponse = new HttpErrorResponse(payload),
      next: any = {
        handle: jasmine.createSpy('handle').and.callFake(() => of(response))
      };
    service
      .intercept(request as any, next)
      .pipe()
      .subscribe();
    expect(response.status).toEqual(0);
  });

  it('should be status of response equal 0 if url contains googleSecurity', () => {
    const request: HttpRequest<any> = new HttpRequest<any>('GET', '/api/googleSecurity');
    const payload = {};
    const response: HttpErrorResponse = new HttpErrorResponse(payload),
      next: any = {
        handle: jasmine.createSpy('handle').and.callFake(() => of(response))
      };
    service
      .intercept(request as any, next)
      .pipe()
      .subscribe();
    expect(response.status).toEqual(0);
  });

  it('should be status of response not equel 0 ', () => {
    const request: HttpRequest<any> = new HttpRequest<any>('GET', '/api');
    const payload = {};
    const response: HttpResponse<any> = new HttpResponse(payload),
      next: any = {
        handle: jasmine.createSpy('handle').and.callFake(() => of(response))
      };
    service
      .intercept(request as any, next)
      .pipe()
      .subscribe();
    expect(response.status).not.toEqual(0);
  });

  it('should be refreshToken not equel null', () => {
    const mockRefreshToken = 'testRefreshToken';
    const request: HttpRequest<any> = new HttpRequest<any>('GET', '/api/');
    const payload = {
      status: 401
    };
    const response: HttpResponse<any> = new HttpResponse(payload),
      next: any = {
        handle: jasmine.createSpy('handle').and.callFake(() => of(response))
      };
    service
      .intercept(request as any, next)
      .pipe()
      .subscribe();
    expect(mockRefreshToken).not.toEqual(null);
  });

  it('handleRefreshTokenIsNotValid', () => {
    const payload = {};
    const response: HttpErrorResponse = new HttpErrorResponse(payload);
    // @ts-ignore
    service.handleRefreshTokenIsNotValid(response);
    expect(localStorageServiceMock.clear).toHaveBeenCalled();
  });

  it('if status 401 call getRefreshToken', () => {
    const payload = {
      status: 401
    };
    const response: HttpResponse<any> = new HttpResponse(payload),
      next: any = {
        handle: jasmine.createSpy('handle').and.callFake(() => of(response))
      };
    // @ts-ignore
    service.handleUnauthorized(response);
    expect(localStorageServiceMock.getRefreshToken).toHaveBeenCalled();
  });

  it('getNewTokenPair', () => {
    const mockRefreshToken = 'testRefreshToken';
    const request: HttpRequest<any> = new HttpRequest<any>('GET', '/api');
    // @ts-ignore
    service.getNewTokenPair(mockRefreshToken);
    expect(request.method).toEqual('GET');
  });

  it('should be call error window', () => {
    let message = 'error';
    service.openErrorWindow(message);
    expect(MatSnackBarMock.openSnackBar).toHaveBeenCalled();
  });
});
