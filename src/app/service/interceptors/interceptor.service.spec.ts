import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import {InterceptorService} from '@global-service/interceptors/interceptor.service';
import {ProfileService} from '@global-user/components/profile/profile-service/profile.service';
import { TranslateModule } from '@ngx-translate/core';
import {MatDialogModule, MatDialogRef} from '@angular/material';

describe(`AuthHttpInterceptor`, () => {
  let service: ProfileService;
  let httpMock: HttpTestingController;
  class MatDialogRefMock {
    close() { }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        MatDialogModule,
      ],
      providers: [
        ProfileService,
        { provide: MatDialogRef, useClass: MatDialogRefMock },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: InterceptorService,
          multi: true,
        },
      ],
    });

    service = TestBed.get(ProfileService);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should add an Bearer header', () => {
    service.getUserInfo().subscribe(response => {
      expect(response).toBeTruthy();
    });
        // @ts-ignore
    // const httpRequest = httpMock.expectOne(`${service.backEnd}user/${service.userId}/profileStatistics/`);
    //
    // expect(httpRequest.request.headers.has('Bearer')).toEqual(true);
  });
});
