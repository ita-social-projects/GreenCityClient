import { MapsAPILoader } from '@agm/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { EventDateTimePickerComponent } from './event-date-time-picker.component';
import { LanguageService } from 'src/app/main/i18n/language.service';
import { EventsService } from '../../services/events.service';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { Language } from 'src/app/main/i18n/Language';
import { BehaviorSubject, of } from 'rxjs';

describe('EventDateTimePickerComponent', () => {
  let component: EventDateTimePickerComponent;
  let fixture: ComponentFixture<EventDateTimePickerComponent>;

  const localStorageServiceMock = jasmine.createSpyObj('localStorageService', ['getCurrentLanguage', 'languageBehaviourSubject']);
  localStorageServiceMock.getCurrentLanguage = () => 'en' as Language;
  localStorageServiceMock.languageBehaviourSubject = new BehaviorSubject('en');

  const languageServiceMock = jasmine.createSpyObj('languageService', ['getLangValue']);
  languageServiceMock.getLangValue.and.returnValue(['fakeValue']);

  const EventsServiceMock = jasmine.createSpyObj('EventsService', ['createAdresses', 'setIsAddressFill', 'getIsAddressFillObservable']);
  EventsServiceMock.createAdresses = () => of('');
  EventsServiceMock.setIsAddressFill = () => of('');
  EventsServiceMock.getIsAddressFillObservable = () => of([]);

  const editDateMock = {
    coordinates: {
      latitude: 0,
      longitude: 0,
      cityEn: 'Lviv',
      cityUa: 'Львів',
      countryEn: 'Ukraine',
      countryUa: 'Україна',
      houseNumber: 55,
      regionEn: 'Lvivska oblast',
      regionUa: 'Львівська область',
      streetEn: 'Svobody Ave',
      streetUa: 'Свободи'
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
      imports: [
        TranslateModule.forRoot(),
        FormsModule,
        ReactiveFormsModule,
        MatDatepickerModule,
        MatNativeDateModule,
        HttpClientTestingModule
      ],
      providers: [
        { provide: EventsService, useValue: EventsServiceMock },
        { provide: LanguageService, useValue: languageServiceMock },
        { provide: LocalStorageService, useValue: localStorageServiceMock },
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

  it('fillTimeArray expect will be invoke at onInit', () => {
    const spy = spyOn(component as any, 'fillTimeArray');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('component should initialize from with correct parameters', () => {
    component.ngOnInit();
    expect(component.dateForm.get('date').value).toEqual('');
    expect(component.dateForm.get('startTime').value).toEqual('');
    expect(component.dateForm.get('endTime').value).toEqual('');
  });

  it('setEditData will be invoke at onInit', () => {
    const spy = spyOn(component as any, 'setEditData');
    component.editDate = editDateMock;
    component.isDateDuplicate = true;
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
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
