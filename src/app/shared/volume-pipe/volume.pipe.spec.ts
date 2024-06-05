import { TestBed, waitForAsync } from '@angular/core/testing';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { VolumePipe } from './volume.pipe';

describe('VolumePipe', () => {
  let pipe: VolumePipe;
  const localStorageServiceMock = jasmine.createSpyObj('LocalStorageService', ['getCurrentLanguage']);
  localStorageServiceMock.getCurrentLanguage = () => 'en';
  const fakeDefaultLangObj = { lang: 'en' };
  const translateMock = jasmine.createSpyObj('translate', ['']);
  translateMock.defaultLang = 'en';
  translateMock.onDefaultLangChange = of(fakeDefaultLangObj);

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [VolumePipe],
      imports: [TranslateModule.forRoot()],
      providers: [
        { provide: TranslateService, useValue: translateMock },
        { provide: LocalStorageService, useValue: localStorageServiceMock }
      ]
    }).compileComponents();
    pipe = new VolumePipe(translateMock, localStorageServiceMock);
  }));

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('lang has default value', () => {
    expect((pipe as any).lang).toBe('en');
  });

  it('transform', () => {
    expect(pipe.transform(333)).toBe('333l');
  });
});
