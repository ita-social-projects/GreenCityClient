import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { TimePickerComponent } from './time-picker.component';

fdescribe('TimePickerComponent', () => {
  let component: TimePickerComponent;
  let fixture: ComponentFixture<TimePickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TimePickerComponent],
      imports: [TranslateModule.forRoot()]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
