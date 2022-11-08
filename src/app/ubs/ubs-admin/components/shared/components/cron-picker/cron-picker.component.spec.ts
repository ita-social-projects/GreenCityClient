import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { CronPickerComponent } from './cron-picker.component';

describe('CronPickerComponent', () => {
  let component: CronPickerComponent;
  let fixture: ComponentFixture<CronPickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CronPickerComponent],
      imports: [TranslateModule.forRoot()],
      providers: [FormBuilder]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CronPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
