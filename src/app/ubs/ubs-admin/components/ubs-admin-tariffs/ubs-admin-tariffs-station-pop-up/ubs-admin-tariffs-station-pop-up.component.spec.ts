import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { UntypedFormBuilder, ReactiveFormsModule } from '@angular/forms';
import {
  MatLegacyDialog as MatDialog,
  MatLegacyDialogModule as MatDialogModule,
  MatLegacyDialogRef as MatDialogRef,
  MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA
} from '@angular/material/legacy-dialog';
import { TranslateModule } from '@ngx-translate/core';
import { of, Subject } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { UbsAdminTariffsStationPopUpComponent } from './ubs-admin-tariffs-station-pop-up.component';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { TariffsService } from '../../../services/tariffs.service';
import { LanguageService } from 'src/app/main/i18n/language.service';
import { DatePipe } from '@angular/common';
import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';

describe('UbsAdminTariffsStationPopUpComponent', () => {
  let component: UbsAdminTariffsStationPopUpComponent;
  let fixture: ComponentFixture<UbsAdminTariffsStationPopUpComponent>;

  const matDialogRefMock = jasmine.createSpyObj('matDialogRefMock', ['close']);

  const mockedData = {
    headerText: 'station',
    edit: false
  };

  const fakeStation = {
    id: 1,
    name: 'fakeStation'
  };

  const tariffsServiceMock = jasmine.createSpyObj('tariffsServiceMock', ['getAllStations', 'addStation', 'editStation']);
  tariffsServiceMock.getAllStations.and.returnValue(of([fakeStation]));
  tariffsServiceMock.addStation.and.returnValue(of());
  tariffsServiceMock.editStation.and.returnValue(of());

  const languageServiceMock = jasmine.createSpyObj('languageServiceMock', ['getCurrentLanguage']);
  languageServiceMock.getCurrentLanguage.and.returnValue('ua');

  const localStorageServiceStub = () => ({
    firstNameBehaviourSubject: { pipe: () => of('fakeName') }
  });

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [UbsAdminTariffsStationPopUpComponent],
      imports: [MatDialogModule, TranslateModule.forRoot(), ReactiveFormsModule],
      providers: [
        { provide: MatDialogRef, useValue: matDialogRefMock },
        { provide: LocalStorageService, useFactory: localStorageServiceStub },
        { provide: TariffsService, useValue: tariffsServiceMock },
        { provide: LanguageService, useValue: languageServiceMock },
        { provide: MAT_DIALOG_DATA, useValue: mockedData },
        { provide: MatSnackBarComponent, useValue: { openSnackBar: () => {} } },
        UntypedFormBuilder
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsAdminTariffsStationPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check if station exist', () => {
    component.stations = [fakeStation];
    component.name.setValue('fakeStation');
    expect(component.stationExist).toEqual(true);
  });

  it('should check if station exist', () => {
    component.stations = [fakeStation];
    component.name.setValue('newStation');
    expect(component.stationExist).toEqual(false);
  });

  it('should return id of selected station', () => {
    const eventMock = {
      option: {
        value: 'fakeStation'
      }
    };
    component.stations = [fakeStation];
    component.selectedStation(eventMock);
    expect(component.currentId).toEqual(1);
  });

  it('should has correct data', () => {
    expect(component.data.edit).toEqual(false);
    expect(component.data.headerText).toEqual('station');
  });

  it('should call getting station and setting date in OnInit', () => {
    const spy1 = spyOn(component, 'getReceivingStation');
    const spy2 = spyOn(component, 'setDate');
    component.ngOnInit();
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });

  it('should get all stations', () => {
    component.getReceivingStation();
    expect(tariffsServiceMock.getAllStations).toHaveBeenCalled();
    expect(component.stations).toEqual([fakeStation]);
  });

  it('should set date', () => {
    component.setDate();
    expect(component.datePipe).toEqual(new DatePipe('ua'));
    expect(component.newDate).toEqual(component.datePipe.transform(new Date(), 'MMM dd, yyyy'));
  });

  it('should get current language', () => {
    const result = languageServiceMock.getCurrentLanguage();
    component.setDate();
    expect(languageServiceMock.getCurrentLanguage).toHaveBeenCalled();
    expect(result).toEqual('ua');
  });

  it('should transform date', () => {
    const date = new Date(2022, 11, 10);
    const result = component.datePipe.transform(date, 'MMM dd, yyyy');
    expect(result).toEqual('груд. 10, 2022');
  });

  it('should add a new station', () => {
    component.addStation();
    expect(tariffsServiceMock.addStation).toHaveBeenCalled();
  });

  it('should edit the station', () => {
    component.editStation();
    expect(tariffsServiceMock.editStation).toHaveBeenCalled();
  });

  it('method onNoClick should invoke destroyRef.close()', () => {
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
