import { ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { HabitDurationComponent } from './habit-duration.component';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ElementRef, SimpleChange } from '@angular/core';
import { of } from 'rxjs';
import { MatSliderModule } from '@angular/material/slider';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LanguageService } from 'src/app/main/i18n/language.service';

describe('HabitDurationComponent', () => {
  let component: HabitDurationComponent;
  let fixture: ComponentFixture<HabitDurationComponent>;
  let sliderElement: HTMLElement;

  const languageServiceMock = {
    getCurrentLanguage: jasmine.createSpy('getCurrentLanguage').and.returnValue('en'),
    getCurrentLangObs: jasmine.createSpy('getCurrentLangObs').and.returnValue(of('en'))
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HabitDurationComponent],
      imports: [TranslateModule.forRoot(), MatSliderModule, FormsModule, HttpClientTestingModule, ReactiveFormsModule],
      providers: [{ provide: LanguageService, useValue: languageServiceMock }],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HabitDurationComponent);
    sliderElement = fixture.nativeElement.querySelector('mat-slider');
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have correct initial min and max values', () => {
    const min = sliderElement.getAttribute('min');
    const max = sliderElement.getAttribute('max');
    expect(min).toBe('7');
    expect(max).toBe('56');
  });

  it('should initialize with default values', () => {
    expect(component.currentLang).toBe('en');
    expect(component.days).toBe('d');
  });

  it('should reflect input value changes', () => {
    const habitDurationInput = 14;

    component.ngOnChanges({ habitDurationInitial: new SimpleChange(null, habitDurationInput, true) });
    fixture.detectChanges();
    expect(component.newDuration).toBe(14);
  });

  it('should update duration and emit event', () => {
    const newDuration = 10;
    spyOn(component.changeDuration, 'emit');
    component.newDuration = newDuration;
    component.changeDuration.emit(component.newDuration);
    expect(component.changeDuration.emit).toHaveBeenCalledWith(newDuration);
  });

  it('should update thumb text on slider change', () => {
    component.newDuration = 10;
    component.updateLabel();
    fixture.detectChanges();
    const sliderValue = fixture.nativeElement.getElementsByClassName('mdc-slider__value-indicator-text')[0];
    expect(sliderValue.textContent).toBe('10d');
  });

  it('should unsubscribe on destroy', () => {
    component.langChangeSub = of(true).subscribe();
    component.ngOnDestroy();
    expect(component.langChangeSub.closed).toBeTruthy();
  });

  it('should initialize with habitDurationInitial value', () => {
    const habitDurationInitial = 15;
    component.habitDurationInitial = habitDurationInitial;
    component.ngOnInit();
    expect(component.newDuration).toBe(habitDurationInitial);
  });

  it('should initialize with habitDurationInitial value', () => {
    component.habitDurationInitial = 25;
    component.ngOnInit();
    component.currentLang = 'ua';
    component.updateLabel();
    fixture.detectChanges();
    const sliderValue = fixture.nativeElement.getElementsByClassName('mdc-slider__value-indicator-text')[0];
    expect(sliderValue.textContent).toContain('25дн');
  });
});
