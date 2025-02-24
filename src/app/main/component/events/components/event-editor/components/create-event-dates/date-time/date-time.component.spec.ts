import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import * as _moment from 'moment';
import { DateTimeComponent } from './date-time.component';

describe('DateTimeComponent', () => {
  let component: DateTimeComponent;
  let fixture: ComponentFixture<DateTimeComponent>;
  let fb: FormBuilder;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DateTimeComponent],
      imports: [
        TranslateModule.forRoot(),
        HttpClientTestingModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatFormFieldModule,
        MatAutocompleteModule,
        MatCheckboxModule,
        MatInputModule,
        BrowserAnimationsModule,
        ReactiveFormsModule
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DateTimeComponent);
    component = fixture.componentInstance;
    fb = TestBed.inject(FormBuilder);

    const dayFormGroup: FormGroup = fb.group({
      day: [_moment(), Validators.required],
      startDate: [new Date(), Validators.required],
      finishDate: [new Date(), Validators.required],
      startTime: ['', Validators.required],
      finishTime: ['', Validators.required],
      allDay: [false],
      minDate: [new Date()],
      maxDate: [null],
      coordinates: [
        {
          latitude: '',
          longitude: '',
          streetEn: '',
          streetUa: '',
          houseNumber: '',
          cityEn: '',
          cityUa: '',
          regionEn: '',
          regionUa: '',
          countryEn: '',
          countryUa: '',
          formattedAddressEn: '',
          formattedAddressUa: ''
        }
      ],
      onlineLink: new FormControl(''),
      place: new FormControl(''),
      appliedLinkForAll: [false],
      appliedPlaceForAll: [false]
    });

    component.dayNumber = 1;
    component.daysForm = fb.array([dayFormGroup]);
    component.dayFormGroup = dayFormGroup;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getDateErrors', () => {
    it('should return { dateIncorrect: true } when date is null', () => {
      const result = component.getDateErrors(null);
      expect(result).toEqual({ dateIncorrect: true });
    });

    it('should return { dateInPast: true } when date is in the past', () => {
      const pastDate = _moment().subtract(1, 'days'); // Create a past date
      const result = component.getDateErrors(pastDate);
      expect(result).toEqual({ dateInPast: true });
    });

    it('should return null when date is in the future', () => {
      const futureDate = _moment().add(1, 'days'); // Create a future date
      const result = component.getDateErrors(futureDate);
      expect(result).toBeNull(); // Expect no errors
    });

    it('should return null when date is today', () => {
      const today = _moment(); // Create today's date
      const result = component.getDateErrors(today);
      expect(result).toBeNull(); // Expect no errors
    });
  });

  describe('toggleAllDay', () => {
    it('should set time for all day, when user selects Allday', () => {
      component.dayForm.controls.allDay.setValue(true);
      component.toggleAllDay();
      expect(component.dayForm.controls.startTime.value).toBe(component.startOptionsArr[0]);
      expect(component.dayForm.controls.finishTime.value).toBe('23:59');
      expect(component.dayForm.controls.allDay.value).toBe(true);
    });

    it('should set previuos time, when user diselects Allday', () => {
      component.dayForm.controls.startTime.setValue(component.startOptionsArr[0]);
      component.dayForm.controls.finishTime.setValue(component.endOptionsArr[0]);
      component.dayForm.controls.allDay.setValue(true);
      component.toggleAllDay();

      component.dayForm.controls.allDay.setValue(false);
      component.toggleAllDay();
      expect(component.dayForm.controls.startTime.value).toBe(component.startOptionsArr[0]);
      expect(component.dayForm.controls.finishTime.value).toBe(component.endOptionsArr[0]);
      expect(component.dayForm.controls.allDay.value).toBe(false);
    });
  });
});
