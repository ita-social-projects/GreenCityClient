import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressInputComponent } from './address-input.component';

describe('AddressInputComponent', () => {
  let component: AddressInputComponent;
  let fixture: ComponentFixture<AddressInputComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddressInputComponent]
    });
    fixture = TestBed.createComponent(AddressInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
