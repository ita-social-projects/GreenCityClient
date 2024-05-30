import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CreateEventDatesComponent } from './create-event-dates.component';
import { DateTimeComponent } from './components/date-time/date-time.component';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { PlaceOnlineComponent } from './components/place-online/place-online.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';

describe('CreateEventDatesComponent', () => {
  let component: CreateEventDatesComponent;
  let fixture: ComponentFixture<CreateEventDatesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CreateEventDatesComponent, DateTimeComponent, PlaceOnlineComponent],
      imports: [
        TranslateModule.forRoot(),
        HttpClientTestingModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatFormFieldModule,
        FormsModule,
        ReactiveFormsModule,
        MatAutocompleteModule,
        MatCheckboxModule,
        BrowserAnimationsModule,
        MatInputModule
      ],
      providers: []
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEventDatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
