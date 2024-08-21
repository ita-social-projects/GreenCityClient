import { TestBed } from '@angular/core/testing';

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { take } from 'rxjs';
import { AdminUserAgreementService } from './admin-user-agreement.service';

describe('AdminUserAgreementService', () => {
  let service: AdminUserAgreementService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AdminUserAgreementService]
    });
    service = TestBed.inject(AdminUserAgreementService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verify that no unmatched requests are outstanding
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch and reverse versions', () => {
    const mockVersions: string[] = ['1', '2', '3'];
    const expected: string[] = ['3', '2', '1'];

    service
      .getAllVersions()
      .pipe(take(1))
      .subscribe((versions) => {
        expect(versions).toEqual(expected);
      });

    const req = httpMock.expectOne(service['API_ROUTES'].getAllVersions());
    expect(req.request.method).toBe('GET');
    req.flush(mockVersions);
  });

  it('should fetch user agreement', () => {
    const mockUserAgreement = {
      id: 1,
      createdAt: '2024-08-16T18:45:16.840366',
      authorEmail: 'mock@gmail.com',
      textUa: 'textUa',
      textEn: 'textEn'
    };

    service
      .getUserAgreement('1')
      .pipe(take(1))
      .subscribe((agreement) => {
        expect(agreement).toEqual(mockUserAgreement);
      });

    const req = httpMock.expectOne(service['API_ROUTES'].getUserAgreement('1'));
    expect(req.request.method).toBe('GET');
    req.flush(mockUserAgreement);
  });

  it('should update user agreement', () => {
    const mockUserAgreement = {
      textUa: 'textUa',
      textEn: 'textEn'
    };

    service
      .updateUserAgreement(mockUserAgreement)
      .pipe(take(1))
      .subscribe(() => {
        expect().nothing();
      });

    const req = httpMock.expectOne(service['API_ROUTES'].updateUserAgreement());
    expect(req.request.method).toBe('POST');
    req.flush({});
  });
});
