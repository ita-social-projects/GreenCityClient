import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { AddViolationsComponent } from '../../../add-violations/add-violations.component';
import { MatTooltipModule } from '@angular/material/tooltip';

import { UbsAdminCustomerViolationsComponent } from './ubs-admin-customer-violations.component';
import { AdminCustomersService } from 'src/app/ubs/ubs-admin/services/admin-customers.service';
import { of } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MatTableModule } from '@angular/material/table';
import { ServerTranslatePipe } from 'src/app/shared/translate-pipe/translate-pipe.pipe';
import { ResizeColumnDirective } from 'src/app/ubs/ubs-admin/derictives/resize-table-columns.directive';

describe('UbsAdminCustomerViolationsComponent', () => {
  let component: UbsAdminCustomerViolationsComponent;
  let fixture: ComponentFixture<UbsAdminCustomerViolationsComponent>;

  const ActivatedRouteFake = {
    params: of({
      id: '1'
    })
  };
  const RouteFake = jasmine.createSpyObj('router', ['navigate']);

  const AddViolationsComponentFake = {};

  const MatDialogFake = {
    open() {
      return {};
    }
  };
  const AdminCustomersServiceFake = jasmine.createSpyObj('adminCustomerService', ['getCustomerViolations']);
  AdminCustomersServiceFake.getCustomerViolations.and.returnValue(
    of({
      userViolationsDto: {
        currentPage: 1,
        page: [1, 2, 3],
        totalElements: 2,
        totalPages: 3
      },
      fullName: 'John'
    })
  );

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [UbsAdminCustomerViolationsComponent, ServerTranslatePipe, ResizeColumnDirective],
      imports: [TranslateModule.forRoot(), InfiniteScrollModule, MatTableModule, MatTooltipModule],
      providers: [
        { provide: ActivatedRoute, useValue: ActivatedRouteFake },
        { provide: Router, useValue: RouteFake },
        { provide: MatDialog, useValue: MatDialogFake },
        { provide: AdminCustomersService, useValue: AdminCustomersServiceFake },
        { provide: AddViolationsComponent, useValue: AddViolationsComponentFake }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbsAdminCustomerViolationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('component should create', () => {
    expect(component).toBeTruthy();
  });
});
