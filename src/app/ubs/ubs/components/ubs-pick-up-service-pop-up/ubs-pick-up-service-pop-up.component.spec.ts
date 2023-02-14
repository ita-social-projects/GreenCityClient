import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UbsPickUpServicePopUpComponent } from './ubs-pick-up-service-pop-up.component';

describe('UbsPickUpServicePopUpComponent', () => {
  let component: UbsPickUpServicePopUpComponent;
  let fixture: ComponentFixture<UbsPickUpServicePopUpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UbsPickUpServicePopUpComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsPickUpServicePopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
