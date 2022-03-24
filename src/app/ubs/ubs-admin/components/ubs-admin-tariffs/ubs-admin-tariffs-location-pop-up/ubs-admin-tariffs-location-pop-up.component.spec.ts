import { HttpClientTestingModule } from '@angular/common/http/testing';
import { asNativeElements, CUSTOM_ELEMENTS_SCHEMA, ElementRef, NO_ERRORS_SCHEMA, QueryList } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { Language } from 'src/app/main/i18n/Language';
import { CreateLocation } from '../../../models/tariffs.interface';
import { TariffsService } from '../../../services/tariffs.service';

import { UbsAdminTariffsLocationPopUpComponent } from './ubs-admin-tariffs-location-pop-up.component';

describe('UbsAdminTariffsLocationPopUpComponent ', () => {
  let component: UbsAdminTariffsLocationPopUpComponent;
  let fixture: ComponentFixture<UbsAdminTariffsLocationPopUpComponent>;

  const items = 'items';
  const mockedItems = [
    {
      location: 'fake',
      englishLocation: 'fake',
      latitude: 0,
      longitude: 0
    },
    {
      location: 'fake',
      englishLocation: 'fake',
      latitude: 0,
      longitude: 0
    }
  ];

  const mockedForm = new FormGroup({
    location: new FormControl(''),
    englishLocation: new FormControl(''),
    latitude: new FormControl(0),
    longitude: new FormControl(0)
  });

  const fakeMatDialogRef = jasmine.createSpyObj(['close']);
  const localStorageServiceStub = () => ({
    firstNameBehaviourSubject: { pipe: () => of('fakeName') }
  });
  const storeMock = jasmine.createSpyObj('store', ['select', 'dispatch']);
  storeMock.select = () => of(true, true);

  const tariifsServiceMock = jasmine.createSpyObj('tariiffsService', ['getJSON']);
  const inputsMock = { nativeElement: { value: 'fake' } };
  tariifsServiceMock.getJSON.and.returnValue(of('fake'));

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), HttpClientTestingModule, MatDialogModule, ReactiveFormsModule],
      declarations: [UbsAdminTariffsLocationPopUpComponent],
      providers: [
        FormBuilder,
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: fakeMatDialogRef },
        { provide: LocalStorageService, useFactory: localStorageServiceStub },
        { provide: Store, useValue: storeMock },
        { provide: TariffsService, useValue: tariifsServiceMock }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsAdminTariffsLocationPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('component function addAdress should add locations', () => {
    component.addLocation();
    expect(storeMock.dispatch).toHaveBeenCalled();
  });

  it('method deleteLocation should not delete item by id if item is only one', () => {
    const array: FormGroup[] = [];
    array.push(mockedForm);
    const formArray = new FormArray(array);
    component.locationForm = new FormGroup({
      items: formArray
    });

    component.deleteLocation(1);
    expect((component.locationForm.controls[items] as FormArray).length).toBe(1);
  });

  it('method deleteLocation should delete item by id', () => {
    const array: FormGroup[] = [];
    array.push(mockedForm);
    array.push(mockedForm);
    const formArray = new FormArray(array);
    component.locationForm = new FormGroup({
      items: formArray
    });

    component.deleteLocation(1);
    expect((component.locationForm.controls[items] as FormArray).length).toBe(1);
  });

  it('method addCity should not add new item and add autocomplete if all cities are not selected', () => {
    const array: FormGroup[] = [];
    array.push(mockedForm);
    const formArray = new FormArray(array);
    component.locationForm = new FormGroup({
      items: formArray
    });

    spyOn(component, 'checkIfAllCitysAreSelected').and.returnValue(false);

    component.addCity();
    expect((component.locationForm.controls[items] as FormArray).length).toBe(1);
    expect(component.tempAutocomplete).toBeFalsy();
  });

  it('method onNoClick should invoke destroyRef.close()', () => {
    component.onNoClick();
    expect(fakeMatDialogRef.close).toHaveBeenCalled();
  });
});
