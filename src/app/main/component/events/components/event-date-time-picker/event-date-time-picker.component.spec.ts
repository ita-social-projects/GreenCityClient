import { MapsAPILoader } from '@agm/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { TranslateModule } from '@ngx-translate/core';

import { EventDateTimePickerComponent } from './event-date-time-picker.component';

describe('EventDateTimePickerComponent', () => {
  let component: EventDateTimePickerComponent;
  let fixture: ComponentFixture<EventDateTimePickerComponent>;

  const editDateMock = {
    coordinates: {
      cityUa: 'cityUa',
      cityEn: 'cityEn',
      addressEn: 'address',
      addressUa: 'address',
      latitude: null,
      longitude: null
    },
    event: 'event',
    finishDate: '2023-05-27T15:23:59+03:00',
    id: 1,
    onlineLink: 'http://event',
    startDate: '2023-05-27T15:10:00+03:00'
  };

  const formDataMock: FormGroup = new FormGroup({
    date: new FormControl('day'),
    startTime: new FormControl('10-00'),
    endTime: new FormControl('18-00')
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EventDateTimePickerComponent],
      imports: [TranslateModule.forRoot(), FormsModule, ReactiveFormsModule, MatDatepickerModule, MatNativeDateModule],
      providers: [
        {
          provide: MapsAPILoader,
          useValue: {
            load: jasmine.createSpy('load').and.returnValue(new Promise(() => true))
          }
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventDateTimePickerComponent);
    component = fixture.componentInstance;
    component.dateForm = formDataMock;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit expect dateForm toBeTruthy ', () => {
    const spy = spyOn(component as any, 'setEditData');
    component.editDate = editDateMock;
    component.dateForm = null;
    component.ngOnInit();
    expect(component.dateForm).toBeTruthy();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('setEditData expect onlinelink to be http:/event ', () => {
    const spy = spyOn(component.dateForm, 'patchValue').and.callThrough();
    component.editDate = editDateMock;
    (component as any).setEditData();

    expect(component.checkOnlinePlace).toBeTruthy();
    expect(component.dateForm.get('onlineLink').value).toBe('http://event');
    expect(spy).toHaveBeenCalledTimes(2);

    component.editDate = null;
  });

  it('checkIfAllDay expect startTime.disabled to be true', () => {
    component.checkTime = false;
    component.checkIfAllDay();
    expect(component.dateForm.get('startTime').disabled).toBeTruthy();
  });

  it('checkIfAllDay expect startTime.disabled to be false', () => {
    component.checkTime = true;
    component.checkIfAllDay();
    expect(component.dateForm.get('startTime').disabled).toBeFalsy();
  });

  it('ngOnChanges expect dateForm to be touched', () => {
    component.check = true;
    component.ngOnChanges();
    expect(component.dateForm.touched).toBeTruthy();
  });

  it('checkIfOnline expect dateForm onlineLink toBeTruthy', () => {
    component.checkOnlinePlace = false;
    component.checkIfOnline();
    expect(component.dateForm.get('onlineLink')).toBeTruthy();
  });

  it('checkIfOnline expect dateForm onlineLink toBeFalsy', () => {
    component.checkOnlinePlace = true;
    component.checkIfOnline();
    expect(component.dateForm.get('onlineLink')).toBeFalsy();
  });

  it('fillTimeArray expect  timeArr will be filled', () => {
    component.timeArr = [];
    (component as any).fillTimeArray();
    expect(component.timeArr.length).toBeTruthy();
  });

  it('checkEndTime expect timeArrStart to be 21', () => {
    (component as any).checkEndTime('21:00');
    expect(component.timeArrStart.length).toBe(21);
  });

  it('checkStartTime expect timeArrEnd length to be 2', () => {
    (component as any).checkStartTime('21:00');
    expect(component.timeArrEnd.length).toBe(2);
  });
});
