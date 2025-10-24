import { Subject } from 'rxjs';
import { DateLocalisationPipe } from '@shared/pipes/date-localisation-pipe/date-localisation.pipe';

describe('DateLocalisationPipe', () => {
  let pipe: DateLocalisationPipe;
  let translateServiceMock: any;
  let datePipeMock: any;
  let langChange$: Subject<any>;

  beforeEach(() => {
    langChange$ = new Subject();

    translateServiceMock = {
      getDefaultLang: jasmine.createSpy('getDefaultLang').and.returnValue('en'),
      onDefaultLangChange: langChange$.asObservable()
    };

    datePipeMock = {
      transform: jasmine.createSpy('transform').and.returnValue('formatted-date')
    };

    pipe = new DateLocalisationPipe(translateServiceMock, datePipeMock);
  });

  it('should create', () => {
    expect(pipe).toBeTruthy();
  });

  it('should use en-GB, if lang is en', () => {
    pipe.transform('2025-10-24', 'mediumDate');
    expect(datePipeMock.transform).toHaveBeenCalledWith('2025-10-24', 'mediumDate', undefined, 'en-GB');
  });

  it('should use uk-UA, if lang is uk', () => {
    (pipe as any).locale = 'uk';
    pipe.transform('2025-10-24');
    expect(datePipeMock.transform).toHaveBeenCalledWith('2025-10-24', 'mediumDate', undefined, 'uk-UA');
  });

  it('should update locale on lang change', () => {
    langChange$.next({ lang: 'uk' });
    expect((pipe as any).locale).toBe('uk');
  });
});
