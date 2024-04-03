import { HabitCalendarComponent } from './habit-calendar.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CalendarBaseComponent } from '@shared/components';
import { LanguageService } from 'src/app/main/i18n/language.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { fakeAsync, tick } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

describe('HabitCalendarComponent', () => {
  let component: HabitCalendarComponent;
  let fixture: ComponentFixture<HabitCalendarComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [HabitCalendarComponent, CalendarBaseComponent],
      imports: [HttpClientTestingModule, MatDialogModule, TranslateModule.forRoot()],
      providers: [{ provide: LanguageService, useValue: {} }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HabitCalendarComponent);
    component = fixture.componentInstance;
    component.calendarDay = [
      {
        date: new Date('Tue Jul 04 2023 10:49:04 GMT+0300'),
        numberOfDate: 2,
        year: 2023,
        month: 6,
        firstDay: 5,
        dayName: '',
        totalDaysInMonth: 31,
        hasHabitsInProgress: true,
        areHabitsDone: false,
        isCurrentDayActive: false
      }
    ];
    component.monthView = true;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call function OnInit', () => {
    spyOn(component, 'bindDefaultTranslate');
    spyOn(component, 'subscribeToLangChange');
    spyOn(component, 'buildCalendar');
    spyOn(component, 'getUserHabits');
    component.ngOnInit();
    expect(component.bindDefaultTranslate).toHaveBeenCalled();
    expect(component.subscribeToLangChange).toHaveBeenCalled();
    expect(component.buildCalendar).toHaveBeenCalled();
    expect(component.getUserHabits).toHaveBeenCalledWith(true, component.calendarDay);
  });

  it('should show habits after clicking on day item', fakeAsync(() => {
    const spy = spyOn(component, 'showHabits');
    fixture.detectChanges();
    const dayEl = fixture.debugElement.query(By.css('.calendar-grid-day'));
    dayEl.triggerEventHandler('click', null);
    tick();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();
  }));
});
