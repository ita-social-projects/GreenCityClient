import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TimePickerPopupComponent } from './time-picker-popup.component';
import { TranslateModule } from '@ngx-translate/core';
import { WorkingTime } from '../../models/week-pick-model';
import { WeekDays } from '@global-models/weekDays.model';

describe('TimePickerPopUpComponent', () => {
  let component: TimePickerPopupComponent;
  let fixture: ComponentFixture<TimePickerPopupComponent>;
  const time = [
    '08:00',
    '08:30',
    '09:00',
    '09:30',
    '10:00',
    '10:30',
    '11:00',
    '11:30',
    '12:00',
    '12:30',
    '13:00',
    '13:30',
    '14:00',
    '14:30',
    '15:00',
    '15:30',
    '16:00',
    '16:30',
    '17:00',
    '17:30',
    '18:00',
    '18:30',
    '19:00',
    '19:30',
    '20:00',
    '20:30',
    '21:00',
    '21:30',
    '22:00'
  ];

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [TimePickerPopupComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimePickerPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('component should be initialized with correct parameters', () => {
    component.ngOnInit();
    component.selectTheWorkDay.forEach((componentTime) => expect(componentTime.fromSelected).toEqual(time.slice(0, -1)));
    component.selectTheWorkDay.forEach((componentTime) => expect(componentTime.toSelected).toEqual(time.slice(1)));
  });

  it('component should choose the correct time to select', () => {
    component.selectTheWorkDay[2].timeFrom = '12:00';
    component.onTimeFromChange(2);
    const idx = time.indexOf(component.selectTheWorkDay[2].timeFrom);
    expect(component.selectTheWorkDay[2].toSelected).toEqual(time.slice(idx + 1));
  });

  it('component should choose the correct time from', () => {
    component.selectTheWorkDay[2].timeTo = '20:00';
    component.onTimeToChange(2);
    const idx = time.indexOf(component.selectTheWorkDay[2].timeTo);
    expect(component.selectTheWorkDay[2].fromSelected).toEqual(time.slice(0, idx));
  });

  it('component should execute the save method', () => {
    const spy = spyOn(component.timeOfWork, 'emit');
    component.selectTheWorkDay[2].isSelected = true;
    component.selectTheWorkDay[2].timeFrom = '08:00';
    component.selectTheWorkDay[2].timeTo = '20:00';
    const params: WorkingTime[] = [
      { dayOfWeek: WeekDays.MONDAY, timeFrom: '', timeTo: '', isSelected: false },
      { dayOfWeek: WeekDays.TUESDAY, timeFrom: '', timeTo: '', isSelected: false },
      { dayOfWeek: WeekDays.WEDNESDAY, timeFrom: '08:00', timeTo: '20:00', isSelected: true },
      { dayOfWeek: WeekDays.THURSDAY, timeFrom: '', timeTo: '', isSelected: false },
      { dayOfWeek: WeekDays.FRIDAY, timeFrom: '', timeTo: '', isSelected: false },
      { dayOfWeek: WeekDays.SATURDAY, timeFrom: '', timeTo: '', isSelected: false },
      { dayOfWeek: WeekDays.SUNDAY, timeFrom: '', timeTo: '', isSelected: false }
    ];
    component.save();
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith(params);
  });
});
