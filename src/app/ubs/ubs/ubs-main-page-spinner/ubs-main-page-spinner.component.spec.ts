import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UbsMainPageSpinnerComponent } from './ubs-main-page-spinner.component';

describe('UbsMainPageSpinnerComponent', () => {
  let component: UbsMainPageSpinnerComponent;
  let fixture: ComponentFixture<UbsMainPageSpinnerComponent>;

  beforeEach(async(() => {
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
