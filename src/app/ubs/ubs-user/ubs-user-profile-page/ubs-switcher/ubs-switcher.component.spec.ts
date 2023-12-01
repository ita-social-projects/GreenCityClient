import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UbsSwitcherComponent } from './ubs-switcher.component';

describe('UbsSwitcherComponent', () => {
  let component: UbsSwitcherComponent;
  let fixture: ComponentFixture<UbsSwitcherComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [UbsSwitcherComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsSwitcherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
