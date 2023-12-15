import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { UbsAdminTariffsDeletePopUpComponent } from './ubs-admin-tariffs-delete-pop-up.component';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('UbsAdminTariffsDeletePopupComponent', () => {
  let component: UbsAdminTariffsDeletePopUpComponent;
  let fixture: ComponentFixture<UbsAdminTariffsDeletePopUpComponent>;
  let httpMock: HttpTestingController;
  const data = {
    id: 'id',
    test: 'test'
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [UbsAdminTariffsDeletePopUpComponent],
      imports: [MatDialogModule, HttpClientTestingModule, TranslateModule.forRoot()],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: data },
        { provide: MatDialogRef, useValue: {} }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsAdminTariffsDeletePopUpComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
