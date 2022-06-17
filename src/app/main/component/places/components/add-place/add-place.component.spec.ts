import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';

import { AddPlaceComponent } from './add-place.component';
import { AddressInputComponent } from '../address-input/address-input.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DatePipe } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';

describe('AddPlaceComponent', () => {
  let component: AddPlaceComponent;
  let fixture: ComponentFixture<AddPlaceComponent>;

  beforeEach(async(() => {
    const matDialogRefStub = () => ({ close: () => ({}) });
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, MatMenuModule, HttpClientTestingModule, MatDialogModule, TranslateModule.forRoot()],
      declarations: [AddPlaceComponent, AddressInputComponent],
      providers: [DatePipe, { provide: MatDialogRef, useFactory: matDialogRefStub }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPlaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
