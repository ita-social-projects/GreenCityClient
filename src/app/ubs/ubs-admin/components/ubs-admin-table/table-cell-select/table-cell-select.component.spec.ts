import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { TableCellSelectComponent } from './table-cell-select.component';
import { AdminTableService } from 'src/app/ubs/ubs-admin/services/admin-table.service';
import { OrderService } from '../../../services/order.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { MatSelect, MatSelectChange } from '@angular/material/select';
import { NO_ERRORS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import { SetCursorWaite } from 'src/app/store/actions/ubs-admin.actions';
import { AddOrderCancellationReasonComponent } from '../../add-order-cancellation-reason/add-order-cancellation-reason.component';
import { UbsAdminConfirmStatusChangePopUpComponent } from '../../ubs-admin-confirm-status-change-pop-up/ubs-admin-confirm-status-change-pop-up.component';
import { UbsAdminSeveralOrdersPopUpComponent } from '../../ubs-admin-several-orders-pop-up/ubs-admin-several-orders-pop-up.component';
import { AddOrderNotTakenOutReasonComponent } from '@ubs/ubs-admin/components/add-order-not-taken-out-reason/add-order-not-taken-out-reason.component';

@Pipe({
  name: 'serverTranslate'
})
class MockServerTranslatePipe implements PipeTransform {
  transform(value: any, currentLang: string): any {
    if (value === undefined || value === null) {
      return '';
    }
    if (typeof value !== 'object' && typeof value !== 'function') {
      return value;
    }
    if (currentLang === 'uk') {
      return value.uk || value.uk;
    } else {
      return value.en;
    }
  }
}

describe('TableCellSelectComponent', () => {
  let component: TableCellSelectComponent;
  let fixture: ComponentFixture<TableCellSelectComponent>;
  let mockAdminTableService: jasmine.SpyObj<AdminTableService>;
  let mockOrderService: jasmine.SpyObj<OrderService>;
  let mockMatDialog: jasmine.SpyObj<MatDialog>;
  let mockStore: jasmine.SpyObj<Store>;
  let mockMatDialogRef: jasmine.SpyObj<MatDialogRef<any>>;
  let mockMatSelect: jasmine.SpyObj<MatSelect>;

  const mockOptionalData = [
    { key: 'NEW', en: 'New', uk: 'Нове' },
    { key: 'FORMED', en: 'Formed', uk: 'Сформовано' },
    { key: 'CONFIRMED', en: 'Confirmed', uk: 'Підтверджено' },
    { key: 'ON_THE_ROUTE', en: 'On the route', uk: 'В дорозі' },
    { key: 'DONE', en: 'Done', uk: 'Виконано' },
    { key: 'CANCELED', en: 'Canceled', uk: 'Скасовано' },
    { key: 'NOT_TAKEN_OUT', en: 'Not taken out', uk: 'Не вивезли' },
    { key: 'ADJUSTMENT', en: 'Adjustment', uk: 'Узгодження' }
  ];

  beforeEach(async () => {
    mockAdminTableService = jasmine.createSpyObj('AdminTableService', ['blockOrders', 'unblockOrders', 'howChangeCell']);
    mockOrderService = jasmine.createSpyObj('OrderService', ['getAvailableOrderStatuses']);
    mockMatDialog = jasmine.createSpyObj('MatDialog', ['open']);
    mockStore = jasmine.createSpyObj('Store', ['dispatch']);
    mockMatSelect = jasmine.createSpyObj('MatSelect', ['open']);

    await TestBed.configureTestingModule({
      declarations: [TableCellSelectComponent, MockServerTranslatePipe],
      providers: [
        { provide: AdminTableService, useValue: mockAdminTableService },
        { provide: OrderService, useValue: mockOrderService },
        { provide: MatDialog, useValue: mockMatDialog },
        { provide: Store, useValue: mockStore }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TableCellSelectComponent);
    component = fixture.componentInstance;

    component.optional = mockOptionalData;
    component.id = 1;
    component.nameOfColumn = 'orderStatus';
    component.key = 'NEW';
    component.lang = 'en';
    component.ordersToChange = [];
    component.isAllChecked = false;
    component.uneditableStatus = false;
    component.showPopUp = false;
    component.dataForPopUp = [];

    component.select = mockMatSelect;

    mockMatDialogRef = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
    mockMatDialogRef.afterClosed.and.returnValue(of(undefined));

    mockMatDialog.open.and.returnValue(mockMatDialogRef);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call filterStatuses', () => {
      component.optional = mockOptionalData;
      spyOn<any>(component, 'filterStatuses');
      component.ngOnInit();
      expect(component['filterStatuses']).toHaveBeenCalled();
    });
  });

  describe('onSelectClick', () => {
    it('should return early if isLocked is true', () => {
      component.isLocked = true;
      spyOn(component, 'lockOrder');
      component.onSelectClick(new Event('click'));
      expect(component.lockOrder).not.toHaveBeenCalled();
      expect(mockStore.dispatch).not.toHaveBeenCalled();
    });

    it('should call lockOrder and dispatch SetCursorWaite if isLocked is false', () => {
      component.isLocked = false;
      spyOn(component, 'lockOrder');
      component.onSelectClick(new Event('click'));
      expect(component.lockOrder).toHaveBeenCalled();
      expect(mockStore.dispatch).toHaveBeenCalledWith(SetCursorWaite({ isWaiting: true }));
    });
  });

  describe('onSelectClosed', () => {
    it('should call releaseLock', () => {
      spyOn<any>(component, 'releaseLock');
      component.onSelectClosed();
      expect(component['releaseLock']).toHaveBeenCalled();
    });
  });

  describe('lockOrder', () => {
    it('should call adminTableService.blockOrders', () => {
      component.select = mockMatSelect;
      mockAdminTableService.blockOrders.and.returnValue(of([]));
      component.lockOrder();
      expect(mockAdminTableService.blockOrders).toHaveBeenCalledWith([component.id]);
    });

    it('should emit editButtonClick on finalize', fakeAsync(() => {
      component.select = mockMatSelect;
      mockAdminTableService.blockOrders.and.returnValue(of([]));
      spyOn(component.editButtonClick, 'emit');
      component.lockOrder();
      tick();
      expect(component.editButtonClick.emit).toHaveBeenCalledWith(component.id);
    }));

    it('should dispatch SetCursorWaite with false on finalize', fakeAsync(() => {
      component.select = mockMatSelect;
      mockAdminTableService.blockOrders.and.returnValue(of([]));
      component.lockOrder();
      tick();
      expect(mockStore.dispatch).toHaveBeenCalledWith(SetCursorWaite({ isWaiting: false }));
    }));
  });

  describe('processLockResponse (private method)', () => {
    it('should set isLocked to true and open select if response is empty', fakeAsync(() => {
      component.select = mockMatSelect;
      component.dialog = mockMatDialog;
      component['processLockResponse']([]);
      tick();
      expect(component.isLocked).toBeTrue();
      expect(component.isBlocked).toBeFalse();
      expect(component.isDisabled).toBeFalse();
      expect(mockMatSelect.open).toHaveBeenCalled();
    }));
  });

  describe('save', () => {
    let findKeyForNewOptionSpy: jasmine.Spy;

    beforeEach(() => {
      findKeyForNewOptionSpy = spyOn<any>(component, 'findKeyForNewOption');
      spyOn(component.editCellSelect, 'emit');
      spyOn(component.cancelEdit, 'emit');
    });

    it('should emit cancelEdit if findKeyForNewOption returns -1', () => {
      findKeyForNewOptionSpy.and.returnValue(-1);
      mockAdminTableService.howChangeCell.and.returnValue([1]);
      component.save();
      expect(mockAdminTableService.howChangeCell).toHaveBeenCalledWith(component.isAllChecked, component.ordersToChange, component.id);
      expect(component.cancelEdit.emit).toHaveBeenCalledWith([1]);
      expect(component.editCellSelect.emit).not.toHaveBeenCalled();
    });
  });

  describe('saveClick', () => {
    beforeEach(() => {
      spyOn(component, 'save');
      spyOn(component, 'openConfirmPopUp');
      spyOn(component, 'openCancelPopUp');
      spyOn(component, 'notTakenOutOpenPop');
      spyOn(component, 'checkIfStatusConfirmed');
    });

    it('should call save if nameOfColumn is not orderStatus', () => {
      component.nameOfColumn = 'someOtherColumn';
      component.saveClick();
      expect(component.save).toHaveBeenCalled();
      expect(component.openConfirmPopUp).not.toHaveBeenCalled();
      expect(component.openCancelPopUp).not.toHaveBeenCalled();
      expect(component.notTakenOutOpenPop).not.toHaveBeenCalled();
      expect(component.checkIfStatusConfirmed).not.toHaveBeenCalled();
    });

    describe('when nameOfColumn is orderStatus', () => {
      beforeEach(() => {
        component.nameOfColumn = 'orderStatus';
      });

      it('should call openConfirmPopUp for "Formed" or "Підтверджено" (confirm options)', () => {
        component['newOption'] = 'Formed';
        component.saveClick();
        expect(component.openConfirmPopUp).toHaveBeenCalled();

        component['newOption'] = 'Підтверджено';
        component.saveClick();
        expect(component.openConfirmPopUp).toHaveBeenCalledTimes(2);
      });

      it('should call openCancelPopUp for "Canceled" or "Скасовано" (cancel options)', () => {
        component['newOption'] = 'Canceled';
        component.saveClick();
        expect(component.openCancelPopUp).toHaveBeenCalled();

        component['newOption'] = 'Скасовано';
        component.saveClick();
        expect(component.openCancelPopUp).toHaveBeenCalledTimes(2);
      });

      it('should call notTakenOutOpenPop for "Not taken out" or "Не вивезли" (not taken out options)', () => {
        component['newOption'] = 'Not taken out';
        component.saveClick();
        expect(component.notTakenOutOpenPop).toHaveBeenCalled();

        component['newOption'] = 'Не вивезли';
        component.saveClick();
        expect(component.notTakenOutOpenPop).toHaveBeenCalledTimes(2);
      });

      it('should call checkIfStatusConfirmed if checkStatus and showPopUp are true', () => {
        component['newOption'] = 'New';
        component['checkStatus'] = true;
        component.showPopUp = true;
        component.saveClick();
        expect(component.checkIfStatusConfirmed).toHaveBeenCalled();
      });

      it('should call save if no specific pop-up condition is met', () => {
        component['newOption'] = 'New';
        component['checkStatus'] = false;
        component.showPopUp = false;
        component.saveClick();
        expect(component.save).toHaveBeenCalled();
      });
    });
  });

  describe('checkIfStatusConfirmed', () => {
    beforeEach(() => {
      spyOn(component, 'save');
      spyOn<any>(component, 'openPopUp');
    });

    it('should call save if newOption is "Confirmed" or "Підтверджено"', () => {
      component['newOption'] = 'Confirmed';
      component.checkIfStatusConfirmed();
      expect(component.save).toHaveBeenCalled();

      component['newOption'] = 'Підтверджено';
      component.checkIfStatusConfirmed();
      expect(component.save).toHaveBeenCalledTimes(2);
      expect(component['openPopUp']).not.toHaveBeenCalled();
    });

    it('should call openPopUp if newOption is neither "Confirmed" nor "Підтверджено"', () => {
      component['newOption'] = 'New';
      component.checkIfStatusConfirmed();
      expect(component['openPopUp']).toHaveBeenCalled();
      expect(component.save).not.toHaveBeenCalled();
    });
  });

  describe('cancel', () => {
    it('should call adminTableService.howChangeCell', () => {
      mockAdminTableService.howChangeCell.and.returnValue([1]);
      component.cancel();
      expect(mockAdminTableService.howChangeCell).toHaveBeenCalledWith(component.isAllChecked, component.ordersToChange, component.id);
    });

    it('should emit cancelEdit with the type of change', () => {
      mockAdminTableService.howChangeCell.and.returnValue([1]);
      spyOn(component.cancelEdit, 'emit');
      component.cancel();
      expect(component.cancelEdit.emit).toHaveBeenCalledWith([1]);
    });

    it('should reset newOption and restore currentValue to oldOption', () => {
      component['newOption'] = 'SomeNewOption';
      component['oldOption'] = 'OldValue';
      component.currentValue = 'ChangedValue';
      component.cancel();
      expect(component['newOption']).toBe('');
      expect(component.currentValue).toBe(component['oldOption']);
    });
  });

  describe('chosenOption', () => {
    let mockEvent: MatSelectChange;
    let findKeyForNewOptionSpy: jasmine.Spy;
    let filterStatusesForPopUpSpy: jasmine.Spy;

    beforeEach(() => {
      mockEvent = { value: 'Formed' } as MatSelectChange;
      findKeyForNewOptionSpy = spyOn<any>(component, 'findKeyForNewOption').and.returnValue(1);
      filterStatusesForPopUpSpy = spyOn<any>(component, 'filterStatusesForPopUp').and.returnValue(true);
      spyOn(component, 'saveClick');
    });

    it('should set newOption to the event value', () => {
      component.chosenOption(mockEvent);
      expect(component['newOption']).toBe('Formed');
    });

    it('should call filterStatusesForPopUp and set checkStatus', () => {
      component.chosenOption(mockEvent);
      expect(filterStatusesForPopUpSpy).toHaveBeenCalled();
      expect(component['checkStatus']).toBeTrue();
    });
  });

  describe('openCancelPopUp', () => {
    beforeEach(() => {
      spyOn(component, 'cancel');
      spyOn(component, 'save');
      spyOn(component.orderCancellation, 'emit');
    });

    it('should open AddOrderCancellationReasonComponent', () => {
      const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
      dialogRefSpy.afterClosed.and.returnValue(of({}));
      mockMatDialog.open.and.returnValue(dialogRefSpy);

      component.openCancelPopUp();
      expect(mockMatDialog.open).toHaveBeenCalledWith(AddOrderCancellationReasonComponent, { hasBackdrop: true });
    });

    it('should call cancel if dialog returns { action: "cancel" }', fakeAsync(() => {
      const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);

      dialogRefSpy.afterClosed.and.returnValue(of({ action: 'cancel' }));
      mockMatDialog.open.and.returnValue(dialogRefSpy);

      component.openCancelPopUp();
      tick();
      expect(component.cancel).toHaveBeenCalled();
      expect(component.orderCancellation.emit).not.toHaveBeenCalled();
      expect(component.save).not.toHaveBeenCalled();
    }));

    it('should emit orderCancellation and call save if dialog returns cancellation data (OTHER reason)', fakeAsync(() => {
      const mockResult = { reason: 'OTHER', comment: 'Some comment' };

      const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
      dialogRefSpy.afterClosed.and.returnValue(of(mockResult));
      mockMatDialog.open.and.returnValue(dialogRefSpy);

      component.openCancelPopUp();
      tick();
      expect(component.orderCancellation.emit).toHaveBeenCalledWith({
        cancellationReason: 'OTHER',
        cancellationComment: 'Some comment'
      });
      expect(component.save).toHaveBeenCalled();
      expect(component.cancel).not.toHaveBeenCalled();
    }));

    it('should emit orderCancellation and call save if dialog returns cancellation data (non-OTHER reason)', fakeAsync(() => {
      const mockResult = { reason: 'NO_MONEY', comment: null };

      const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
      dialogRefSpy.afterClosed.and.returnValue(of(mockResult));
      mockMatDialog.open.and.returnValue(dialogRefSpy);

      component.openCancelPopUp();
      tick();
      expect(component.orderCancellation.emit).toHaveBeenCalledWith({
        cancellationReason: 'NO_MONEY',
        cancellationComment: null
      });
      expect(component.save).toHaveBeenCalled();
      expect(component.cancel).not.toHaveBeenCalled();
    }));
  });

  describe('openConfirmPopUp', () => {
    beforeEach(() => {
      spyOn(component, 'cancel');
      spyOn(component, 'save');

      const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
      dialogRefSpy.afterClosed.and.returnValue(of(undefined));
      mockMatDialog.open.and.returnValue(dialogRefSpy);
      mockMatDialogRef = dialogRefSpy;
    });

    it('should open UbsAdminConfirmStatusChangePopUpComponent with newOption data', () => {
      component['newOption'] = 'Confirmed';
      component.openConfirmPopUp();
      expect(mockMatDialog.open).toHaveBeenCalledWith(
        UbsAdminConfirmStatusChangePopUpComponent,
        jasmine.objectContaining({ data: { newOption: 'Confirmed' } })
      );
    });

    it('should call cancel if dialog returns false', fakeAsync(() => {
      mockMatDialogRef.afterClosed.and.returnValue(of(false));
      component.openConfirmPopUp();
      tick();
      expect(component.cancel).toHaveBeenCalled();
      expect(component.save).not.toHaveBeenCalled();
    }));

    it('should call save if dialog returns true', fakeAsync(() => {
      mockMatDialogRef.afterClosed.and.returnValue(of(true));
      component.openConfirmPopUp();
      tick();
      expect(component.save).toHaveBeenCalled();
      expect(component.cancel).not.toHaveBeenCalled();
    }));
  });

  describe('openPopUp (private method)', () => {
    let mockModalRefComponentInstance: any;

    beforeEach(() => {
      spyOn(component, 'save');
      spyOn(component, 'cancel');

      mockModalRefComponentInstance = {
        dataFromTable: null,
        ordersId: null,
        currentLang: null
      };

      const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
      dialogRefSpy.afterClosed.and.returnValue(of(undefined));
      mockMatDialog.open.and.returnValue({
        ...dialogRefSpy,
        componentInstance: mockModalRefComponentInstance
      } as MatDialogRef<any>);
      mockMatDialogRef = dialogRefSpy;
    });

    it('should open UbsAdminSeveralOrdersPopUpComponent and set its instance properties', () => {
      component['openPopUp']();
      expect(mockMatDialog.open).toHaveBeenCalledWith(
        UbsAdminSeveralOrdersPopUpComponent,
        jasmine.objectContaining({ disableClose: true })
      );

      expect(mockModalRefComponentInstance.dataFromTable).toEqual(component.dataForPopUp);
      expect(mockModalRefComponentInstance.ordersId).toEqual(component.ordersToChange);
      expect(mockModalRefComponentInstance.currentLang).toEqual(component.lang);
    });

    it('should call save if dialog returns true', fakeAsync(() => {
      mockMatDialogRef.afterClosed.and.returnValue(of(true));
      component['openPopUp']();
      tick();
      expect(component.save).toHaveBeenCalled();
      expect(component.cancel).not.toHaveBeenCalled();
    }));

    it('should call cancel if dialog returns false', fakeAsync(() => {
      mockMatDialogRef.afterClosed.and.returnValue(of(false));
      component['openPopUp']();
      tick();
      expect(component.cancel).toHaveBeenCalled();
      expect(component.save).not.toHaveBeenCalled();
    }));
  });

  describe('notTakenOutOpenPop', () => {
    beforeEach(() => {
      spyOn(component, 'cancel');
      spyOn(component, 'save');

      const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
      dialogRefSpy.afterClosed.and.returnValue(of(undefined));
      mockMatDialog.open.and.returnValue(dialogRefSpy);
      mockMatDialogRef = dialogRefSpy;
    });

    it('should open AddOrderNotTakenOutReasonComponent with order id', () => {
      component.notTakenOutOpenPop();
      expect(mockMatDialog.open).toHaveBeenCalledWith(AddOrderNotTakenOutReasonComponent, {
        hasBackdrop: true,
        data: {
          id: component.id
        }
      });
    });

    it('should call save if dialog returns true', fakeAsync(() => {
      mockMatDialogRef.afterClosed.and.returnValue(of(true));
      component.notTakenOutOpenPop();
      tick();
      expect(component.save).toHaveBeenCalled();
      expect(component.cancel).not.toHaveBeenCalled();
    }));

    it('should call cancel if dialog returns false', fakeAsync(() => {
      mockMatDialogRef.afterClosed.and.returnValue(of(false));
      component.notTakenOutOpenPop();
      tick();
      expect(component.cancel).toHaveBeenCalled();
      expect(component.save).not.toHaveBeenCalled();
    }));
  });

  describe('filterStatuses (private method)', () => {
    it('should call orderService.getAvailableOrderStatuses if nameOfColumn is orderStatus', () => {
      component.nameOfColumn = 'orderStatus';
      component.key = 'NEW';
      component['filterStatuses']();
      expect(mockOrderService.getAvailableOrderStatuses).toHaveBeenCalledWith(component.key, component.optional);
    });

    it('should not call orderService.getAvailableOrderStatuses if nameOfColumn is not orderStatus', () => {
      mockOrderService.getAvailableOrderStatuses.calls.reset();
      component.nameOfColumn = 'someOtherColumn';
      component['filterStatuses']();
      expect(mockOrderService.getAvailableOrderStatuses).not.toHaveBeenCalled();
    });
  });

  describe('filterStatusesForPopUp (private method)', () => {
    let findKeyForNewOptionSpy: jasmine.Spy;

    beforeEach(() => {
      findKeyForNewOptionSpy = spyOn<any>(component, 'findKeyForNewOption');
    });

    it('should return true if newOption corresponds to a status requiring pop-up', () => {
      component.optional = mockOptionalData;
      findKeyForNewOptionSpy.and.returnValue(5);
      component['newOption'] = 'Скасовано';

      expect(component['filterStatusesForPopUp']()).toBeFalse();

      findKeyForNewOptionSpy.and.returnValue(2);
      component['newOption'] = 'Підтверджено';
      expect(component['filterStatusesForPopUp']()).toBeTrue();

      findKeyForNewOptionSpy.and.returnValue(7);
      component['newOption'] = 'Узгодження';
      expect(component['filterStatusesForPopUp']()).toBeTrue();
    });

    it('should return false if newOption does not correspond to a status requiring pop-up', () => {
      component.optional = mockOptionalData;
      findKeyForNewOptionSpy.and.returnValue(0);
      component['newOption'] = 'New';
      expect(component['filterStatusesForPopUp']()).toBeFalse();
    });
  });

  describe('findKeyForNewOption (private method)', () => {
    it('should return the correct index for a given newOption in English', () => {
      component.optional = mockOptionalData;
      component.lang = 'en';
      component['newOption'] = 'Formed';
      expect(component['findKeyForNewOption']()).toBe(1);
    });

    it('should return the correct index for a given newOption in Ukrainian', () => {
      component.optional = mockOptionalData;
      component.lang = 'uk';
      component['newOption'] = 'Сформовано';
      expect(component['findKeyForNewOption']()).toBe(1);
    });

    it('should return -1 if newOption is not found', () => {
      component.optional = mockOptionalData;
      component.lang = 'en';
      component['newOption'] = 'NonExistentOption';
      expect(component['findKeyForNewOption']()).toBe(-1);
    });
  });
});
