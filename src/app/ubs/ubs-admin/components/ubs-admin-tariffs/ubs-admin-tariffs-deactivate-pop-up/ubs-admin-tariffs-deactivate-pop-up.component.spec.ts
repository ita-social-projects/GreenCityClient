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

  const matDialogMock = jasmine.createSpyObj('matDialog', ['open']);
  matDialogMock.open.and.returnValue({ afterClosed: () => of(true) });
  const fakeMatDialogRef = jasmine.createSpyObj(['close', 'afterClosed']);
  fakeMatDialogRef.afterClosed.and.returnValue(of(true));

  const tariffsServiceMock = jasmine.createSpyObj('tariffsServiceMock', ['getCouriers', 'getAllStations']);
  tariffsServiceMock.getCouriers.and.returnValue(of([fakeCouriers]));
  tariffsServiceMock.getAllStations.and.returnValue(of([fakeStation]));

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
    component.ngOnInit();
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
    expect(spy3).toHaveBeenCalled();
    expect(spy4).toHaveBeenCalled();
    expect(spy5).toHaveBeenCalled();
    expect(spy6).toHaveBeenCalled();
  });
});
