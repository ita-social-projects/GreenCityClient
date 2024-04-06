import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisionCardComponent } from './vision-card.component';

describe('VisionCardComponent', () => {
  let component: VisionCardComponent;
  let fixture: ComponentFixture<VisionCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [VisionCardComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisionCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
