import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TurnstileCaptchaComponent } from './turnstile-captcha.component';

describe('TurnstileCaptchaComponent', () => {
  let component: TurnstileCaptchaComponent;
  let fixture: ComponentFixture<TurnstileCaptchaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TurnstileCaptchaComponent]
    });
    fixture = TestBed.createComponent(TurnstileCaptchaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
