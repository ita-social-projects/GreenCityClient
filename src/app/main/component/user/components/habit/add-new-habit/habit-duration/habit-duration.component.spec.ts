import { ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { HabitDurationComponent } from './habit-duration.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatSliderChange } from '@angular/material/slider';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ElementRef } from '@angular/core';
import { of } from 'rxjs';

describe('HabitDurationComponent', () => {
  let component: HabitDurationComponent;
  let fixture: ComponentFixture<HabitDurationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HabitDurationComponent],
      imports: [TranslateModule.forRoot(), RouterTestingModule, HttpClientTestingModule],
      providers: [{ provide: ElementRef, useValue: { nativeElement: {} } }]
    }).compileComponents();

    fixture = TestBed.createComponent(HabitDurationComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.newDuration).toBe(7);
    expect(component.currentLang).toBe('');
    expect(component.days).toBe('d');
  });

  it('should update duration and emit event', () => {
    const newDuration = 10;
    spyOn(component.changeDuration, 'emit');

    component.newDuration = newDuration;
    component.updateDuration();

    expect(component.changeDuration.emit).toHaveBeenCalledWith(newDuration);
  });

  it('should update thumb text on slider change', fakeAsync(() => {
    const sliderChangeEvent = { value: 15 } as MatSliderChange;
    component.thumbTextEl = document.createElement('div');

    component.updateInput(sliderChangeEvent);
    tick();

    expect(component.thumbTextEl.textContent).toBe('15d');
  }));

  it('should unsubscribe on destroy', () => {
    component.langChangeSub = of(true).subscribe();
    component.ngOnDestroy();
    expect(component.langChangeSub.closed).toBeTruthy();
  });
});
