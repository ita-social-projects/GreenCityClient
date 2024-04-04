import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
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

  const languageServiceMock = jasmine.createSpyObj('languageService', ['getLangValue', 'getCurrentLangObs', 'getCurrentLanguage']);
  languageServiceMock.getLangValue.and.returnValue(['fakeValue']);
  languageServiceMock.getCurrentLangObs.and.returnValue(of('fakeValue'));

  const EventsServiceMock = jasmine.createSpyObj('EventsService', [
    'createAddresses',
    'setArePlacesFilled',
    'getCheckedPlacesObservable',
    'setInitialValueForPlaces',
    'getFormattedAddress'
  ]);
  EventsServiceMock.createAddresses = () => of('');
  EventsServiceMock.setArePlacesFilled = () => of('');
  EventsServiceMock.setInitialValueForPlaces = () => of('');
  EventsServiceMock.getCheckedPlacesObservable = () => of([]);
  EventsServiceMock.getFormattedAddress = () => of('Mocked formatted address');

  const editDateMock = {
    coordinates: {
      latitude: 1,
      longitude: 1,
      cityEn: 'Lviv',
      cityUa: 'Львів',
      countryEn: 'Ukraine',
      countryUa: 'Україна',
      houseNumber: 55,
      regionEn: 'Lvivska oblast',
      regionUa: 'Львівська область',
      streetEn: 'Svobody Ave',
      streetUa: 'Свободи',
      formattedAddressEn: 'Свободи, 55, Львів, Львівська область, Україна',
      formattedAddressUa: 'Svobody Ave, 55, Lviv, Lvivska oblast, Ukraine'
    },
    valid: true,
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

  beforeEach(waitForAsync(() => {
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
    const spy = spyOn(component as any, 'setDataEditing');
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
    const curHour = new Date().getHours();
    const startTime = curHour !== 23 ? `${curHour + 1}:00` : '0:00';
    const curDay = new Date().getDate();
    const minDate = new Date().setDate(curDay + (curHour !== 23 ? 0 : 1));
    component.firstFormIsSucceed = true;
    component.ngOnInit();
    expect(component.dateForm.get('date').value.toString()).toEqual(new Date(minDate).toString());
    expect(component.dateForm.get('startTime').value).toEqual(startTime);
    expect(component.dateForm.get('endTime').value).toEqual('');
  });

  it('setDataEditing will be invoke at onInit', () => {
    const spy = spyOn(component as any, 'setDataEditing');
    component.editDate = editDateMock;
    component.isDateDuplicate = true;
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('setDataEditing expect onlinelink to be http:/event ', () => {
    const spy = spyOn(component.dateForm, 'patchValue').and.callThrough();
    component.editDate = editDateMock;
    (component as any).setDataEditing();

    expect(component.checkOnlinePlace).toBeTruthy();
    expect(component.dateForm.get('onlineLink').value).toBe('http://event');
    expect(spy).toHaveBeenCalledTimes(3);

    component.editDate = null;
  });

  it('toggleForAllLocations should emit coordinates or null based on appliedForAllLocations', () => {
    spyOn(component.applyCoordToAll, 'emit');
    component.toggleForAllLocations();
    if (!component.appliedForAllLocations) {
      expect(component.applyCoordToAll.emit).toHaveBeenCalledWith(component.coordinates);
    } else {
      expect(component.applyCoordToAll.emit).toHaveBeenCalledWith({ longitude: null, latitude: null });
    }
  });

  it('applyLocationForAllDays is called in onInit during the edit phase', () => {
    const spy = spyOn(component as any, 'applyLocationForAllDays');
    component.editDate = editDateMock;
    component.locationForAllDays = editDateMock.coordinates;
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('applyLocationForAllDays is called in onInit after preview mode', () => {
    const spy = spyOn(component as any, 'applyLocationForAllDays');
    component.fromPreview = true;
    component.locationForAllDays = editDateMock.coordinates;
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('checkIfAllDay expect startTime.disabled to be true', () => {
    component.checkedAllDay = false;
    component.checkIfAllDay();
    expect(component.dateForm.get('startTime').disabled).toBeTruthy();
  });

  it('checkIfAllDay expect startTime.disabled to be false', () => {
    component.checkedAllDay = true;
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

  it('checkStartTime expect timeArrEnd length to be 3', () => {
    (component as any).checkStartTime('21:00');
    expect(component.timeArrEnd.length).toBe(3);
  });
});
