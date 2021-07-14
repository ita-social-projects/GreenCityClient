import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UbsAdminCancelModalComponent } from './ubs-admin-cancel-modal.component';

describe('UbsAdminCancelModalComponent', () => {
  let component: UbsAdminCancelModalComponent;
  let fixture: ComponentFixture<UbsAdminCancelModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UbsAdminCancelModalComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsAdminCancelModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
