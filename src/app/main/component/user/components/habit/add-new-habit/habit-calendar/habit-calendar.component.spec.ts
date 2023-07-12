import { HabitCalendarComponent } from './habit-calendar.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { CalendarBaseComponent } from '@shared/components';
import { LanguageService } from 'src/app/main/i18n/language.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { fakeAsync, tick, async } from '@angular/core/testing';

describe('HabitCalendarComponent', () => {
  let component: HabitCalendarComponent;
  let fixture: ComponentFixture<HabitCalendarComponent>;
  let TranslationServiceStub;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [HabitCalendarComponent, CalendarBaseComponent],
      imports: [HttpClientTestingModule, MatDialogModule, TranslateModule.forRoot()],
      providers: [
        { provide: TranslateService, useClass: TranslationServiceStub },
        { provide: LanguageService, useValue: {} }
      ]
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

  it('should show habits after clicking on day item', fakeAsync(() => {
    const spy = spyOn(component, 'showHabits');
    fixture.detectChanges();
    const dayEl = fixture.debugElement.query(By.css('.calendar-grid-day'));
    dayEl.triggerEventHandler('click', null);
    tick();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();
  }));

  it('should show habits if day has habits in progress', fakeAsync(() => {
    const spy = spyOn(component, 'openDialogDayHabits');
    fixture.detectChanges();
    const dayEl = fixture.debugElement.query(By.css('.calendar-grid-day'));
    dayEl.triggerEventHandler('click', null);
    tick();
    fixture.detectChanges();
    expect(spy).not.toHaveBeenCalled();
  }));
});
