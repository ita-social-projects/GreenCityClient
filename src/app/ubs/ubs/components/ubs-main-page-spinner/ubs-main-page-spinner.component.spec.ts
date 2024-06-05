import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UbsMainPageSpinnerComponent } from './ubs-main-page-spinner.component';

describe('UbsMainPageSpinnerComponent', () => {
  let component: UbsMainPageSpinnerComponent;
  let fixture: ComponentFixture<UbsMainPageSpinnerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [UbsMainPageSpinnerComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsMainPageSpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
