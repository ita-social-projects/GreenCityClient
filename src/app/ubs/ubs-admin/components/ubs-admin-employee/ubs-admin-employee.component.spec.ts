import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';

import { UbsAdminEmployeeComponent } from './ubs-admin-employee.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideMockStore } from '@ngrx/store/testing';
import { MatAutocomplete, MatAutocompleteModule } from '@angular/material/autocomplete';
import { of } from 'rxjs';
import { UbsAdminEmployeeEditFormComponent } from './ubs-admin-employee-edit-form/ubs-admin-employee-edit-form.component';
import { Locations } from '../../models/tariffs.interface';
import { Store } from '@ngrx/store';
import { UbsAdminEmployeeService } from '../../services/ubs-admin-employee.service';
import { environment } from '@environment/environment.js';

describe('UbsAdminEmployeeComponent', () => {
  let component: UbsAdminEmployeeComponent;
  let fixture: ComponentFixture<UbsAdminEmployeeComponent>;
  let dialog: MatDialog;
  const initialState = {};
  const languageServiceMock = jasmine.createSpyObj('languageService', ['getLangValue']);
  languageServiceMock.getLangValue = (valUa: string, valEn: string) => {
    return valEn;
  };

  let httpMock: HttpTestingController;
  let service: UbsAdminEmployeeService;

  const urlMock = environment.backendUbsLink + '/admin/ubs-employee';
  const positionMock = [
    {
      id: 0,
      name: 'fake'
    }
  ];

  const fakeLocations: Locations = {
    locationsDto: [
      {
        latitude: 0,
        locationId: 159,
        locationStatus: 'active',
        locationTranslationDtoList: [
          { languageCode: 'ua', locationName: 'фейк' },
          { languageCode: 'en', locationName: 'fake' }
        ],
        longitude: 0
      },
      {
        latitude: 0,
        locationId: 0,
        locationStatus: 'active',
        locationTranslationDtoList: [
          { languageCode: 'ua', locationName: 'фейк2' },
          { languageCode: 'en', locationName: 'fake' }
        ],
        longitude: 0
      }
    ],
    regionId: 1,
    regionTranslationDtos: [
      {
        regionName: 'fake',
        languageCode: 'ua'
      }
    ]
  };

  const eventMockStation = {
    option: {
      value: 'fake'
    }
  };

  const storeMock = jasmine.createSpyObj('Store', ['select', 'dispatch']);
  storeMock.select.and.returnValue(of({ locations: { locations: [fakeLocations] } }));

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UbsAdminEmployeeComponent, MatAutocomplete],
      imports: [
        TranslateModule.forRoot(),
        HttpClientTestingModule,
        MatDialogModule,
        ReactiveFormsModule,
        FormsModule,
        MatAutocompleteModule,
        BrowserAnimationsModule
      ],
      providers: [provideMockStore({ initialState }), { provide: Store, useValue: storeMock }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsAdminEmployeeComponent);
    component = fixture.componentInstance;
    dialog = TestBed.inject(MatDialog);
    fixture.detectChanges();
    component.locations = [fakeLocations];
    service = TestBed.inject(UbsAdminEmployeeService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call methods onInit', () => {
    component.selectedCities = [];
    const placeholderCityOption = 'city';
    const cityPlaceholder = 'cityPlaceholder';
    const spy1 = spyOn(component as any, 'getPositions');
    const spy2 = spyOn(component as any, 'initForm');
    const spy3 = spyOn(component as any, 'getContacts');
    const spy4 = spyOn(component as any, 'getLocations');
    const spy5 = spyOn(component as any, 'getCouriers');
    const spy6 = spyOn(component as any, 'setCountOfCheckedFilters');
    component.ngOnInit();
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
    expect(spy3).toHaveBeenCalled();
    expect(spy4).toHaveBeenCalled();
    expect(spy5).toHaveBeenCalled();
    expect(spy6).toHaveBeenCalled();
  });

  it('should initialize the form correctly', () => {
    const spy = spyOn((component as any).fb, 'group');
    (component as any).initForm();
    expect(spy).toHaveBeenCalled();
  });

  it('initForm should create', () => {
    const initFormFake = {
      position: '',
      contacts: '',
      region: '',
      city: '',
      courier: ''
    };

    (component as any).initForm();
    expect(component.searchForm.value).toEqual(initFormFake);
  });

  it('should get all postitions', () => {
    service.getAllPositions().subscribe((data) => {
      expect(data).toBe(positionMock);
    });
  });

  it('should call setData inside getEmployees', () => {
    const spy = spyOn(dialog, 'open');
    component.openDialog();
    expect(spy).toHaveBeenCalled();
  });

  it('should get locations', () => {
    component.getLocations();
    expect(storeMock.dispatch).toHaveBeenCalled();
  });

  it('should open "Add" or "Edit" employee dialog on trigger', () => {
    spyOn(dialog, 'open').and.returnValue({ afterClosed: () => of({ id: 1 }) } as MatDialogRef<typeof UbsAdminEmployeeEditFormComponent>);
    component.openDialog();
    expect(dialog.open).toHaveBeenCalled();
  });
});
