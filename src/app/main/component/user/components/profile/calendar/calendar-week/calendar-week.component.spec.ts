import { CalendarWeekComponent } from './calendar-week.component';
import { ComponentFixture, TestBed, async, fakeAsync } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { CalendarBaseComponent } from '@shared/components';
import { LanguageService } from 'src/app/main/i18n/language.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { CalendarWeekInterface } from './calendar-week-interface';

describe('HabitCalendarComponent', () => {
  let component: CalendarWeekComponent;
  let fixture: ComponentFixture<CalendarWeekComponent>;
  let day: CalendarWeekInterface;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [CalendarWeekComponent, CalendarBaseComponent],

      imports: [HttpClientTestingModule, MatDialogModule],
      providers: [
        { provide: TranslateService, useValue: {} },
        { provide: LanguageService, useValue: {} }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarWeekComponent);
    component = fixture.componentInstance;
    day = {
      date: new Date('Sun Jul 02 2023 12:21:28 GMT+0300'),
      dayName: 'test',
      isCurrent: true,
      hasHabitsInProgress: true,
      areHabitsDone: true
    };
    component.currentDate = new Date('Sun Jul 02 2023 00:00:00 GMT+0300');
    component.weekDates = [];
    component.language = 'ua';
    component.weekTitle = '';
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should find first week date', () => {
    expect((component as any).getFirstWeekDate()).toEqual(new Date('Mon Jun 26 2023 00:00:00 GMT+0300'));
  });

  it('should find first week date', () => {
    component.currentDate = new Date('Mon Jul 03 2023 00:00:00 GMT+0300');
    fixture.detectChanges();
    expect((component as any).getFirstWeekDate()).toEqual(new Date('Mon Jul 03 2023 00:00:00 GMT+0300'));
  });

  it('should create calendar', async () => {
    (component as any).buildWeekCalendar(component.currentDate);
    expect(component.weekDates.length).toBe(7);
  });

  it('should create calendar', () => {
    expect((component as any).setDayName(component.currentDate)).toBe('нд');
  });

  it('title has to be changed after changing language', () => {
    const spy = spyOn<any>(component, 'buildWeekCalendarTitle');
    (component as any).getLanguage();
    expect(spy).toHaveBeenCalled();
  });
});
