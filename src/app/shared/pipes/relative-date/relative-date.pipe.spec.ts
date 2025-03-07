import { TestBed } from '@angular/core/testing';
import { DatePipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { RelativeDatePipe } from './relative-date.pipe';
import { of } from 'rxjs';

class MockTranslateService {
  currentLang = 'en';
  get(key: any): any {
    const translations = {
      'homepage.notifications.today': 'Today',
      'homepage.notifications.yesterday': 'Yesterday'
    };
    return of(translations[key]);
  }
}

describe('RelativeDatePipe', () => {
  let pipe: RelativeDatePipe;
  let datePipe: DatePipe;
  let translateService: TranslateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DatePipe, { provide: TranslateService, useClass: MockTranslateService }]
    });

    datePipe = TestBed.inject(DatePipe);
    translateService = TestBed.inject(TranslateService);
    pipe = new RelativeDatePipe(translateService);
  });

  it('should translate today', () => {
    const today = new Date();
    const result = pipe.transform(today);
    expect(result).toBe('Today');
  });

  it('should translate yesterday', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const result = pipe.transform(yesterday);
    expect(result).toBe('Yesterday');
  });

  it('should format other dates', () => {
    const date = new Date('2023-05-20T10:00:00');
    const expectedFormat = datePipe.transform(date, 'MMM dd, yyyy hh:mm a', '', 'en');
    const result = pipe.transform(date.toString());
    expect(result).toBe(expectedFormat);
  });

  it('should format other dates in UA', () => {
    translateService.currentLang = 'ua';
    const date = new Date('2023-05-20T10:00:00');
    const expectedFormat = datePipe.transform(date, 'MMM dd, yyyy hh:mm', '', 'ua');
    const result = pipe.transform(date.toString());
    expect(result).toBe(expectedFormat);
  });
});
