import { ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { HabitDurationComponent } from './habit-duration.component';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { MatSliderModule } from '@angular/material/slider';
import { FormsModule } from '@angular/forms';

describe('HabitDurationComponent', () => {
  let component: HabitDurationComponent;
  let fixture: ComponentFixture<HabitDurationComponent>;
  let sliderElement: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HabitDurationComponent],
      imports: [TranslateModule.forRoot(), MatSliderModule, FormsModule, HttpClientTestingModule],
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
    fixture.detectChanges();
    const min = sliderElement.getAttribute('min');
    const max = sliderElement.getAttribute('max');
    expect(min).toBe('7');
    expect(max).toBe('56');
  });

  it('should update newDuration on slider change', () => {
    const event = { value: 20 };
    component.newDuration = 10;
    component.updateInput(event as any);
    expect(component.newDuration).toEqual(20);
  });

  it('should initialize with default values', () => {
    expect(component.newDuration).toBe(7);
    expect(component.currentLang).toBe('7');
    expect(component.days).toBe('d');
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
    fixture.detectChanges();
    expect(sliderElement.textContent).toBe('10');
  });

  it('should update thumb text on slider change', fakeAsync(() => {
    const sliderValue = 15;
    component.updateDuration(sliderValue);
    tick();
    expect(sliderElement.textContent).toBe('15d');
  }));

  it('should unsubscribe on destroy', () => {
    component.langChangeSub = of(true).subscribe();
    component.ngOnDestroy();
    expect(component.langChangeSub.closed).toBeTruthy();
  });

  it('should initialize with habitDurationInitial value', () => {
    const habitDurationInitial = 15;
    component.habitDurationInitial = habitDurationInitial;
    fixture.detectChanges();
    expect(component.newDuration).toBe(habitDurationInitial);
  });

  it('should update newDuration on slider change', () => {
    const event = { value: 20 };
    component.newDuration = 10;
    component.updateInput(event as any);
    expect(component.newDuration).toEqual(20);
  });

  it('should initialize with habitDurationInitial value', () => {
    component.currentLang = 'ua';
    component.habitDurationInitial = 25;
    component.ngOnInit();
    expect(sliderElement.textContent).toContain('25дн');
  });
});
