import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressInputComponent } from './address-input.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ReactiveFormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('AddressInputComponent', () => {
  let component: AddressInputComponent;
  let fixture: ComponentFixture<AddressInputComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddressInputComponent],
      imports: [HttpClientTestingModule, StoreModule.forRoot({}), TranslateModule.forRoot(), MatAutocompleteModule, ReactiveFormsModule],
      schemas: [NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(AddressInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
