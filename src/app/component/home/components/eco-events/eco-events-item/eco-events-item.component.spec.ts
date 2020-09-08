import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EcoEventsItemComponent } from './eco-events-item.component';

describe('EcoEventsItemComponent', () => {
  let component: EcoEventsItemComponent;
  let fixture: ComponentFixture<EcoEventsItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EcoEventsItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EcoEventsItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
