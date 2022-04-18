import { MatMenuModule } from '@angular/material/menu';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CdkTableModule } from '@angular/cdk/table';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from 'src/app/shared/shared.module';
import { UbsAdminTableComponent } from './ubs-admin-table.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TranslateModule } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { MatDialogConfig } from '@angular/material/dialog';
import { ServerTranslatePipe } from 'src/app/shared/translate-pipe/translate-pipe.pipe';
import { MatTooltipModule } from '@angular/material/tooltip';

describe('UsbAdminTableComponent', () => {
  let component: UbsAdminTableComponent;
  let fixture: ComponentFixture<UbsAdminTableComponent>;
  const storeMock = jasmine.createSpyObj('store', ['select', 'dispatch']);
  storeMock.select = () => of(false);

  const FakeMatDialogConfig = {};

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        MatIconModule,
        MatMenuModule,
        MatPaginatorModule,
        MatTableModule,
        CdkTableModule,
        DragDropModule,
        HttpClientTestingModule,
        MatCheckboxModule,
        BrowserAnimationsModule,
        SharedModule,
        InfiniteScrollModule,
        TranslateModule.forRoot(),
        MatTooltipModule
      ],
      declarations: [UbsAdminTableComponent, ServerTranslatePipe],
      providers: [
        { provide: Store, useValue: storeMock },
        { provide: MatDialogConfig, useValue: FakeMatDialogConfig }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    storeMock.select = () => of(false);
    fixture = TestBed.createComponent(UbsAdminTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    // console.log(component.modelChanged);
    expect(component).toBeTruthy();
  });

  it('ngOnInit', () => {
    spyOn(component.modelChanged, 'pipe').and.returnValue(of({}));
    component.ngOnInit();
    expect(component.modelChanged.pipe).toHaveBeenCalled();
  });

  it('ordersViewParameters$ expect displayedColumns should be [title]', () => {
    storeMock.select = () => of({ titles: 'title' });
    component.ordersViewParameters$ = (component as any).store.select();
    component.ngOnInit();
    component.ordersViewParameters$.subscribe((item: any) => {
      expect(component.displayedColumns).toEqual(['title']);
    });
  });

  it('bigOrderTable$ expect changeView has call', () => {
    spyOn(component, 'changeView');
    storeMock.select = () => of({ number: 2, totalElements: 10, content: [{ content: 'content' }], totalPages: 1 });
    component.bigOrderTable$ = (component as any).store.select();
    component.ngOnInit();
    component.bigOrderTable$.subscribe((items: any) => {
      expect(component.currentPage).toBe(2);
      expect(component.tableData[0].content).toBe('content');
      expect(component.changeView).toHaveBeenCalledTimes(1);
    });
  });

  it('bigOrderTable$ expect totalElements to be 10 ', () => {
    storeMock.select = () => of({ number: 2, totalElements: 10, content: [{ content: 'content' }], totalPages: 1 });
    component.bigOrderTable$ = (component as any).store.select();
    component.firstPageLoad = true;
    component.ngOnInit();
    component.bigOrderTable$.subscribe((items: any) => {
      expect(component.totalElements).toBe(10);
    });
  });

  it('bigOrderTableParams ', () => {
    spyOn(component, 'setColumnsForFiltering');
    spyOn(component, 'sortColumnsToDisplay');
    spyOn(component as any, 'getTable');
    storeMock.select = () =>
      of({
        columnBelongingList: ['columnBelongingList'],
        columnDTOList: [
          {
            columnBelonging: 'string',
            editType: 'string',
            filtered: false,
            index: 1,
            title: { key: 'key', ua: 'ua', en: 'en', filtered: false }
          }
        ],
        orderSearchCriteria: {},
        page: {}
      });
    component.bigOrderTableParams$ = (component as any).store.select();
    component.isStoreEmpty = true;
    component.ngOnInit();
    component.bigOrderTableParams$.subscribe((columns: any) => {
      expect(component.tableViewHeaders).toEqual(['columnBelongingList']);
      expect(component.displayedColumnsViewTitles).toEqual(['key']);
      expect(component.setColumnsForFiltering).toHaveBeenCalledTimes(1);
      expect((component as any).getTable).toHaveBeenCalledTimes(1);
      expect(component.sortColumnsToDisplay).toHaveBeenCalledTimes(1);
    });
  });

  it('ngAfterViewChecked ', () => {
    component.isTableHeightSet = false;
    spyOn((component as any).tableHeightService, 'setTableHeightToContainerHeight').and.returnValue(true);
    spyOn((component as any).cdr, 'detectChanges');
    spyOn(component, 'onScroll');
    component.ngAfterViewChecked();
    expect((component as any).cdr.detectChanges).toHaveBeenCalledTimes(1);
    expect(component.isTableHeightSet).toBe(true);
  });

  it('applyFilter call, expect modelChanged should been called with filter', () => {
    const filter = 'filter';
    spyOn(component.modelChanged, 'next');
    component.applyFilter(filter);
    expect(component.modelChanged.next).toHaveBeenCalledWith('filter');
  });

  it('isAllSelected expect return true', () => {
    component.selection = { selected: [1, 2] } as any;
    component.dataSource = { data: [1, 2] } as any;
    const Res = component.isAllSelected();
    expect(Res).toBe(true);
  });

  it('masterToggle expect selection.clear have been called ', () => {
    spyOn(component, 'isAllSelected').and.returnValue(true);
    const Spy = spyOn(component.selection, 'clear');
    component.masterToggle();
    expect(Spy).toHaveBeenCalledTimes(1);
  });

  it('masterToggle  expect selection.selected changed', () => {
    component.dataSource = { data: [1, 2] } as any;
    spyOn(component, 'isAllSelected').and.returnValue(false);
    component.masterToggle();
    expect(component.selection.selected).toEqual([1, 2]);
  });

  it('checkboxLabel should return select all', () => {
    spyOn(component, 'isAllSelected').and.returnValue(true);
    const Res = component.checkboxLabel();
    expect(Res).toBe('select all');
  });

  it('checkboxLabel should return deselect all', () => {
    spyOn(component, 'isAllSelected').and.returnValue(false);
    const Res = component.checkboxLabel();
    expect(Res).toBe('deselect all');
  });

  it('checkboxLabel should return select row 2', () => {
    const Res = component.checkboxLabel({ id: 1 });
    expect(Res).toBe('select row 2');
  });

  it('showBlockedMessage', () => {
    component.dataSource = { filteredData: [{ id: 1 }] } as any;
    component.showBlockedMessage([{ orderId: 1, userName: 'name' }]);
    expect(component.blockedInfo[0].userName).toEqual('name');
  });

  it('changeColumns true expect  component.isAll to be true', () => {
    component.isAll = false;
    component.count = 1;
    component.changeColumns(true, 'key', 2);
    expect(component.isAll).toBe(true);
  });

  it('changeColumns false expect  component.isAll to be true', () => {
    component.isAll = false;
    component.displayedColumns = ['name'];
    component.count = 1;
    component.changeColumns(false, '2', 2);
    expect(component.isAll).toBe(true);
  });

  it('togglePopUp expect store.dispatch have been called', () => {
    storeMock.dispatch.calls.reset();
    component.displayedColumns = ['1', '2'];
    component.isPopupOpen = true;
    component.togglePopUp();
    expect(component.previousSettings).toEqual(['1', '2']);
    expect((component as any).store.dispatch).toHaveBeenCalledTimes(1);
  });

  it('showAllColumns called with false expect setDisplayedColumns has been called', () => {
    spyOn(component as any, 'setDisplayedColumns');
    component.showAllColumns(false);
    expect((component as any).setDisplayedColumns).toHaveBeenCalledTimes(1);
  });

  it('showAllColumns called with true expect setUnDisplayedColumns has been called', () => {
    spyOn(component as any, 'setUnDisplayedColumns');
    component.showAllColumns(true);
    expect((component as any).setUnDisplayedColumns).toHaveBeenCalledTimes(1);
  });

  it('getColumns should call store.dispatch', () => {
    storeMock.dispatch.calls.reset();
    (component as any).getColumns();
    expect((component as any).store.dispatch).toHaveBeenCalledTimes(1);
  });

  it('getTable', () => {
    storeMock.dispatch.calls.reset();
    component.isLoading = false;
    (component as any).getTable('filterValue');
    expect((component as any).store.dispatch).toHaveBeenCalledTimes(1);
    expect(component.isLoading).toBe(true);
  });

  it('changeView expect tableData should change view', () => {
    component.tableData = [{ amountDue: '5.4hrn', totalOrderSum: '300hrn', orderCertificateCode: '1, 2' }];
    component.changeView();
    expect(component.tableData[0]).toEqual({
      amountDue: '5.40',
      orderCertificateCode: '1, 2',
      orderCertificatePoints: '3',
      totalOrderSum: '300.00'
    });
  });

  it('updateTableData should call store.dispatch', () => {
    storeMock.dispatch.calls.reset();
    component.updateTableData();
    expect((component as any).store.dispatch).toHaveBeenCalledTimes(1);
  });

  it('getSortingData', () => {
    component.arrowDirection = '';
    component.filterValue = 'filterValue';
    spyOn(component as any, 'getTable');
    component.getSortingData('columnName', 'sortingType');
    expect((component as any).getTable).toHaveBeenCalledWith('filterValue', 'columnName', 'sortingType', true);
    expect(component.arrowDirection).toBe('columnName');
  });

  it('onScroll', () => {
    spyOn(component, 'updateTableData');
    component.isUpdate = false;
    component.currentPage = 1;
    component.totalPages = 2;
    component.onScroll();
    expect(component.updateTableData).toHaveBeenCalledTimes(1);
    expect(component.currentPage).toBe(2);
  });

  it('editDetails', () => {
    spyOn(component.dataForPopUp, 'push');
    component.displayedColumnsView = [{ title: { key: 'receivingStation' } }, { title: { key: '' } }];
    component.editDetails();
    expect(component.dataForPopUp.push).toHaveBeenCalledTimes(1);
  });

  it('openPopUpRequires', () => {
    component.showPopUp = true;
    component.idsToChange = [];
    component.tableData = [{ id: 1 }];
    component.openPopUpRequires(1);
    expect(component.showPopUp).toBe(false);
  });

  it('selectRowsToChange true', () => {
    component.idsToChange = [];
    component.selectRowsToChange({ checked: true }, 1);
    expect(component.idsToChange).toEqual([1]);
  });

  it('selectRowsToChange false expect idsToChange change', () => {
    component.idsToChange = [2, 1];
    component.selectRowsToChange({ checked: false }, 1);
    expect(component.idsToChange).toEqual([2]);
  });

  it('selectAll with true expect allChecked to be true ', () => {
    component.allChecked = false;
    component.idsToChange = [1];
    component.selectAll(true);
    expect(component.allChecked).toBe(true);
    expect(component.idsToChange).toEqual([]);
  });

  it('selectAll with false expect allChecked to be false ', () => {
    component.allChecked = true;
    component.selectAll(false);
    expect(component.allChecked).toBe(false);
  });

  it('editCell expect editAll has called', () => {
    component.idsToChange.length = 1;
    spyOn(component as any, 'editAll');
    component.allChecked = true;
    component.editCell({ id: 1, nameOfColumn: '3', newValue: 'value' });
    expect((component as any).editAll).toHaveBeenCalledWith({ id: 1, nameOfColumn: '3', newValue: 'value' });
  });

  it('editCell expect editSingle has called', () => {
    component.idsToChange.length = 0;
    spyOn(component as any, 'editSingle');
    component.allChecked = false;
    component.editCell({ id: 1, nameOfColumn: '3', newValue: 'value' });
    expect((component as any).editSingle).toHaveBeenCalledWith({ id: 1, nameOfColumn: '3', newValue: 'value' });
  });

  it('editCell expect editGroup has called', () => {
    component.idsToChange.length = 1;
    spyOn(component as any, 'editGroup');
    component.allChecked = false;
    component.editCell({ id: 1, nameOfColumn: '3', newValue: 'value' });
    expect((component as any).editGroup).toHaveBeenCalledWith({ id: 1, nameOfColumn: '3', newValue: 'value' });
  });

  it('cancelEditCell ', () => {
    component.idsToChange = [1];
    component.allChecked = true;
    spyOn((component as any).adminTableService, 'cancelEdit').and.returnValue(of({}));
    component.cancelEditCell([1, 2]);
    expect((component as any).adminTableService.cancelEdit).toHaveBeenCalledWith([1, 2]);
    expect(component.idsToChange).toEqual([]);
    expect(component.allChecked).toBe(false);
  });

  it('closeAlertMess expect blockedInfo to be empty ', () => {
    component.blockedInfo = [{ orderId: 1, userName: 'name}' }];
    component.closeAlertMess();
    expect(component.blockedInfo).toEqual([]);
  });

  it('setDisplayedColumns  expect displayedColumnsViewTitles should change', () => {
    component.isAll = false;
    component.displayedColumnsView = [{ title: { key: 'key' } }];
    (component as any).setDisplayedColumns();
    expect(component.displayedColumnsViewTitles).toEqual(['key']);
    expect(component.count).toBe(1);
    expect(component.isAll).toBe(true);
  });

  it('setUnDisplayedColumns expect displayedColumnsViewTitles should be empty', () => {
    component.displayedColumnsViewTitles = ['not empty'];
    component.isAll = true;
    (component as any).setUnDisplayedColumns();
    expect(component.displayedColumnsViewTitles).toEqual([]);
    expect(component.isAll).toBe(false);
  });

  it('editSingle expect openPopUpRequires and postData should be call', () => {
    spyOn(component, 'openPopUpRequires');
    spyOn(component as any, 'postData');
    component.tableData = [{ id: 2, columnName: 'prevValue' }];
    (component as any).editSingle({ id: 2, nameOfColumn: 'columnName', newValue: 'value' });
    expect(component.tableData).toEqual([{ id: 2, columnName: 'value' }]);
    expect(component.openPopUpRequires).toHaveBeenCalledWith(0);
    expect((component as any).postData).toHaveBeenCalledWith([2], 'columnName', 'value');
  });

  it('editGroup expect postData should be call', () => {
    spyOn(component as any, 'postData');
    component.idsToChange = [1, 2];
    component.tableData = [{ id: 2, columnName: 'prevValue' }];
    (component as any).editGroup({ id: 2, nameOfColumn: 'columnName', newValue: 'value' });
    expect(component.tableData).toEqual([{ id: 2, columnName: 'value' }]);
    expect((component as any).postData).toHaveBeenCalledWith([1, 2], 'columnName', 'value');
  });

  it('editAll expect postData should be call with arguments', () => {
    spyOn(component as any, 'postData');
    component.idsToChange = [1, 2];
    component.tableData = [{ id: 2, columnName: 'prevValue' }];
    (component as any).editAll({ id: 2, nameOfColumn: 'columnName', newValue: 'value' });
    expect(component.idsToChange).toEqual([]);
    expect((component as any).postData).toHaveBeenCalledWith([], 'columnName', 'value');
  });

  it('postData expect store.dispatch should be call', () => {
    component.isPostData = false;
    storeMock.dispatch.calls.reset();
    (component as any).postData([1, 2], 'columnName', 'value');
    expect((component as any).store.dispatch).toHaveBeenCalledTimes(1);
    expect(component.isPostData).toBe(true);
  });

  it('openOrder expect router.navigate should be call with arguments', () => {
    spyOn((component as any).router, 'navigate');
    component.openOrder(1);
    expect((component as any).router.navigate).toHaveBeenCalledWith(['ubs-admin', 'order', '1']);
  });

  it('showTooltip', () => {
    const tooltip = {
      toggle() {
        return true;
      }
    };
    spyOn(tooltip, 'toggle');
    component.currentLang = 'ua';
    component.showTooltip({ ua: 'title on Ukrainian', en: '' }, tooltip);
    expect(tooltip.toggle).toHaveBeenCalledTimes(1);
  });

  it('getColumnsForFiltering should return object', () => {
    (component as any).adminTableService.columnsForFiltering = [{ value: 'one' }] as any;
    const Res = component.getColumnsForFiltering();
    expect(Res[0]).toEqual({ value: 'one' } as any);
  });

  it('changeFilters expect changeFilters shoud be call', () => {
    spyOn((component as any).adminTableService, 'changeFilters');
    component.changeFilters(true, 'currentColumn', { filtered: true });
    expect((component as any).adminTableService.changeFilters).toHaveBeenCalledWith(true, 'currentColumn', { filtered: true });
  });

  it('changeDateFilters expect changeDateFilters shoud be call', () => {
    spyOn((component as any).adminTableService, 'changeDateFilters');
    component.changeDateFilters({ source: {} as any, checked: true }, true, 'currentColumn');
    expect((component as any).adminTableService.changeDateFilters).toHaveBeenCalledWith(
      { source: {} as any, checked: true },
      true,
      'currentColumn'
    );
  });

  it('changeInputDateFilters expect changeInputDateFilters shoud be call', () => {
    spyOn((component as any).adminTableService, 'changeInputDateFilters');
    component.changeInputDateFilters('value', 'currentColumn', 'suffix');
    expect((component as any).adminTableService.changeInputDateFilters).toHaveBeenCalledWith('value', 'currentColumn', 'suffix');
  });

  it('getDateChecked expect getDateChecked shoud be call', () => {
    spyOn((component as any).adminTableService, 'getDateChecked');
    component.getDateChecked('dateColumn');
    expect((component as any).adminTableService.getDateChecked).toHaveBeenCalledWith('dateColumn');
  });

  it('getDateValue expect getDateValue shoud be call', () => {
    spyOn((component as any).adminTableService, 'getDateValue');
    component.getDateValue('From', 'dateColumn');
    expect((component as any).adminTableService.getDateValue).toHaveBeenCalledWith('From', 'dateColumn');
  });

  it('clearFilters expect setColumnsForFiltering, applyFilters and setFilters shoud be call', () => {
    spyOn((component as any).adminTableService, 'setFilters');
    spyOn(component, 'setColumnsForFiltering');
    spyOn(component, 'applyFilters');
    (component as any).adminTableService.columnsForFiltering = [{ values: [{ filtered: true }] }];
    component.clearFilters();
    expect(component.setColumnsForFiltering).toHaveBeenCalledWith([{ values: [{ filtered: false }] }]);
    expect(component.applyFilters).toHaveBeenCalledTimes(1);
    expect((component as any).adminTableService.setFilters).toHaveBeenCalledWith([]);
  });

  it('applyFilters', () => {
    component.currentPage = 1;
    component.firstPageLoad = false;
    spyOn(component as any, 'getTable');
    component.applyFilters();
    expect(component.currentPage).toBe(0);
    expect(component.firstPageLoad).toBe(true);
    expect((component as any).getTable).toHaveBeenCalledTimes(1);
  });

  it('openColumnFilterPopup expect dialog.open shoud be call', () => {
    spyOn(component, 'applyFilters');
    spyOn(component.dialog, 'open').and.returnValue({
      afterClosed() {
        return new Observable((observer) => {});
      }
    } as any);

    component.openColumnFilterPopup({} as any, { title: { key: 'key' } });
    expect(component.dialog.open).toHaveBeenCalledTimes(1);
  });

  it('sortColumnsToDisplay expect columns.length to be 1', () => {
    component.columns = [{ title: { key: 'key' } }, { title: { key: 'gg' } }, { title: { key: 'dd' } }];
    component.displayedColumns = ['key', 'kol'];
    component.sortColumnsToDisplay();
    expect(component.columns.length).toBe(1);
  });

  it('onResizeColumn', () => {
    spyOn(component as any, 'checkResizing');
    spyOn(component as any, 'mouseMove');
    component.onResizeColumn({ target: { clientWidth: 20 } }, 1);
    expect((component as any).checkResizing).toHaveBeenCalledTimes(1);
    expect((component as any).mouseMove).toHaveBeenCalledWith(1);
  });

  it('checkResizing expect isResizingRight should be true ', () => {
    spyOn(component as any, 'getCellData');
    component.isResizingRight = false;
    (component as any).checkResizing({ target: { clientWidth: 20 }, pageX: 1 }, 0);
    expect(component.isResizingRight).toBe(true);
  });

  it('checkResizing expect isResizingRight should be false', () => {
    spyOn(component as any, 'getCellData').and.returnValue({ right: 1, width: 2 });
    component.isResizingRight = true;
    (component as any).checkResizing({ target: { clientWidth: 20 }, pageX: 2 }, 1);
    expect(component.isResizingRight).toBe(false);
  });

  it('mouseMove', () => {
    spyOn((component as any).renderer, 'listen').and.returnValue(true);
    (component as any).mouseMove(1);
    expect(component.resizableMousemove).toBe(true);
  });

  it('setColumnWidthChanges', () => {
    spyOn(component as any, 'setColumnWidth');
    component.columns = [{ width: 300 }, { width: 60 }, { width: 320 }, { width: 300 }, { width: 60 }];
    (component as any).setColumnWidthChanges(4, 200);
    expect((component as any).setColumnWidth).toHaveBeenCalledTimes(2);
  });

  it('resetSetting', () => {
    component.display = '';
    component.previousSettings = ['value'];
    component.resetSetting();
    expect(component.displayedColumns).toEqual(['value']);
    expect(component.display).toBe('none');
  });

  it('setColumnsForFiltering', () => {
    spyOn((component as any).adminTableService, 'setColumnsForFiltering');
    component.setColumnsForFiltering('columns');
    expect((component as any).adminTableService.setColumnsForFiltering).toHaveBeenCalledWith('columns');
  });

  it('checkStatusOfOrders', () => {
    component.tableData = [{ id: 1, orderStatus: 'DONE' }];
    const Res = component.checkStatusOfOrders(1);
    expect(Res).toBe(true);
  });
});
