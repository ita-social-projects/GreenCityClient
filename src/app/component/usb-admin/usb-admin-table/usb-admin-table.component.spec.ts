import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsbAdminTableComponent } from './usb-admin-table.component';

describe('UsbAdminTableComponent', () => {
  let component: UsbAdminTableComponent;
  let fixture: ComponentFixture<UsbAdminTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsbAdminTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsbAdminTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
