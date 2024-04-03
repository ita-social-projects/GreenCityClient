import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { RatingDisplayComponent } from './rating-display.component';

describe('RatingDisplayComponent', () => {
  let component: RatingDisplayComponent;
  let fixture: ComponentFixture<RatingDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RatingDisplayComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RatingDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the correct number of filled stars', () => {
    component.rate = 3;
    component.maxRating = 5;
    fixture.detectChanges();

    const filledStars = fixture.debugElement.query(By.css('.stars-filled'));

    expect(filledStars.children.length).toBe(5);
  });

  it('should display the correct number of empty stars', () => {
    component.rate = 3;
    component.maxRating = 5;
    fixture.detectChanges();

    const emptyStars = fixture.debugElement.query(By.css('.stars-empthy'));
    expect(emptyStars.children.length).toBe(5);
  });

  it('should display the correct template for empty stars', () => {
    component.rate = 3;
    component.maxRating = 5;
    fixture.detectChanges();

    const emptyStars = fixture.debugElement.query(By.css('.stars-empthy'));
    expect(emptyStars.children[0].nativeElement.src).toContain('assets/events-icons/star-empthy.svg');
  });

  it('should display the correct template for filled stars', () => {
    component.rate = 3;
    component.maxRating = 5;
    fixture.detectChanges();

    const filledStars = fixture.debugElement.query(By.css('.stars-filled'));
    expect(filledStars.children[0].nativeElement.src).toContain('assets/events-icons/star-filled.svg');
  });

  it('shoukd set correct width for filled stars', () => {
    const filledStars = fixture.debugElement.query(By.css('.stars-filled'));

    component.rate = 2;
    component.maxRating = 5;
    fixture.detectChanges();
    expect(filledStars.nativeElement.style.width).toBe('40%');

    component.rate = 2.14;
    component.maxRating = 5;
    fixture.detectChanges();
    expect(filledStars.nativeElement.style.width).toBe('42.8%');

    component.rate = 2.5;
    component.maxRating = 5;
    fixture.detectChanges();
    expect(filledStars.nativeElement.style.width).toBe('50%');

    component.rate = 2.8;
    component.maxRating = 5;
    fixture.detectChanges();
    expect(filledStars.nativeElement.style.width).toBe('56%');

    component.rate = 3;
    component.maxRating = 5;
    fixture.detectChanges();
    expect(filledStars.nativeElement.style.width).toBe('60%');
  });
});
