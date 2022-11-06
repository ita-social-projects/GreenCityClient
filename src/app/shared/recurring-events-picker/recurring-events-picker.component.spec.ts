import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { RecurringEventsPickerComponent } from './recurring-events-picker.component';

describe('RecurringEventsPickerComponent', () => {
  let component: RecurringEventsPickerComponent;
  let fixture: ComponentFixture<RecurringEventsPickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RecurringEventsPickerComponent],
      imports: [TranslateModule.forRoot()],
      providers: [FormBuilder]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecurringEventsPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
