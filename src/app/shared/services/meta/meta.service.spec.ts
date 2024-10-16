import { TestBed } from '@angular/core/testing';
import { MetaService } from './meta.service';
import { Title, Meta } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/main/i18n/language.service';
import { of } from 'rxjs';

describe('MetaService', () => {
  let service: MetaService;
  let titleService: Title;
  let metaService: Meta;
  let translateService: TranslateService;
  let languageService: LanguageService;

  beforeEach(() => {
    const mockTitleService = { setTitle: jasmine.createSpy('setTitle') };
    const mockMetaService = { updateTag: jasmine.createSpy('updateTag') };
    const mockTranslateService = {
      get: jasmine.createSpy('get').and.callFake((key: string) => {
        const mockTranslations = {
          'meta.home.title': 'Mock Home Title',
          'meta.home.description': 'Mock Home Description',
          'meta.default.title': 'Default Title',
          'meta.default.description': 'Default Description'
        };
        return of(mockTranslations[key]);
      }),
      use: jasmine.createSpy('use')
    };
    const mockLanguageService = {
      getCurrentLangObs: jasmine.createSpy('getCurrentLangObs').and.returnValue(of('en'))
    };

    TestBed.configureTestingModule({
      providers: [
        MetaService,
        { provide: Title, useValue: mockTitleService },
        { provide: Meta, useValue: mockMetaService },
        { provide: TranslateService, useValue: mockTranslateService },
        { provide: LanguageService, useValue: mockLanguageService }
      ]
    });

    service = TestBed.inject(MetaService);
    titleService = TestBed.inject(Title);
    metaService = TestBed.inject(Meta);
    translateService = TestBed.inject(TranslateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set default meta tags if no pageKey is provided', () => {
    service.setMeta();
    expect(translateService.get).toHaveBeenCalledWith('meta.default.title');
    expect(translateService.get).toHaveBeenCalledWith('meta.default.description');
    expect(titleService.setTitle).toHaveBeenCalledWith('Default Title');
    expect(metaService.updateTag).toHaveBeenCalledWith({ name: 'description', content: 'Default Description' });
  });

  it('should set meta tags for a specific pageKey', () => {
    service.setMeta('home');
    expect(translateService.get).toHaveBeenCalledWith('meta.home.title');
    expect(translateService.get).toHaveBeenCalledWith('meta.home.description');
    expect(titleService.setTitle).toHaveBeenCalledWith('Mock Home Title');
    expect(metaService.updateTag).toHaveBeenCalledWith({ name: 'description', content: 'Mock Home Description' });
  });

  it('should update language when language changes', () => {
    service.setMeta('home'); // Set initial meta
    expect(translateService.use).toHaveBeenCalledWith('en');

    service.setMeta('home');
    expect(translateService.get).toHaveBeenCalledWith('meta.home.title');
    expect(translateService.get).toHaveBeenCalledWith('meta.home.description');
    expect(titleService.setTitle).toHaveBeenCalledWith('Mock Home Title');
    expect(metaService.updateTag).toHaveBeenCalledWith({ name: 'description', content: 'Mock Home Description' });
  });

  it('should reset meta tags when calling resetMeta()', () => {
    service.resetMeta();
    expect(translateService.get).toHaveBeenCalledWith('meta.default.title');
    expect(translateService.get).toHaveBeenCalledWith('meta.default.description');
    expect(titleService.setTitle).toHaveBeenCalledWith('Default Title');
    expect(metaService.updateTag).toHaveBeenCalledWith({ name: 'description', content: 'Default Description' });
  });
});
