import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';

import { TariffSelectorComponent } from './tariff-selector.component';

describe('TariffSelectorComponent', () => {
  let component: TariffSelectorComponent;
  let fixture: ComponentFixture<TariffSelectorComponent>;

  const dialogRefMock = { close: () => {} };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TariffSelectorComponent],
      imports: [ReactiveFormsModule, HttpClientTestingModule, MatSelectModule],
      providers: [FormBuilder, { provide: MatDialogRef, useValue: dialogRefMock }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TariffSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
