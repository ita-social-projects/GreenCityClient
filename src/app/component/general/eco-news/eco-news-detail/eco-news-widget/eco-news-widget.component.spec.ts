import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EcoNewsWidgetComponent } from './eco-news-widget.component';

describe('EcoNewsWidgetComponent', () => {
  let component: EcoNewsWidgetComponent;
  let fixture: ComponentFixture<EcoNewsWidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EcoNewsWidgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EcoNewsWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
