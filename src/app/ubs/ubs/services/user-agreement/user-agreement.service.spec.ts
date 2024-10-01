import { TestBed } from '@angular/core/testing';

import { UserAgreementService } from './user-agreement.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TUserAgreementText } from '@ubs/ubs-admin/models/user-agreement.interface';

describe('UserAgreementService', () => {
  let service: UserAgreementService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserAgreementService]
    });
    service = TestBed.inject(UserAgreementService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verify that no unmatched requests are outstanding
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch the user agreement text', () => {
    const mockUserAgreement: TUserAgreementText = {
      textUa: 'Деякий текст українською',
      textEn: 'Some text in English'
    };

    service.getUserAgreement().subscribe((agreement) => {
      expect(agreement).toEqual(mockUserAgreement);
    });

    const req = httpMock.expectOne(service['API_ROUTES'].getUserAgreement);
    expect(req.request.method).toBe('GET');
    req.flush(mockUserAgreement);
  });
});
