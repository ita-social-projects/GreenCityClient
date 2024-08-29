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
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

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
        BrowserAnimationsModule,
        ReactiveFormsModule
      ],
      providers: [FormBuilder],
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
  it('should show error when start date is empty', () => {
    component.form.get('startTime')?.setValue('');
    component.form.get('endTime')?.setValue('23:59');
    fixture.detectChanges();

    const startTimeErrors = component.form.get('startTime')?.errors || {};
    expect(startTimeErrors['required']).toBeTruthy();
  });

  it('should show error when end date is empty', () => {
    component.form.get('startTime')?.setValue('00:00');
    component.form.get('endTime')?.setValue('');
    fixture.detectChanges();

    const endTimeErrors = component.form.get('endTime')?.errors || {};
    expect(endTimeErrors['required']).toBeTruthy();
  });
  
  it('should show error when startTime has an invalid format', () => {
    component.form.get('startTime')?.setValue('25:00');
    component.form.get('endTime')?.setValue('23:59');
    fixture.detectChanges();

    const startTimeErrors = component.form.get('startTime')?.errors || {};
    expect(startTimeErrors['invalidTimeFormat']).toBeTruthy();
  });

  it('should show error when endTime has an invalid format', () => {
    component.form.get('startTime')?.setValue('23:00');
    component.form.get('endTime')?.setValue('99:99');
    fixture.detectChanges();

    const endTimeErrors = component.form.get('endTime')?.errors || {};
    expect(endTimeErrors['invalidTimeFormat']).toBeTruthy();
  });
  
  it('should show error when startTime is greater than or equal to endTime', () => {
    component.form.get('startTime')?.setValue('23:00');
    component.form.get('endTime')?.setValue('22:00');
    fixture.detectChanges();

    const startTimeErrors = component.form.get('startTime')?.errors || {};
    const endTimeErrors = component.form.get('endTime')?.errors || {};
    expect(startTimeErrors['invalidTime']).toBeTruthy();
    expect(endTimeErrors['invalidTime']).toBeTruthy();
  });
  
  it('should not show errors when startTime and endTime are valid and within range', () => {
    component.form.get('startTime')?.setValue('07:00');
    component.form.get('endTime')?.setValue('08:00');
    fixture.detectChanges();

    const startTimeErrors = component.form.get('startTime')?.errors;
    const endTimeErrors = component.form.get('endTime')?.errors;
    expect(startTimeErrors).toBeNull();
    expect(endTimeErrors).toBeNull();
  });
});
