import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UbsAdminSeveralOrdersPopUpComponent } from './ubs-admin-several-orders-pop-up.component';
import { OrderService } from '../../services/order.service';

describe('UbsAdminSeveralOrdersPopUpComponent', () => {
  let fixture: ComponentFixture<UbsAdminSeveralOrdersPopUpComponent>;
  let component: UbsAdminSeveralOrdersPopUpComponent;
  let dialog: MatDialog;

  let setEmployeesSpy: jasmine.Spy;
  let closestAvailableDateSpy: jasmine.Spy;

  const dataFromTable = [
    {
      arrayData: [
        {
          key: 'key',
          ua: 'ua',
          en: 'en',
          filtered: true
        }
      ],
      title: 'Dummy title'
    }
  ];

  const initialFormValue = {
    exportDetailsDto: {
      dateExport: null,
      timeDeliveryFrom: null,
      timeDeliveryTo: null,
      receivingStationId: null
    },
    responsiblePersonsForm: {
      responsibleCaller: null,
      responsibleLogicMan: null,
      responsibleNavigator: null,
      responsibleDriver: null
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UbsAdminSeveralOrdersPopUpComponent],
      imports: [HttpClientTestingModule, FormsModule, TranslateModule.forRoot(), ReactiveFormsModule],
      providers: [
        OrderService,
        FormBuilder,
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialog, useValue: { open: () => of({ id: 1 }) } }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(UbsAdminSeveralOrdersPopUpComponent);
    component = fixture.componentInstance;

    setEmployeesSpy = spyOn(component, 'setEmployeesByPosition').and.callFake(() => {});
    closestAvailableDateSpy = spyOn(component, 'setClosestAvailableDate');

    component.dataFromTable = dataFromTable;
    component.ordersId = [1, 2, 3];
    component.currentLang = 'en';

    fixture.detectChanges();
    dialog = TestBed.inject(MatDialog);
  }));

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should set correct current date', () => {
    const currentDate = new Date().toISOString().split('T')[0];
    expect(component.currentDate).toEqual(currentDate);
  });

  it('should init listeners', () => {
    expect(closestAvailableDateSpy).toHaveBeenCalled();
    expect(setEmployeesSpy).toHaveBeenCalled();
  });

  it('should create a form', () => {
    expect(component.ordersForm.value).toEqual(initialFormValue);
  });
});
