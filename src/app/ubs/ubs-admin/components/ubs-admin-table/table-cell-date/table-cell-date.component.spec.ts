import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TableCellDateComponent } from './table-cell-date.component';
import { AdminTableService } from 'src/app/ubs/ubs-admin/services/admin-table.service';
import { IAlertInfo } from 'src/app/ubs/ubs-admin/models/edit-cell.model';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { ChangeDetectorRef } from '@angular/core';
import { SetCursorWaite } from '../../../../../store/actions/ubs-admin.actions';

describe('TableCellDateComponent', () => {
  let component: TableCellDateComponent;
  let fixture: ComponentFixture<TableCellDateComponent>;
  let adminTableService: AdminTableService;
  let store: MockStore;
  let cdr: ChangeDetectorRef;

  const iAlertInfo: IAlertInfo[] = [
    { orderId: 1, userName: 'userName1' },
    { orderId: 2, userName: 'userName2' }
  ];

  const mockDatepicker: Partial<MatDatepicker<Date>> = {
    open: jasmine.createSpy('open'),
    close: jasmine.createSpy('close')
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TableCellDateComponent],
      imports: [HttpClientModule, NoopAnimationsModule, MatFormFieldModule, MatDatepickerModule, MatNativeDateModule, MatInputModule],
      providers: [AdminTableService, provideMockStore({ initialState: {} })]
    }).compileComponents();
  });

  beforeEach(() => {
    jasmine.clock().install();
    jasmine.clock().mockDate(new Date());

    fixture = TestBed.createComponent(TableCellDateComponent);
    component = fixture.componentInstance;
    adminTableService = TestBed.inject(AdminTableService);
    store = TestBed.inject(MockStore);
    cdr = fixture.componentRef.injector.get(ChangeDetectorRef);

    fixture.detectChanges();
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  describe('Component initialization', () => {
    it('should create component', () => {
      expect(component).toBeTruthy();
    });

    it('should set current date on initialization', () => {
      const mockDate = new Date();
      expect(component.current).toEqual(mockDate);
    });

    it('should initialize with default values', () => {
      expect(component.editDateCell).toBeDefined();
      expect(component.showBlockedInfo).toBeDefined();
    });
  });

  describe('edit() method', () => {
    beforeEach(() => {
      spyOn(store, 'dispatch');
      spyOn(cdr, 'markForCheck');
    });

    it('should return early if uneditableStatus is true', () => {
      component.uneditableStatus = true;
      spyOn(adminTableService, 'blockOrders');

      component.edit(mockDatepicker as MatDatepicker<Date>);

      expect(adminTableService.blockOrders).not.toHaveBeenCalled();
      expect(store.dispatch).not.toHaveBeenCalled();
    });

    it('should return early if keyboard event key is not Enter or Space', () => {
      component.uneditableStatus = false;
      const event = new KeyboardEvent('keydown', { key: 'Escape' });
      spyOn(adminTableService, 'blockOrders');

      component.edit(mockDatepicker as MatDatepicker<Date>, event);

      expect(adminTableService.blockOrders).not.toHaveBeenCalled();
    });

    it('should proceed if keyboard event key is Enter', () => {
      component.uneditableStatus = false;
      component.isAllChecked = false;
      component.ordersToChange = [];
      component.id = 1;
      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      spyOn(adminTableService, 'blockOrders').and.returnValue(of([]));

      component.edit(mockDatepicker as MatDatepicker<Date>, event);

      expect(adminTableService.blockOrders).toHaveBeenCalledWith([1]);
    });

    it('should proceed if keyboard event key is Space', () => {
      component.uneditableStatus = false;
      component.isAllChecked = false;
      component.ordersToChange = [];
      component.id = 1;
      const event = new KeyboardEvent('keydown', { key: ' ' });
      spyOn(adminTableService, 'blockOrders').and.returnValue(of([]));

      component.edit(mockDatepicker as MatDatepicker<Date>, event);

      expect(adminTableService.blockOrders).toHaveBeenCalledWith([1]);
    });

    it('should dispatch SetCursorWaite with true before blocking orders', () => {
      component.isAllChecked = false;
      component.ordersToChange = [];
      component.id = 1;
      spyOn(adminTableService, 'blockOrders').and.returnValue(of([]));

      component.edit(mockDatepicker as MatDatepicker<Date>);

      expect(store.dispatch).toHaveBeenCalledWith(SetCursorWaite({ isWaiting: true }));
    });

    it('should call blockOrders with empty array when isAllChecked is true', () => {
      component.isAllChecked = true;
      component.ordersToChange = [];
      spyOn(adminTableService, 'blockOrders').and.returnValue(of([]));

      component.edit(mockDatepicker as MatDatepicker<Date>);

      expect(adminTableService.blockOrders).toHaveBeenCalledWith([]);
    });

    it('should call blockOrders with ordersToChange when ordersToChange has items', () => {
      component.isAllChecked = false;
      component.ordersToChange = [1, 2, 3];
      spyOn(adminTableService, 'blockOrders').and.returnValue(of([]));

      component.edit(mockDatepicker as MatDatepicker<Date>);

      expect(adminTableService.blockOrders).toHaveBeenCalledWith([1, 2, 3]);
    });

    it('should call blockOrders with [id] when isAllChecked is false and ordersToChange is empty', () => {
      component.isAllChecked = false;
      component.ordersToChange = [];
      component.id = 5;
      spyOn(adminTableService, 'blockOrders').and.returnValue(of([]));

      component.edit(mockDatepicker as MatDatepicker<Date>);

      expect(adminTableService.blockOrders).toHaveBeenCalledWith([5]);
    });

    it('should open datepicker when blockOrders returns empty result', () => {
      component.isAllChecked = false;
      component.ordersToChange = [];
      component.id = 1;
      spyOn(adminTableService, 'blockOrders').and.returnValue(of([]));

      component.edit(mockDatepicker as MatDatepicker<Date>);

      expect(mockDatepicker.open).toHaveBeenCalled();
    });

    it('should emit showBlockedInfo when blockOrders returns blocked orders', () => {
      component.isAllChecked = false;
      component.ordersToChange = [];
      component.id = 1;
      spyOn(adminTableService, 'blockOrders').and.returnValue(of(iAlertInfo));
      spyOn(component.showBlockedInfo, 'emit');

      component.edit(mockDatepicker as MatDatepicker<Date>);

      expect(component.showBlockedInfo.emit).toHaveBeenCalledWith(iAlertInfo);
      expect(mockDatepicker.open).toHaveBeenCalled();
    });

    it('should dispatch SetCursorWaite with false after blockOrders completes', () => {
      component.isAllChecked = false;
      component.ordersToChange = [];
      component.id = 1;
      spyOn(adminTableService, 'blockOrders').and.returnValue(of([]));

      component.edit(mockDatepicker as MatDatepicker<Date>);

      expect(store.dispatch).toHaveBeenCalledWith(SetCursorWaite({ isWaiting: false }));
    });

    it('should prioritize ordersToChange over isAllChecked', () => {
      component.isAllChecked = true;
      component.ordersToChange = [10, 20];
      spyOn(adminTableService, 'blockOrders').and.returnValue(of([]));

      component.edit(mockDatepicker as MatDatepicker<Date>);

      expect(adminTableService.blockOrders).toHaveBeenCalledWith([10, 20]);
    });
  });

  describe('changeData() method', () => {
    it('should emit editDateCell with correct IEditCell object', () => {
      const dateEvent: any = { value: new Date(2024, 0, 15) };
      component.id = 1;
      component.nameOfColumn = 'deliveryDate';
      spyOn(component.editDateCell, 'emit');

      component.changeData(dateEvent);

      expect(component.editDateCell.emit).toHaveBeenCalledWith({
        id: 1,
        nameOfColumn: 'deliveryDate',
        newValue: '2024-01-15'
      });
    });

    it('should format date correctly with leading zeros', () => {
      const dateEvent: any = { value: new Date(2024, 8, 5) }; // September 5, 2024
      component.id = 2;
      component.nameOfColumn = 'orderDate';
      spyOn(component.editDateCell, 'emit');

      component.changeData(dateEvent);

      expect(component.editDateCell.emit).toHaveBeenCalledWith({
        id: 2,
        nameOfColumn: 'orderDate',
        newValue: '2024-09-05'
      });
    });

    it('should handle date at end of year correctly', () => {
      const dateEvent: any = { value: new Date(2024, 11, 31) }; // December 31, 2024
      component.id = 3;
      component.nameOfColumn = 'expiryDate';
      spyOn(component.editDateCell, 'emit');

      component.changeData(dateEvent);

      expect(component.editDateCell.emit).toHaveBeenCalledWith({
        id: 3,
        nameOfColumn: 'expiryDate',
        newValue: '2024-12-31'
      });
    });

    it('should handle date at start of year correctly', () => {
      const dateEvent: any = { value: new Date(2024, 0, 1) }; // January 1, 2024
      component.id = 4;
      component.nameOfColumn = 'startDate';
      spyOn(component.editDateCell, 'emit');

      component.changeData(dateEvent);

      expect(component.editDateCell.emit).toHaveBeenCalledWith({
        id: 4,
        nameOfColumn: 'startDate',
        newValue: '2024-01-01'
      });
    });

    it('should return early and log error when date value is null', () => {
      const dateEvent: any = { value: null };
      spyOn(console, 'error');
      spyOn(component.editDateCell, 'emit');

      component.changeData(dateEvent);

      expect(console.error).toHaveBeenCalledWith('Invalid date value received.');
      expect(component.editDateCell.emit).not.toHaveBeenCalled();
    });

    it('should return early and log error when date value is undefined', () => {
      const dateEvent: any = { value: undefined };
      spyOn(console, 'error');
      spyOn(component.editDateCell, 'emit');

      component.changeData(dateEvent);

      expect(console.error).toHaveBeenCalledWith('Invalid date value received.');
      expect(component.editDateCell.emit).not.toHaveBeenCalled();
    });

    it('should handle non-Date object by converting to Date', () => {
      const dateString = '2024-06-15';
      const dateEvent: any = { value: dateString };
      component.id = 5;
      component.nameOfColumn = 'testDate';
      spyOn(component.editDateCell, 'emit');

      component.changeData(dateEvent);

      expect(component.editDateCell.emit).toHaveBeenCalledWith({
        id: 5,
        nameOfColumn: 'testDate',
        newValue: '2024-06-15'
      });
    });
  });

  describe('Input properties', () => {
    it('should correctly set date input', () => {
      const testDate = new Date(2024, 5, 20);
      fixture.componentRef.setInput('date', testDate);
      fixture.detectChanges();

      expect(component.date).toEqual(testDate);
    });

    it('should correctly set nameOfColumn input', () => {
      fixture.componentRef.setInput('nameOfColumn', 'testColumn');
      fixture.detectChanges();

      expect(component.nameOfColumn).toBe('testColumn');
    });

    it('should correctly set id input', () => {
      fixture.componentRef.setInput('id', 100);
      fixture.detectChanges();

      expect(component.id).toBe(100);
    });

    it('should correctly set ordersToChange input', () => {
      const orders = [1, 2, 3, 4];
      fixture.componentRef.setInput('ordersToChange', orders);
      fixture.detectChanges();

      expect(component.ordersToChange).toEqual(orders);
    });

    it('should correctly set isAllChecked input', () => {
      fixture.componentRef.setInput('isAllChecked', true);
      fixture.detectChanges();

      expect(component.isAllChecked).toBe(true);
    });

    it('should correctly set uneditableStatus input', () => {
      fixture.componentRef.setInput('uneditableStatus', true);
      fixture.detectChanges();

      expect(component.uneditableStatus).toBe(true);
    });
  });

  describe('Integration scenarios', () => {
    it('should handle full edit flow when orders are not blocked', () => {
      component.id = 10;
      component.nameOfColumn = 'deliveryDate';
      component.isAllChecked = false;
      component.ordersToChange = [];
      component.uneditableStatus = false;

      spyOn(store, 'dispatch');
      spyOn(adminTableService, 'blockOrders').and.returnValue(of([]));

      component.edit(mockDatepicker as MatDatepicker<Date>);

      expect(store.dispatch).toHaveBeenCalledWith(SetCursorWaite({ isWaiting: true }));
      expect(adminTableService.blockOrders).toHaveBeenCalledWith([10]);
      expect(mockDatepicker.open).toHaveBeenCalled();
      expect(store.dispatch).toHaveBeenCalledWith(SetCursorWaite({ isWaiting: false }));
    });

    it('should handle full edit flow when orders are blocked', () => {
      component.id = 10;
      component.isAllChecked = false;
      component.ordersToChange = [];
      component.uneditableStatus = false;

      spyOn(store, 'dispatch');
      spyOn(adminTableService, 'blockOrders').and.returnValue(of(iAlertInfo));
      spyOn(component.showBlockedInfo, 'emit');
      spyOn(cdr, 'markForCheck');

      component.edit(mockDatepicker as MatDatepicker<Date>);

      expect(adminTableService.blockOrders).toHaveBeenCalledWith([10]);
      expect(component.showBlockedInfo.emit).toHaveBeenCalledWith(iAlertInfo);
      expect(mockDatepicker.open).toHaveBeenCalled();
      expect(store.dispatch).toHaveBeenCalledWith(SetCursorWaite({ isWaiting: false }));
    });
  });
});
