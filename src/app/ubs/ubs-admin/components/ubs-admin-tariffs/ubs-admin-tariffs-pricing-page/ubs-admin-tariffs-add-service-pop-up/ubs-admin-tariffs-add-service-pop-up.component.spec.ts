import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { UbsAdminTariffsAddServicePopUpComponent } from './ubs-admin-tariffs-add-service-pop-up.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ModalTextComponent } from '../../../shared/components/modal-text/modal-text.component';
import { Service } from '../../../../models/tariffs.interface';
import { TariffsService } from '../../../../services/tariffs.service';

describe('UbsAdminTariffsAddServicePopupComponent', () => {
  let component: UbsAdminTariffsAddServicePopUpComponent;
  let fixture: ComponentFixture<UbsAdminTariffsAddServicePopUpComponent>;
  let httpMock: HttpTestingController;
  let fakeTariffService: TariffsService;

  const button = {
    add: 'add',
    update: 'update'
  };

  const fakeService: Service = {
    capacity: 1,
    price: 1,
    courierId: 1,
    commission: 1,
    serviceTranslationDtoList: [
      {
        description: 'fake',
        descriptionEng: 'fake',
        name: 'fake',
        nameEng: 'fake'
      }
    ]
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UbsAdminTariffsAddServicePopUpComponent],
      imports: [TranslateModule.forRoot(), HttpClientTestingModule, MatDialogModule, ReactiveFormsModule],
      providers: [{ provide: MAT_DIALOG_DATA, useValue: button }, FormBuilder, { provide: MatDialogRef, useValue: {} }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsAdminTariffsAddServicePopUpComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fakeTariffService = TestBed.inject(TariffsService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create service', () => {
    expect(fakeTariffService).toBeTruthy();
  });

  it('should call addNewService correctly', () => {
    const addNewServiceSpy = spyOn(component, 'addNewService');
    component.addNewService();
    fakeTariffService.createService(fakeService);
    expect(addNewServiceSpy).toHaveBeenCalled();
  });

  const matDialogMock = jasmine.createSpyObj('matDialog', ['open']);
  it('Check whether method onCancel called with proper args', () => {
    matDialogMock.open = jasmine.createSpy().withArgs(ModalTextComponent, {
      hasBackdrop: true,
      panelClass: 'address-matDialog-styles-w-100',
      data: {
        name: 'cancel',
        text: 'modal-text.cancel-message',
        action: 'modal-text.yes'
      }
    });
  });
});
