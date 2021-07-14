import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UbsAdminGoBackModalComponent } from './ubs-admin-go-back-modal.component';

describe('UbsAdminGoBackModalComponent', () => {
  let component: UbsAdminGoBackModalComponent;
  let fixture: ComponentFixture<UbsAdminGoBackModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UbsAdminGoBackModalComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsAdminGoBackModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
