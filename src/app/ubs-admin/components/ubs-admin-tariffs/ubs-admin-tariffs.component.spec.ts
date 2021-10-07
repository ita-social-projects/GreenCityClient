import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UbsAdminTariffsComponent } from './ubs-admin-tariffs.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('UbsAdminTariffsComponent', () => {
  let component: UbsAdminTariffsComponent;
  let fixture: ComponentFixture<UbsAdminTariffsComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UbsAdminTariffsComponent, UbsAdminTariffsAddServicePopupComponent],
      imports: [OverlayModule, MatDialogModule, TranslateModule.forRoot(), HttpClientTestingModule, BrowserAnimationsModule],
      providers: [{ provide: MatDialog }, FormBuilder, { provide: MatDialogRef, useValue: {} }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsAdminTariffsComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('destroy Subject should be closed after ngOnDestroy()', () => {
    // @ts-ignore
    component.destroy = new Subject<boolean>();
    // @ts-ignore
    spyOn(component.destroy, 'unsubscribe');
    component.ngOnDestroy();
    // @ts-ignore
    expect(component.destroy.unsubscribe).toHaveBeenCalledTimes(1);
  });

  it('should open add service pop up', () => {
    spyOn(component.dialog, 'open').and.callThrough();
    component.openAddTariffForServicePopup();
    expect(component.dialog.open).toHaveBeenCalledWith(UbsAdminTariffsAddServicePopupComponent, {
      hasBackdrop: true,
      disableClose: true,
      data: {
        button: 'add'
      }
    });
  });
});
