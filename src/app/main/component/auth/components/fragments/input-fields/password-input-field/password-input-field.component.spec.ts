import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordInputFieldComponent } from './password-input-field.component';
import { TranslateModule } from '@ngx-translate/core';

describe('PasswordInputFieldComponent', () => {
  let component: PasswordInputFieldComponent;
  let fixture: ComponentFixture<PasswordInputFieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PasswordInputFieldComponent],
      imports: [TranslateModule.forRoot()]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordInputFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeDefined();
  });
});
