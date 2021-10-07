import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UbsAdminTariffsDeletePopupComponent } from './ubs-admin-tariffs-delete-popup.component';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';

describe('UbsAdminTariffsDeletePopupComponent', () => {
  let component: UbsAdminTariffsDeletePopupComponent;
  let fixture: ComponentFixture<UbsAdminTariffsDeletePopupComponent>;
  let httpMock: HttpTestingController;
  const data = {
    id: 'id',
    test: 'test'
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UbsAdminTariffsDeletePopupComponent],
      imports: [MatDialogModule, HttpClientTestingModule, TranslateModule.forRoot()],
      providers: [{ provide: MAT_DIALOG_DATA, useValue: data }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsAdminTariffsDeletePopupComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
