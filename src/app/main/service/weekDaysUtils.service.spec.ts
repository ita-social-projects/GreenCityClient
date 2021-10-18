import { TestBed } from '@angular/core/testing';
import { WeekDaysUtils } from './weekDaysUtils.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('WeekDaysUtils Service', () => {
  let service: WeekDaysUtils;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [WeekDaysUtils]
    });
    service = TestBed.inject(WeekDaysUtils);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create an instance', () => {
    expect(service).toBeTruthy();
  });

  it('should return current day in short', () => {
    let day = 'MONDAY';
    let value = service.getWeekDayShortForm(day);
    expect(value).toBe('Mon');
    day = 'TUESDAY';
    value = service.getWeekDayShortForm(day);
    expect(value).toBe('Tue');
    day = 'WEDNESDAY';
    value = service.getWeekDayShortForm(day);
    expect(value).toBe('Wed');
    day = 'THURSDAY';
    value = service.getWeekDayShortForm(day);
    expect(value).toBe('Thu');
    day = 'FRIDAY';
    value = service.getWeekDayShortForm(day);
    expect(value).toBe('Fri');
    day = 'SATURDAY';
    value = service.getWeekDayShortForm(day);
    expect(value).toBe('Sat');
    day = 'SUNDAY';
    value = service.getWeekDayShortForm(day);
    expect(value).toBe('Sun');
  });
});
