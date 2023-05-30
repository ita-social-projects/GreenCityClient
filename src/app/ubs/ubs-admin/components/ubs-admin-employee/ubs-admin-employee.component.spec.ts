import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';

import { UbsAdminEmployeeComponent } from './ubs-admin-employee.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideMockStore } from '@ngrx/store/testing';
import { MatAutocomplete, MatAutocompleteModule } from '@angular/material/autocomplete';
import { BehaviorSubject, of } from 'rxjs';
import { Locations } from '../../models/tariffs.interface';
import { Store } from '@ngrx/store';
import { UbsAdminEmployeeService } from '../../services/ubs-admin-employee.service';
import { environment } from '@environment/environment.js';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { LanguageService } from 'src/app/main/i18n/language.service';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { UbsAdminEmployeeEditFormComponent } from './ubs-admin-employee-edit-form/ubs-admin-employee-edit-form.component';

describe('UbsAdminEmployeeComponent', () => {
  let component: UbsAdminEmployeeComponent;
  let fixture: ComponentFixture<UbsAdminEmployeeComponent>;
  let dialog: MatDialog;
  const initialState = {};

  const urlMock = environment.backendUbsLink + '/admin/ubs-employee';
  const positionMock = [
    {
      id: 0,
      name: 'fake'
    }
  ];

  const dialogStub = {
    afterClosed() {
      return of(true);
    }
  };

  const mockRegion = [
    {
      locationsDto: [
        {
          latitude: 18,
          locationId: 3,
          locationStatus: 'фейк1',
          locationTranslationDtoList: [
            { languageCode: 'ua', locationName: 'Фейк1' },
            { languageCode: 'en', locationName: 'Fake1' }
          ],
          longitude: 17
        },
        {
          latitude: 11,
          locationId: 5,
          locationStatus: 'фейк2',
          locationTranslationDtoList: [
            { languageCode: 'ua', locationName: 'Фейк2' },
            { languageCode: 'en', locationName: 'Fake2' }
          ],
          longitude: 155
        }
      ],
      regionId: 1,
      regionTranslationDtos: [
        { regionName: 'Фейк область', languageCode: 'ua' },
        { regionName: 'Fake region', languageCode: 'en' }
      ]
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

  const fakeCouriers = {
    courierId: 2,
    courierStatus: 'fake',
    nameUk: 'фейкКурєр2',
    nameEn: 'fakeCourier2',
    createDate: 'fakeDate',
    createdBy: 'fakeAdmin'
  };

  const tariffsServiceMock = jasmine.createSpyObj('tariffsServiceMock', ['getCouriers']);
  tariffsServiceMock.getCouriers.and.returnValue(of([fakeCouriers]));

  const storeMock = jasmine.createSpyObj('Store', ['select', 'dispatch']);
  storeMock.select.and.returnValue(of({ locations: { locations: [fakeLocations] } }));

  const localStorageServiceMock = jasmine.createSpyObj('localStorageServiceMock', [
    'getCurrentLanguage',
    'languageBehaviourSubject',
    'getAccessToken'
  ]);
  localStorageServiceMock.getCurrentLanguage.and.returnValue(of('ua'));
  localStorageServiceMock.languageBehaviourSubject = new BehaviorSubject('ua');

  const languageServiceMock = jasmine.createSpyObj('languageServiceMock', ['getCurrentLanguage', 'getCurrentLangObs', 'getLangValue']);
  languageServiceMock.getCurrentLangObs.and.returnValue(of('ua'));
  languageServiceMock.getCurrentLanguage.and.returnValue('ua');
  languageServiceMock.getLangValue = (valUa: string, valEn: string) => {
    return valUa;
  };

  const matDialogMock = jasmine.createSpyObj('matDialogMock', ['open']);
  matDialogMock.open.and.returnValue(dialogStub);

  const fakeMatDialogRef = jasmine.createSpyObj(['close', 'afterClosed']);
  fakeMatDialogRef.afterClosed.and.returnValue(of(true));

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
      providers: [provideMockStore({ initialState })],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsAdminEmployeeComponent);
    component = fixture.componentInstance;
    dialog = TestBed.inject(MatDialog);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call setData inside getEmployees', () => {
    const spy = spyOn(dialog, 'open');
    component.openDialog();
    expect(spy).toHaveBeenCalled();
  });
});
