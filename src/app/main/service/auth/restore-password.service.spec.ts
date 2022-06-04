import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { restorePasswordLink } from '../../links';
import { RestorePasswordService } from './restore-password.service';

describe('UserMessagesService', () => {
  let restorePasswordService: RestorePasswordService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RestorePasswordService]
    });
    restorePasswordService = TestBed.inject(RestorePasswordService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should create', () => {
    expect(restorePasswordService).toBeDefined();
  });

  it('should send ubs style and return expected result', () => {
    restorePasswordService.sendEmailForRestore('mail@mail.com', 'en', true).subscribe((notifications) => {
      expect(notifications).toEqual('successRestorePasswordUbs');
    });
    const req = httpMock.expectOne(`${restorePasswordLink}?email=mail@mail.com&lang=en&ubs=isUbs`);
    expect(req.request.method).toBe('GET');
    req.flush('successRestorePasswordUbs');
  });

  it('should send not ubs style and return expected result', () => {
    restorePasswordService.sendEmailForRestore('mail@mail.com', 'ua', false).subscribe((response) => {
      expect(response).toEqual('successRestorePassword');
    });
    const req = httpMock.expectOne(`${restorePasswordLink}?email=mail@mail.com&lang=ua`);
    expect(req.request.method).toBe('GET');
    req.flush('successRestorePassword');
  });

  afterEach(() => {
    httpMock.verify();
  });
});
