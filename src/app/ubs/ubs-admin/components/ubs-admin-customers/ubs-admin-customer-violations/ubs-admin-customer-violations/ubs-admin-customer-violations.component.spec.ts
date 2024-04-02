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

  it('after nginit getViolations and setDisplayedColumns should be called', () => {
    spyOn(component as any, 'setDisplayedColumns');
    spyOn(component, 'getViolations');
    component.ngOnInit();
    expect((component as any).setDisplayedColumns).toHaveBeenCalled();
    expect(component.getViolations).toHaveBeenCalled();
    expect(component.columns.length > 1).toBe(true);
  });

  it('getViolations call userName should be be John, and getCustomerViolations should been called', () => {
    AdminCustomersServiceFake.getCustomerViolations.calls.reset();
    component.isLoading = true;
    component.getViolations();
    expect(component.isLoading).toBe(false);
    expect(component.username).toBe('John');
    expect((component as any).totalElements).toBe(2);
    expect((component as any).adminCustomerService.getCustomerViolations).toHaveBeenCalledTimes(1);
  });

  it('updateViolations should call', () => {
    AdminCustomersServiceFake.getCustomerViolations.calls.reset();
    (component as any).id = '1';
    (component as any).page = 1;
    (component as any).sortingColumn = 'sort';
    (component as any).updateViolations();
    expect((component as any).adminCustomerService.getCustomerViolations).toHaveBeenCalledTimes(1);
    expect((component as any).adminCustomerService.getCustomerViolations).toHaveBeenCalledWith('1', 1, 'sort', 'ASC');
  });

  it('onScroll should create', () => {
    spyOn(component as any, 'updateViolations');
    (component as any).updateViolations.calls.reset();
    component.onScroll();
    expect((component as any).updateViolations).toHaveBeenCalledTimes(1);
  });

  it('onSortTable should call', () => {
    spyOn(component, 'getViolations');
    component.onSortTable('column', 'sortingType');
    expect((component as any).sortingColumn).toBe('column');
    expect(component.getViolations).toHaveBeenCalledTimes(1);
  });

  it('goBack should call router with parameters', () => {
    component.goBack();
    expect((component as any).router.navigate).toHaveBeenCalledWith(['ubs-admin', 'customers']);
  });

  it('openOrder should call', () => {
    RouteFake.navigate.and.returnValue(
      new Promise((res) => {
        return true;
      })
    );
    component.openOrder(2);
    expect((component as any).router.navigate).toHaveBeenCalledWith([]);
  });

  it('openModal should call dialog.open once', () => {
    spyOn((component as any).dialog, 'open');
    component.openModal('John');
    expect((component as any).dialog.open).toHaveBeenCalledTimes(1);
  });
});
