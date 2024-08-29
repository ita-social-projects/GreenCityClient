import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DateTimeComponent } from './date-time.component';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('DateTimeComponent', () => {
  let component: DateTimeComponent;
  let fixture: ComponentFixture<DateTimeComponent>;

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
        BrowserAnimationsModule
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(DateTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('validateDate', () => {
    it('should set isDateEmpty to true when input is empty', () => {
      component.validateDate('');
      expect(component.isDateEmpty).toBeTrue();
      expect(component.isDateCorrect).toBeTrue();
      expect(component.isDateInThePast).toBeFalse();
    });

    it('should set isDateCorrect to false when input is an invalid date', () => {
      component.validateDate('invalid-date');
      expect(component.isDateCorrect).toBeFalse();
      expect(component.isDateInThePast).toBeFalse();
      expect(component.isDateEmpty).toBeFalse();
    });

    it('should set isDateInThePast to true when input date is in the past', () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1); // Set to one day in the past
      component.validateDate(pastDate.toISOString().split('T')[0]);
      expect(component.isDateCorrect).toBeTrue();
      expect(component.isDateInThePast).toBeTrue();
      expect(component.isDateEmpty).toBeFalse();
    });

    it('should set isDateInThePast to false when input date is today or in the future', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1); // Set to one day in the future
      component.validateDate(futureDate.toISOString().split('T')[0]);
      expect(component.isDateCorrect).toBeTrue();
      expect(component.isDateInThePast).toBeFalse();
      expect(component.isDateEmpty).toBeFalse();

      // Testing with today's date
      const todayDate = new Date();
      component.validateDate(todayDate.toISOString().split('T')[0]);
      expect(component.isDateCorrect).toBeTrue();
      expect(component.isDateInThePast).toBeFalse();
      expect(component.isDateEmpty).toBeFalse();
    });
  });
});
