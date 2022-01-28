import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsernameInputFieldComponent } from './username-input-field.component';
import { TranslateModule } from '@ngx-translate/core';

describe('UsernameInputFieldComponent', () => {
  let component: UsernameInputFieldComponent;
  let fixture: ComponentFixture<UsernameInputFieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UsernameInputFieldComponent],
      imports: [TranslateModule.forRoot()]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsernameInputFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
