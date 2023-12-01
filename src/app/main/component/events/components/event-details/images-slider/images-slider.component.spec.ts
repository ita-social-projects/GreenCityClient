import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ImagesSliderComponent } from './images-slider.component';

describe('ImagesSliderComponent', () => {
  let component: ImagesSliderComponent;
  let fixture: ComponentFixture<ImagesSliderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ImagesSliderComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImagesSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
