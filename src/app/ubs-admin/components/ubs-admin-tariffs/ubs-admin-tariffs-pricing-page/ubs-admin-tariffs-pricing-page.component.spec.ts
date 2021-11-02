import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UbsAdminTariffsPricingPageComponent } from './ubs-admin-tariffs-pricing-page.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormBuilder } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Subject } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { UbsAdminTariffsAddServicePopUpComponent } from './ubs-admin-tariffs-add-service-pop-up/ubs-admin-tariffs-add-service-pop-up.component';
import { FilterListByLangPipe } from '../../../../shared/sort-list-by-lang/filter-list-by-lang.pipe';

describe('UbsAdminPricingPageComponent', () => {
  let component: UbsAdminTariffsPricingPageComponent;
  let fixture: ComponentFixture<UbsAdminTariffsPricingPageComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UbsAdminTariffsPricingPageComponent, UbsAdminTariffsAddServicePopUpComponent, FilterListByLangPipe],
      imports: [
        OverlayModule,
        MatDialogModule,
        TranslateModule.forRoot(),
        HttpClientTestingModule,
        BrowserAnimationsModule,
        RouterTestingModule
      ],
      providers: [{ provide: MatDialog }, FormBuilder, { provide: MatDialogRef, useValue: {} }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsAdminTariffsPricingPageComponent);
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
});
