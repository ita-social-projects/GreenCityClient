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

  const tariffsServiceMock = jasmine.createSpyObj('tariffsServiceMock', ['getAllStations']);
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
    const spy1 = spyOn(component, 'getReceivingStation');
    const spy2 = spyOn(component, 'setStationPlaceholder');
    component.ngOnInit();
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });

  it('should get all stations', () => {
    component.getReceivingStation();
    expect(component.stations).toEqual([fakeStation]);
  });

  it('should add new selected station if it does not exist in list', () => {
    component.selectedStation = [{ name: 'station', id: 0 }];
    component.onSelectStation(eventMockStation as any);
    expect(component.selectedStation).toEqual([
      { name: 'station', id: 0 },
      { name: 'fake', id: 1 }
    ]);
  });

  it('should remove selected station if it exists in list', () => {
    component.selectedStation = [
      { name: 'station', id: 0 },
      { name: 'fake', id: 1 }
    ];
    component.onSelectStation(eventMockStation as any);
    expect(component.selectedStation).toEqual([{ name: 'station', id: 0 }]);
  });

  it('should empty station value onSelectStation method', () => {
    component.onSelectStation(eventMockStation as any);
    expect(component.station.value).toEqual('');
    expect(component.blurOnOption).toEqual(false);
  });

  it('should set station placeholder', () => {
    component.selectedStation = [stationItem];
    component.setStationPlaceholder();
    expect(component.stationPlaceholder).toEqual('1 вибрано');
  });

  it('should set station placeholder', () => {
    component.selectedStation = [];
    component.setStationPlaceholder();
    expect(component.stationPlaceholder).toEqual('ubs-tariffs.placeholder-choose-station');
  });

  it('should  change blurOnOption', () => {
    const eventMock = {
      relatedTarget: {
        localName: 'mat-option'
      }
    };
    component.onBlur(eventMock);
    expect(component.blurOnOption).toEqual(true);
  });

  it('should not change blurOnOption', () => {
    const eventMock = {
      relatedTarget: {
        localName: ''
      }
    };
    component.onBlur(eventMock);
    expect(component.blurOnOption).toEqual(false);
  });

  it('destroy Subject should be closed after ngOnDestroy()', () => {
    const unsubscribe = 'unsubscribe';
    component[unsubscribe] = new Subject<boolean>();
    spyOn(component[unsubscribe], 'complete');
    component.ngOnDestroy();
    expect(component[unsubscribe].complete).toHaveBeenCalledTimes(1);
  });
});
