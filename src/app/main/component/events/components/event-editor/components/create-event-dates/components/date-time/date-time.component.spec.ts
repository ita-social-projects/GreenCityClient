import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { DateTimeComponent } from './date-time.component';
import { DefaultCoordinates } from 'src/app/main/component/events/models/event-consts';

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
      day: fb.group({
        date: [new Date()],
        startTime: [''],
        endTime: [''],
        allDay: [false],
        minDate: [new Date()],
        maxDate: ['']
      }),
      placeOnline: fb.group({
        coordinates: fb.group({
          lat: [DefaultCoordinates.LATITUDE],
          lng: [DefaultCoordinates.LONGITUDE]
        }),
        onlineLink: [''],
        place: [''],
        appliedLinkForAll: [false],
        appliedPlaceForAll: [false]
      })
    });

    component.dayNumber = 1;
    component.daysForm = fb.array([dayFormGroup]);
    component.dayFormGroup = dayFormGroup;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
