import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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
    expect(component.couriersName).toEqual(['fakeCourier']);
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
