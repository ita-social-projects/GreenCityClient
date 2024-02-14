import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject, of, Subject } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { UbsAdminTariffsCourierPopUpComponent } from './ubs-admin-tariffs-courier-pop-up.component';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { TariffsService } from '../../../services/tariffs.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DatePipe } from '@angular/common';
import {
  // MatAutocompleteSelectedEvent,
  MatAutocompleteTrigger
} from '@angular/material/autocomplete';
import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';

describe('UbsAdminTariffsCourierPopUpComponent', () => {
  let component: UbsAdminTariffsCourierPopUpComponent;
  let fixture: ComponentFixture<UbsAdminTariffsCourierPopUpComponent>;

  const matDialogRefMock = jasmine.createSpyObj('matDialogRefMock', ['close']);

  const mockedData = {
    headerText: 'courier',
    edit: false
  };

  const fakeCouriers = [
    {
      courierId: 1,
      courierStatus: 'fake1',
      nameUk: 'фейкКурєр1',
      nameEn: 'fakeCourier1',
      createDate: 'fakedate',
      createdBy: 'fakeadmin'
    },
    {
      courierId: 2,
      courierStatus: 'fake2',
      nameUk: 'фейкКурєр2',
      nameEn: 'fakeCourier2',
      createDate: 'fakedate',
      createdBy: 'fakeadmin'
    }
  ];

  const fakeCourierForm = new UntypedFormGroup({
    name: new UntypedFormControl('fake'),
    englishName: new UntypedFormControl('fake')
  });

  const tariffsServiceMock = jasmine.createSpyObj('tariffsServiceMock', ['getCouriers', 'addCourier', 'editCourier']);
  tariffsServiceMock.getCouriers.and.returnValue(of([fakeCouriers]));
  tariffsServiceMock.addCourier.and.returnValue(of());
  tariffsServiceMock.editCourier.and.returnValue(of());

  const localStorageServiceMock = jasmine.createSpyObj('localStorageService', [
    'languageBehaviourSubject',
    'getCurrentLanguage',
    'firstNameBehaviourSubject'
  ]);
  localStorageServiceMock.languageBehaviourSubject = new BehaviorSubject('ua');
  localStorageServiceMock.getCurrentLanguage.and.returnValue(of('ua'));
  localStorageServiceMock.firstNameBehaviourSubject = new BehaviorSubject('user');

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [UbsAdminTariffsCourierPopUpComponent],
      imports: [MatDialogModule, BrowserAnimationsModule, TranslateModule.forRoot(), ReactiveFormsModule],
      providers: [
        { provide: MatDialogRef, useValue: matDialogRefMock },
        { provide: TariffsService, useValue: tariffsServiceMock },
        { provide: LocalStorageService, useValue: localStorageServiceMock },
        { provide: MAT_DIALOG_DATA, useValue: mockedData },
        { provide: MatSnackBarComponent, useValue: { openSnackBar: () => {} } },
        UntypedFormBuilder
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

  it('should set names correctly', () => {
    component.courierForm = fakeCourierForm;
    component.setNewCourierName();
    component.courierForm.setValue(fakeCourierForm.value);
    expect(component.courierForm.value).toEqual(fakeCourierForm.value);
  });

  it('should check if courier exists', () => {
    component.courierForm = fakeCourierForm;
    component.name.setValue('новийКурєр');
    expect(component.courierExist).toBe(false);
  });

  it('should check if courier exists', () => {
    component.courierForm = fakeCourierForm;
    component.englishName.setValue('newCourier');
    expect(component.enCourierExist).toBe(false);
  });

  it('should select one courier from list', () => {
    const eventMock = {
      option: {
        value: ['фейкКурєр']
      }
    };
    component.couriers = [fakeCouriers];
    component.selectCourier(eventMock);
    component.selectedCourier = fakeCouriers[0];
    expect(component.selectedCourier.nameUk).toEqual(fakeCouriers[0].nameUk);
  });

  it('should has correct data', () => {
    expect(component.data.headerText).toEqual('courier');
  });

  it('should call getting couriers in OnInit', () => {
    const spy1 = spyOn(component, 'getCouriers');
    component.ngOnInit();
    expect(spy1).toHaveBeenCalled();
  });

  it('should set edit placeholders OnInit', () => {
    component.data.edit = true;
    component.ngOnInit();
    expect(component.placeholder).toBe('ubs-tariffs.placeholder-choose-courier');
    expect(component.placeholderTranslate).toBe('ubs-tariffs.placeholder-choose-courier-translate');
  });

  it('should set add placeholders OnInit', () => {
    component.data.edit = false;
    component.ngOnInit();
    expect(component.placeholder).toBe('ubs-tariffs.placeholder-enter-courier');
    expect(component.placeholderTranslate).toBe('ubs-tariffs.placeholder-enter-courier-translate');
  });

  it('should set date on setDate method', () => {
    component.setDate();
    expect(component.datePipe).toEqual(new DatePipe('ua'));
    expect(component.newDate).toEqual(component.datePipe.transform(new Date(), 'MMM dd, yyyy'));
  });

  it('should call openAuto method', () => {
    const nativeElement = fixture.nativeElement;
    const button = nativeElement.querySelector('#auto-img');
    const trigger: MatAutocompleteTrigger = nativeElement.querySelector('.form-control');
    const spy = spyOn(component, 'openAuto');
    component.openAuto(button, trigger);
    expect(spy).toHaveBeenCalled();
  });

  it('should call two methods on editCourierName', () => {
    const spy1 = spyOn(component, 'setNewCourierName');
    const spy2 = spyOn(component, 'editCourier');
    component.editCourierName();
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });

  it('should get all couriers', () => {
    const fakeNames = ['фейкКурєр'];
    component.getCouriers();
    component.couriersName = fakeNames;
    expect(component.couriers).toEqual([fakeCouriers]);
    expect(component.couriersName).toEqual(['фейкКурєр']);
  });

  it('should add a new courier', () => {
    component.addCourier();
    expect(tariffsServiceMock.addCourier).toHaveBeenCalled();
  });

  it('should edit the courier', () => {
    component.selectedCourier = [{ courierId: 0 }];
    component.editCourier();
    expect(tariffsServiceMock.editCourier).toHaveBeenCalled();
  });

  it('should check if courier ukrainian name exist', () => {
    component.couriersName = ['фейкКурєр', 'фейк2'];
    const value = 'фейкКурєр';
    const result = component.checkIsCourierExist(value, component.couriersName);
    expect(result).toEqual(true);
  });

  it('should check if courier english name exist', () => {
    component.couriersNameEng = ['фейкКурєр', 'fake2'];
    const value = 'фейкКурєр';
    const result = component.checkIsCourierExist(value, component.couriersNameEng);
    expect(result).toEqual(true);
  });

  it('should check language and return ua value', () => {
    const valUa = 'Назва';
    const valEn = 'Name';
    const result = component.checkLang(valUa, valEn);
    expect(result).toBe('Назва');
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
