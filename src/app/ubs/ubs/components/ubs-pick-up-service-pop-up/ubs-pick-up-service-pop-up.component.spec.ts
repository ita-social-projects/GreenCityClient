import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { UbsPickUpServicePopUpComponent } from './ubs-pick-up-service-pop-up.component';

describe('UbsPickUpServicePopUpComponent', () => {
  let component: UbsPickUpServicePopUpComponent;
  let fixture: ComponentFixture<UbsPickUpServicePopUpComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
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
