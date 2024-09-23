import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { UbsAdminSidebarComponent } from './ubs-admin-sidebar.component';
import { UbsAdminEmployeeService } from '../../services/ubs-admin-employee.service';
import { BehaviorSubject, of } from 'rxjs';
import { employeePositionsName, SideMenuElementsNames } from '../../models/ubs-admin.interface';
import { listElementsAdmin } from 'src/app/ubs/ubs/models/ubs-sidebar-links';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { listElements } from 'src/app/shared/interface/ubs-base-sidebar-interface';
import { UbsBaseSidebarComponent } from 'src/app/shared/ubs-base-sidebar/ubs-base-sidebar.component';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

describe('UbsAdminSidebarComponent', () => {
  let component: UbsAdminSidebarComponent;
  let fixture: ComponentFixture<UbsAdminSidebarComponent>;
  const initialState = {
    employees: null,
    error: null,
    employeesPermissions: []
  };
  const mockData = ['SEE_BIG_ORDER_TABLE', 'SEE_CLIENTS_PAGE', 'SEE_CERTIFICATES', 'SEE_EMPLOYEES_PAGE', 'SEE_TARIFFS'];
  const storeMock = jasmine.createSpyObj('Store', ['select', 'dispatch']);
  storeMock.select.and.returnValue(of({ employees: { employeesPermissions: mockData } }));

  const employeePositionsMock = [
    employeePositionsName.CallManager,
    employeePositionsName.ServiceManager,
    employeePositionsName.Logistician
  ];

  const employeePositionsAuthorities = {
    authorities: ['SEE_BIG_ORDER_TABLE', 'SEE_CLIENTS_PAGE', 'SEE_CERTIFICATES', 'SEE_EMPLOYEES_PAGE', 'SEE_TARIFFS'],
    positionId: [3, 4, 5]
  };

  const listElementsAdminMock: listElements[] = [
    {
      link: 'assets/img/sidebarIcons/shopping-cart_icon.svg',
      name: 'ubs-sidebar.orders',
      routerLink: 'orders'
    },
    {
      link: './assets/img/sidebarIcons/achievement_icon.svg',
      name: 'ubs-sidebar.certificates',
      routerLink: 'certificates'
    },
    {
      link: 'assets/img/sidebarIcons/workers_icon.svg',
      name: 'ubs-sidebar.employees',
      routerLink: 'employee/1'
    },
    {
      link: 'assets/img/sidebarIcons/statistic_icon.svg',
      name: 'ubs-sidebar.tariffs',
      routerLink: 'tariffs'
    },
    {
      link: 'assets/img/sidebarIcons/none_notification_Bell.svg',
      name: 'ubs-sidebar.notifications',
      routerLink: 'notifications'
    },
    {
      link: 'assets/img/sidebarIcons/user_icon.svg',
      name: 'ubs-sidebar.user-agreement',
      routerLink: 'user-agreement'
    }
  ];

  const ubsAdminEmployeeServiceMock = jasmine.createSpyObj('ubsAdminEmployeeServiceMock', [
    'employeePositions$',
    'employeePositionsAuthorities$'
  ]);
  ubsAdminEmployeeServiceMock.employeePositions$ = new BehaviorSubject(employeePositionsMock);
  ubsAdminEmployeeServiceMock.employeePositionsAuthorities$ = new BehaviorSubject(employeePositionsAuthorities);

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [UbsAdminSidebarComponent, UbsBaseSidebarComponent],
      imports: [
        TranslateModule.forRoot(),
        HttpClientTestingModule,
        RouterModule.forRoot([]),
        MatSidenavModule,
        NoopAnimationsModule,
        MatIconModule,
        MatTooltipModule
      ],
      providers: [
        provideMockStore({ initialState }),
        { provide: Store, useValue: storeMock },
        { provide: UbsAdminEmployeeService, useValue: ubsAdminEmployeeServiceMock }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsAdminSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
