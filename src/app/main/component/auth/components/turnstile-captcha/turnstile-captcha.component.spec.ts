import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TurnstileCaptchaComponent } from './turnstile-captcha.component';
import { LanguageService } from 'src/app/main/i18n/language.service';
import { of } from 'rxjs';
import { Language } from 'src/app/main/i18n/Language';

class MockLanguageService {
  getCurrentLangObs() {
    return of(Language.EN);
  }
}

describe('TurnstileCaptchaComponent', () => {
  let component: TurnstileCaptchaComponent;
  let fixture: ComponentFixture<TurnstileCaptchaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule],
      declarations: [TurnstileCaptchaComponent],
      providers: [{ provide: LanguageService, useClass: MockLanguageService }]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TurnstileCaptchaComponent);
    component = fixture.componentInstance;
    component.siteKey = '0x4AAAAAAAxJcr7nYr6v13PV';
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set input properties correctly', () => {
    expect(component.siteKey).toBe('0x4AAAAAAAxJcr7nYr6v13PV');
    expect(component.theme).toBe('light');
    expect(component.size).toBe('flexible');
  });

  it('should call renderTurnstile on ngAfterViewInit', () => {
    spyOn(component as any, 'renderTurnstile').and.callThrough();
    component.ngAfterViewInit();
    expect((component as any).renderTurnstile).toHaveBeenCalled();
  });

  it('should invoke onChange and onTouched when captcha is validated', () => {
    const onChangeSpy = spyOn(component as any, 'onChange').and.callThrough();
    const onTouchedSpy = spyOn(component as any, 'onTouched').and.callThrough();

    (component as any).javascriptCallback('sample-token');
    expect(onChangeSpy).toHaveBeenCalledWith('sample-token');
    expect(onTouchedSpy).toHaveBeenCalled();
    expect((component as any).captchaToken).toBe('sample-token');
  });

  it('should emit captchaError when an error occurs', () => {
    spyOn(component.captchaError, 'emit');

    (component as any).errorCallback();
    expect(component.captchaError.emit).toHaveBeenCalled();
  });

  it('should call onChange with null when captcha expires', () => {
    const onChangeSpy = spyOn(component as any, 'onChange').and.callThrough();

    (component as any).expiredCallback();
    expect(onChangeSpy).toHaveBeenCalledWith(null);
  });

  it('should register onChange and onTouched', () => {
    const onChangeFn = jasmine.createSpy('onChangeFn');
    const onTouchedFn = jasmine.createSpy('onTouchedFn');

    component.registerOnChange(onChangeFn);
    component.registerOnTouched(onTouchedFn);

    (component as any).javascriptCallback('another-sample-token');
    expect(onChangeFn).toHaveBeenCalledWith('another-sample-token');
    expect(onTouchedFn).toHaveBeenCalled();
  });

  it('should set captchaToken with writeValue', () => {
    component.writeValue('token-from-parent');
    expect((component as any).captchaToken).toBe('token-from-parent');
  });
});
