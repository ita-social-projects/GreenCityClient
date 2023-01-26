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

  it(' should return ua Value by getLangValue', () => {
    component.currentLang = 'ua';
    const value = (component as any).getLangValue('uaValue', 'enValue');
    expect(value).toBe('uaValue');
  });

  it(' should return en Value by getLangValue', () => {
    component.currentLang = 'en';
    const value = (component as any).getLangValue('uaValue', 'enValue');
    expect(value).toBe('enValue');
  });
});
