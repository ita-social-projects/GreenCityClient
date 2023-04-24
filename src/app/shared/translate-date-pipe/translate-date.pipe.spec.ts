import { LanguageService } from 'src/app/main/i18n/language.service';
import { TranslateDatePipe } from './translate-date.pipe';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { of } from 'rxjs';

export function HttpLoaderFactory() {
  return {
    getTranslation: () => of({})
  };
}

describe('VolumePipe', () => {
  let translateMock: jasmine.SpyObj<TranslateService>;
  let httpClientMock: HttpTestingController;
  let languageService: LanguageService;
  let pipe: TranslateDatePipe;

  beforeEach(() => {
    translateMock = jasmine.createSpyObj('TranslateService', ['']);

    const localStorageServiceMock = jasmine.createSpyObj('LocalStorageService', ['getCurrentLanguage']);
    localStorageServiceMock.getCurrentLanguage = () => 'en';

    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        HttpClientTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory
          }
        })
      ],
      providers: [
        { provide: TranslateService, useValue: translateMock },
        { provide: LocalStorageService, useValue: localStorageServiceMock },
        LanguageService
      ]
    });

    httpClientMock = TestBed.inject(HttpTestingController);
    languageService = TestBed.inject(LanguageService);
    pipe = new TranslateDatePipe(languageService);
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('transform', () => {
    const dateString = '20 9 2022';
    const localizedDate = '20 September 2022';
    expect(pipe.transform(dateString)).toEqual(localizedDate);
  });
});
