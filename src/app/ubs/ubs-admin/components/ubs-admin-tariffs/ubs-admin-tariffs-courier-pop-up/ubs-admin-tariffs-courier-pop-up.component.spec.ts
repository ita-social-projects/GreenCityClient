import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { of, Subject } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { UbsAdminTariffsCourierPopUpComponent } from './ubs-admin-tariffs-courier-pop-up.component';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { TariffsService } from '../../../services/tariffs.service';

describe('UbsAdminTariffsCourierPopUpComponent', () => {
  let component: UbsAdminTariffsCourierPopUpComponent;
  let fixture: ComponentFixture<UbsAdminTariffsCourierPopUpComponent>;

  const matDialogRefMock = jasmine.createSpyObj('matDialogRefMock', ['close']);

  const mockedData = {
    headerText: 'courier',
    edit: false
  };

  const fakeCouriers = {
    courierId: 1,
    courierStatus: 'fake',
    courierTranslationDtos: [
      {
        languageCode: 'ua',
        name: "фейкКур'єр"
      },
      {
        languageCode: 'en',
        name: 'fakeCourier'
      }
    ]
  };

  const tariffsServiceMock = jasmine.createSpyObj('tariffsServiceMock', ['getCouriers', 'addCourier', 'editCourier']);
  tariffsServiceMock.getCouriers.and.returnValue(of([fakeCouriers]));
  tariffsServiceMock.addCourier.and.returnValue(of());
  tariffsServiceMock.editCourier.and.returnValue(of());

  const localStorageServiceStub = () => ({
    firstNameBehaviourSubject: { pipe: () => of('fakeName') }
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UbsAdminTariffsCourierPopUpComponent],
      imports: [MatDialogModule, TranslateModule.forRoot(), ReactiveFormsModule],
      providers: [
        { provide: MatDialogRef, useValue: matDialogRefMock },
        { provide: LocalStorageService, useFactory: localStorageServiceStub },
        { provide: TariffsService, useValue: tariffsServiceMock },
        { provide: MAT_DIALOG_DATA, useValue: mockedData },
        FormBuilder
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsAdminTariffsCourierPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check if courier exists', () => {
    component.name.setValue("фейкКур'єр");
    expect(component.courierExist).toBe(true);
  });

  it('should check if courier exists', () => {
    component.name.setValue("новийКур'єр");
    expect(component.courierExist).toBe(false);
  });

  it('should check if courier exists', () => {
    component.englishName.setValue('fakeCourier');
    expect(component.enCourierExist).toBe(true);
  });

  it('should check if courier exists', () => {
    component.englishName.setValue('newCourier');
    expect(component.enCourierExist).toBe(false);
  });

  it('should select one courier from list', () => {
    const eventMock = {
      option: {
        value: ["фейкКур'єр"]
      }
    };
    component.couriers = [fakeCouriers];
    component.selectedCourier(eventMock);
    expect(component.enValue).toEqual([fakeCouriers]);
    expect(component.englishName.value).toEqual('fakeCourier');
  });

  it('should not select one courier if it does not exist', () => {
    const eventMock = {
      option: {
        value: ["новийКур'єр"]
      }
    };
    component.couriers = [fakeCouriers];
    component.selectedCourier(eventMock);
    expect(component.enValue).toEqual([]);
  });

  it('should has correct data', () => {
    expect(component.data.edit).toEqual(false);
    expect(component.data.headerText).toEqual('courier');
  });

  it('should call getting couriers in OnInit', () => {
    const spy = spyOn(component, 'getCouriers');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('should get all couriers', () => {
    component.getCouriers();
    expect(component.couriers).toEqual([fakeCouriers]);
    expect(component.couriersName).toEqual(["фейкКур'єр"]);
  });

  it('should add a new courier', () => {
    component.addCourier();
    expect(tariffsServiceMock.addCourier).toHaveBeenCalled();
  });

  it('should edit the courier', () => {
    component.enValue = [{ courierId: 0 }];
    component.editCourier();
    expect(tariffsServiceMock.editCourier).toHaveBeenCalled();
  });

  it('method onNoClick should invoke destroyRef.close', () => {
    component.onNoClick();
    expect(matDialogRefMock.close).toHaveBeenCalled();
  });

  it('destroy Subject should be closed after ngOnDestroy()', () => {
    const destroy = 'destroy';
    component[destroy] = new Subject<boolean>();
    spyOn(component[destroy], 'unsubscribe');
    component.ngOnDestroy();
    expect(component[destroy].unsubscribe).toHaveBeenCalledTimes(1);
  });
});
