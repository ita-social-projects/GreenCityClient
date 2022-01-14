import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsernameInputFieldComponent } from './username-input-field.component';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';

describe('UsernameInputFieldComponent', () => {
  let component: UsernameInputFieldComponent;
  let fixture: ComponentFixture<UsernameInputFieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UsernameInputFieldComponent],
      imports: [TranslateModule.forRoot(), RouterModule.forRoot([{ path: '', component: UsernameInputFieldComponent }])]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsernameInputFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
