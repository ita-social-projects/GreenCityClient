import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { of, Subject } from 'rxjs';
import { UbsAdminTariffsDeactivatePopUpComponent } from './ubs-admin-tariffs-deactivate-pop-up.component';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { TariffsService } from '../../../services/tariffs.service';
import { Store } from '@ngrx/store';

describe('UbsAdminTariffsDeactivatePopUpComponent', () => {
  let component: UbsAdminTariffsDeactivatePopUpComponent;
  let fixture: ComponentFixture<UbsAdminTariffsDeactivatePopUpComponent>;

  const fakeCouriers = {
    courierId: 1,
    courierStatus: 'fake',
    courierTranslationDtos: [
      {
        languageCode: 'ua',
        name: 'фейкКурєр'
      },
      {
        languageCode: 'en',
        name: 'fakeCourier'
      }
    ]
  };

  const stationItem = {
    name: 'Фейк',
    id: 0
  };
  const fakeStation = {
    id: 1,
    name: 'fake'
  };
  const eventMockStation = {
    option: {
      value: 'fake'
    }
  };

  const fakeTariffCards = [
    {
      cardId: 3,
      regionDto: {
        regionId: 1,
        nameEn: 'Kyiv region',
        nameUk: 'Київська область'
      },
      locationInfoDtos: [
        {
          locationId: 2,
          nameEn: 'Kyiv',
          nameUk: 'Київ'
        }
      ],
      receivingStationDtos: [
        {
          id: 1,
          name: 'Саперно-Слобідська',
          createdBy: 'hmarax3@gmail.com',
          createDate: '2022-06-14'
        }
      ],
      courierTranslationDtos: [
        {
          name: 'УБС',
          nameEng: 'UBS'
        }
      ],
      tariffStatus: 'ACTIVE',
      creator: 'hmarax3@gmail.com',
      createdAt: '2022-06-08',
      courierLimit: 'LIMIT_BY_AMOUNT_OF_BAG',
      minAmountOfBags: 1,
      maxAmountOfBags: 99,
      minPriceOfOrder: 3,
      maxPriceOfOrder: 1000000,
      courierId: 1
    },
    {
      cardId: 6,
      regionDto: {
        regionId: 1,
        nameEn: 'Kyiv region',
        nameUk: 'Київська область'
      },
      locationInfoDtos: [
        {
          locationId: 7,
          nameEn: 'Bucha',
          nameUk: 'Буча'
        }
      ],
      receivingStationDtos: [
        {
          id: 6,
          name: 'Саперна-сурта',
          createdBy: 'hmarax3@gmail.com',
          createDate: '2022-05-28'
        },
        {
          id: 5,
          name: 'Саперна',
          createdBy: 'hmarax3@gmail.com',
          createDate: '2022-05-28'
        }
      ],
      courierTranslationDtos: [
        {
          name: 'УБС',
          nameEng: 'UBS'
        }
      ],
      tariffStatus: 'ACTIVE',
      creator: 'adminubs@starmaker.email',
      createdAt: '2022-07-07',
      courierLimit: 'LIMIT_BY_AMOUNT_OF_BAG',
      minAmountOfBags: 12,
      maxAmountOfBags: 333,
      minPriceOfOrder: 5,
      maxPriceOfOrder: 1000000,
      courierId: 1
    }
  ];

  const matDialogMock = jasmine.createSpyObj('matDialog', ['open']);
  matDialogMock.open.and.returnValue({ afterClosed: () => of(true) });
  const fakeMatDialogRef = jasmine.createSpyObj(['close', 'afterClosed']);
  fakeMatDialogRef.afterClosed.and.returnValue(of(true));

  const tariffsServiceMock = jasmine.createSpyObj('tariffsServiceMock', ['getCouriers', 'getAllStations', 'getCardInfo']);
  tariffsServiceMock.getCouriers.and.returnValue(of([fakeCouriers]));
  tariffsServiceMock.getAllStations.and.returnValue(of([fakeStation]));
  tariffsServiceMock.getCardInfo.and.returnValue(of(fakeTariffCards));

  const localStorageServiceStub = () => ({
    firstNameBehaviourSubject: { pipe: () => of('fakeName') }
  });

  const storeMock = jasmine.createSpyObj('store', ['select', 'dispatch']);
  storeMock.select.and.returnValue(of());

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UbsAdminTariffsDeactivatePopUpComponent],
      imports: [MatDialogModule, TranslateModule.forRoot(), ReactiveFormsModule],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialog, useValue: matDialogMock },
        { provide: MatDialogRef, useValue: fakeMatDialogRef },
        { provide: LocalStorageService, useFactory: localStorageServiceStub },
        { provide: TariffsService, useValue: tariffsServiceMock },
        { provide: Store, useValue: storeMock },
        FormBuilder
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsAdminTariffsDeactivatePopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call methods in OnInit', () => {
    const spy1 = spyOn(component, 'getLocations');
    const spy2 = spyOn(component, 'getCouriers');
    const spy3 = spyOn(component, 'getReceivingStation');
    const spy4 = spyOn(component, 'setStationPlaceholder');
    const spy5 = spyOn(component, 'setRegionsPlaceholder');
    const spy6 = spyOn(component, 'setCityPlaceholder');
    const spy7 = spyOn(component, 'getTariffCards');
    component.ngOnInit();
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
    expect(spy3).toHaveBeenCalled();
    expect(spy4).toHaveBeenCalled();
    expect(spy5).toHaveBeenCalled();
    expect(spy6).toHaveBeenCalled();
    expect(spy7).toHaveBeenCalled();
  });
});
