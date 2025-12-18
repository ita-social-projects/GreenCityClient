import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { UbsMainPageComponent } from './ubs-main-page.component';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { LocalStorageService } from 'src/app/shared/services/localstorage/local-storage.service';
import { CheckTokenService } from 'src/app/shared/services/auth/check-token/check-token.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { OrderService } from '../../services/order.service';
import { JwtService } from 'src/app/shared/services/jwt/jwt.service';
import { activeCouriersMock } from 'src/app/ubs/ubs-admin/services/orderInfoMock';
import { Store } from '@ngrx/store';
import { ubsOrderServiseMock } from 'src/app/ubs/mocks/order-data-mock';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AdminUserAgreementService } from '@ubs/ubs-admin/services/admin-user-agreement/admin-user-agreement.service';
import { THomepageContent } from '@ubs/ubs-admin/models/homepage-settings.interface';

describe('UbsMainPageComponent', () => {
  let component: UbsMainPageComponent;
  let fixture: ComponentFixture<UbsMainPageComponent>;
  const jwtServiceMock: JwtService = jasmine.createSpyObj('JwtService', ['getUserRole']);
  jwtServiceMock.getUserRole = () => 'ROLE_UBS_EMPLOYEE';

  const localeStorageServiceMock = jasmine.createSpyObj('localeStorageService', ['setUbsRegistration', 'getUserId', 'getTariffId']);
  localeStorageServiceMock.getCurrentLanguage = () => of('uk');
  const routerMock = jasmine.createSpyObj('router', ['navigate']);
  const matDialogMock = jasmine.createSpyObj('matDialog', ['open']);
  const checkTokenServiceMock = jasmine.createSpyObj('CheckTokenService', ['onCheckToken']);

  const dialogRefStub = {
    afterClosed() {
      return of({ data: true });
    }
  };

  const orderServiceMock = jasmine.createSpyObj('orderService', ['getOrderDetails', 'getActiveTariffsInfo', 'cleanPrevOrderState']);

  orderServiceMock.getActiveTariffsInfo.and.returnValue(of(activeCouriersMock));

  const mockHomepageContent: THomepageContent = {
    uk: {
      how_works: {
        working_hours_caption: 'x',
        route_caption: 'x',
        working_hours: 'x',
        route: 'x'
      },
      header: {
        caption: 'x',
        content: 'x'
      },
      preparing: {
        caption: 'x',
        step_01: 'x'
      },
      rules: {
        caption: 'x',
        content: 'x'
      },
      bonuses: {
        caption: 'x',
        content: 'x'
      },
      price: {
        caption_steps: 'x'
      }
    },
    en: {
      how_works: {
        working_hours_caption: 'x',
        route_caption: 'x',
        working_hours: 'x',
        route: 'x'
      },
      header: {
        caption: 'x',
        content: 'x'
      },
      preparing: {
        caption: 'x',
        step_01: 'x'
      },
      rules: {
        caption: 'x',
        content: 'x'
      },
      bonuses: {
        caption: 'x',
        content: 'x'
      },
      price: {
        caption_steps: 'x'
      }
    },
    section: ['HOW_WORKS']
  };

  const mockData = ['SEE_BIG_ORDER_TABLE', 'SEE_CLIENTS_PAGE', 'SEE_CERTIFICATES', 'SEE_EMPLOYEES_PAGE', 'SEE_TARIFFS'];
  const storeMock = jasmine.createSpyObj('Store', ['select', 'dispatch']);
  storeMock.select.and.returnValue(of({ emplpyees: { employeesPermissions: mockData } }));
  storeMock.select.and.returnValue(of({ order: ubsOrderServiseMock }));
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule, HttpClientTestingModule, MatAutocompleteModule],
      declarations: [UbsMainPageComponent],
      providers: [
        { provide: Store, useValue: storeMock },
        { provide: MatDialog, useValue: matDialogMock },
        { provide: Router, useValue: routerMock },
        { provide: LocalStorageService, useValue: localeStorageServiceMock },
        { provide: CheckTokenService, useValue: checkTokenServiceMock },
        { provide: OrderService, useValue: orderServiceMock },
        { provide: JwtService, useValue: jwtServiceMock },
        {
          provide: AdminUserAgreementService,
          useValue: {
            getHomepageContent: () => of(mockHomepageContent)
          }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsMainPageComponent);
    component = fixture.componentInstance;
    component.content = mockHomepageContent;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component.content).toBeTruthy();
    expect(component).toBeTruthy();
  });

  it('should make expected calls inside openLocationDialog', () => {
    matDialogMock.open.and.returnValue(dialogRefStub as any);
    component.openTariffDialog();
    expect(routerMock.navigate).toHaveBeenCalledWith(['ubs', 'order']);
  });
});
