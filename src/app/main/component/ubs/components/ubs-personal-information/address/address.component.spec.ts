import { TranslateModule } from '@ngx-translate/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressComponent } from './address.component';

describe('AddressComponent', () => {
  let component: AddressComponent;
  let fixture: ComponentFixture<AddressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [AddressComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddressComponent);
    component = fixture.componentInstance;

    component.address = {
      city: 'someCity'
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
