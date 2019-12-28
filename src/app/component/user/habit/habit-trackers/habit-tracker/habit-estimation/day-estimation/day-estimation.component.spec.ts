import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DayEstimationComponent } from './day-estimation.component';

describe('DayEstimationDemoComponent', () => {
  let component: DayEstimationComponent;
  let fixture: ComponentFixture<DayEstimationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DayEstimationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DayEstimationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
