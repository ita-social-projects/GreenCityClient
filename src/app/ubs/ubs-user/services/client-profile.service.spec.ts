import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { mainUbsLink } from 'src/app/main/links';

import { ClientProfileService } from './client-profile.service';

describe('ClientProfileService', () => {
  let httpMock: HttpTestingController;
  let service: ClientProfileService;

  const clientMock = {
    recipientName: 'YuraBoiko',
    recipientSurname: 'Boiko',
    recipientEmail: 'yur13boj9@gmail.com',
    alternateEmail: 'blackStar@gmail.com',
    recipientPhone: '974498935',
    hasPassword: true,
    addressDto: [
      {
        id: 2369,
        city: 'Kiev',
        cityEn: 'Kiev',
        district: 'Печерський',
        districtEn: 'Печерський',
        entranceNumber: '2',
        houseCorpus: '4',
        region: 'Kyiv',
        regionEn: 'Kyiv',
        houseNumber: '25',
        street: 'вулиця Шота Руставелі',
        streetEn: 'вулиця Шота Руставелі',
        coordinates: null,
        actual: false
      }
    ]
  };
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(ClientProfileService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return user profile data', () => {
    service.getDataClientProfile().subscribe((data) => {
      expect(data).toBeDefined();
    });
    const req = httpMock.expectOne(`${mainUbsLink}/ubs/userProfile/user/getUserProfile`);
    expect(req.request.method).toBe('GET');
  });

  it('should update user profile data', () => {
    service.postDataClientProfile(clientMock).subscribe((data) => {
      expect(data).toBe(clientMock);
    });
    const req = httpMock.expectOne(`${mainUbsLink}/ubs/userProfile/user/update`);
    expect(req.request.method).toBe('PUT');
    req.flush(clientMock);
  });
});
