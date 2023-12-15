import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CalendarComponent } from './calendar.component';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from 'src/app/main/i18n/language.service';
import { HabitAssignService } from '@global-service/habit-assign/habit-assign.service';
import { MatLegacyDialog as MatDialog, MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('CalendarComponent', () => {
  let component: CalendarComponent;
  let fixture: ComponentFixture<CalendarComponent>;

  const languageServiceSpy = jasmine.createSpyObj('LanguageService', ['setDefaultLang']);
  const habitAssignServiceSpy = jasmine.createSpyObj('HabitAssignService', ['getUserHabits']);
  const dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

  const dayItem = {
    date: new Date('2022-12-05'),
    numberOfDate: 12,
    year: 2022,
    month: 5,
    firstDay: 1,
    dayName: 'Monday',
    totalDaysInMonth: 30,
    hasHabitsInProgress: true,
    areHabitsDone: false,
    isCurrentDayActive: false
  };
  const event = jasmine.createSpyObj('MouseEvent', ['preventDefault']);

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CalendarComponent],
      imports: [MatDialogModule, TranslateModule.forRoot(), HttpClientTestingModule],
      providers: [
        { provide: LanguageService, useValue: languageServiceSpy },
        { provide: HabitAssignService, value: habitAssignServiceSpy },
        { provide: MatDialog, value: dialogSpy }
      ]
    });
    fixture = TestBed.createComponent(CalendarComponent);
    component = fixture.componentInstance;
  }));

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

  it('should open Dialog Day habits component', () => {
    spyOn(component, 'openDialogDayHabits');
    component.showHabits(event, dayItem);
    spyOn(component, 'checkCanOpenPopup').and.returnValue(true);
    expect(component.openDialogDayHabits).toHaveBeenCalled();
  });
});
