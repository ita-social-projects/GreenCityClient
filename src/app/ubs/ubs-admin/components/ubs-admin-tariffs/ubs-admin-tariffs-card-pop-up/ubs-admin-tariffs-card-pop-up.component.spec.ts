import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';

import { UbsAdminTariffsCardPopUpComponent } from './ubs-admin-tariffs-card-pop-up.component';

describe('UbsAdminTariffsCardPopUpComponent', () => {
  let component: UbsAdminTariffsCardPopUpComponent;
  let fixture: ComponentFixture<UbsAdminTariffsCardPopUpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UbsAdminTariffsCardPopUpComponent],
      imports: [MatDialogModule, TranslateModule.forRoot(), ReactiveFormsModule],
      providers: [
        // { provide: MatDialogRef, useValue: matDialogRefMock },
        // { provide: LocalStorageService, useFactory: localStorageServiceStub },
        // { provide: TariffsService, useValue: tariffsServiceMock },
        // { provide: MAT_DIALOG_DATA, useValue: mockedData },
        FormBuilder
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsAdminTariffsCardPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
