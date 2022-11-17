import { ColumnFiltersPopUpComponent } from './../shared/components/column-filters-pop-up/column-filters-pop-up.component';
import {
  IBigOrderTable,
  IBigOrderTableParams,
  IFilteredColumn,
  IFilteredColumnValue,
  IOrdersViewParameters
} from './../../models/ubs-admin.interface';
import { TableHeightService } from '../../services/table-height.service';
import { UbsAdminTableExcelPopupComponent } from './ubs-admin-table-excel-popup/ubs-admin-table-excel-popup.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { nonSortableColumns } from '../../models/non-sortable-columns.model';
import { AdminTableService } from '../../services/admin-table.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { debounceTime, take, takeUntil } from 'rxjs/operators';
import { Subject, timer } from 'rxjs';
import { Component, OnInit, ViewChild, OnDestroy, AfterViewChecked, ChangeDetectorRef, ElementRef, Renderer2 } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { Router } from '@angular/router';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { IEditCell, IAlertInfo } from '../../models/edit-cell.model';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Store } from '@ngrx/store';
import { IAppState } from 'src/app/store/state/app.state';
import {
  ChangingOrderData,
  GetColumns,
  GetColumnToDisplay,
  GetTable,
  SetColumnToDisplay
} from 'src/app/store/actions/bigOrderTable.actions';
import { MouseEvents } from 'src/app/shared/mouse-events';

@Component({
  selector: 'app-ubs-admin-table',
  templateUrl: './ubs-admin-table.component.html',
  styleUrls: ['./ubs-admin-table.component.scss']
})
export class UbsAdminTableComponent implements OnInit, AfterViewChecked, OnDestroy {
  currentLang: string;
  nonSortableColumns = nonSortableColumns;
  sortingColumn: string;
  sortType: string;
  columns: any[] = [];
  displayedColumns: string[] = [];
  dataSource: MatTableDataSource<any>;
  selection = new SelectionModel<any>(true, []);
  previousIndex: number;
  isLoading = true;
  editCellProgressBar: boolean;
  isUpdate = false;
  destroy: Subject<boolean> = new Subject<boolean>();
  arrowDirection: string;
  isTableHeightSet = false;
  tableData: any[];
  totalElements = 0;
  allElements: number;
  totalPages: number;
  currentPage = 0;
  pageSize = 25;
  idsToChange: number[] = [];
  allChecked = false;
  tableViewHeaders = [];
  public blockedInfo: IAlertInfo[] = [];
  isAllColumnsDisplayed: boolean;
  count: number;
  display = 'none';
  filterValue = '';
  isPopupOpen: boolean;
  stickyColumn = [];
  model: string;
  modelChanged: Subject<string> = new Subject<string>();
  previousSettings: string[];
  displayedColumnsView: any[] = [];
  displayedColumnsViewTitles: string[] = [];
  firstPageLoad: boolean;
  isStoreEmpty: boolean;
  isPostData = false;
  dataForPopUp = [];
  uneditableStatuses = ['CANCELED', 'DONE'];
  stickyColumnsAmount = 4;
  nestedSortProperty = 'title.key';
  noFiltersApplied = true;
  isFiltersOpened = false;
  public showPopUp: boolean;
  mouseEvents = MouseEvents;
  cancellationReason: string;
  cancellationComment: string;
  @ViewChild(MatTable, { read: ElementRef }) private matTableRef: ElementRef;
  defaultColumnWidth = 200; // In px
  minColumnWidth = 100;
  columnsWidthPreference: Map<string, number>;
  restoredFilters = [];
  isRestoredFilters = false;
  checkOrderDate: boolean = false;
  checkDateOfExport: boolean = false;
  checkPaymentDate: boolean = false;

  bigOrderTable$ = this.store.select((state: IAppState): IBigOrderTable => state.bigOrderTable.bigOrderTable);
  bigOrderTableParams$ = this.store.select((state: IAppState): IBigOrderTableParams => state.bigOrderTable.bigOrderTableParams);
  ordersViewParameters$ = this.store.select((state: IAppState): IOrdersViewParameters => state.bigOrderTable.ordersViewParameters);

  constructor(
    private store: Store<IAppState>,
    private router: Router,
    private adminTableService: AdminTableService,
    private localStorageService: LocalStorageService,
    private tableHeightService: TableHeightService,
    public dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    this.firstPageLoad = true;
    this.columnsWidthPreference = this.localStorageService.getUbsAdminOrdersTableColumnsWidthPreference();
    this.localStorageService.languageBehaviourSubject.pipe(takeUntil(this.destroy)).subscribe((lang) => {
      this.currentLang = lang;
      if (this.tableData) {
        this.formatTableData();
      }
    });

    this.modelChanged.pipe(debounceTime(500)).subscribe((model) => {
      this.currentPage = 0;
      this.tableData = [];
      this.getTable(model, 'id', 'DESC', true);
    });

    this.ordersViewParameters$.subscribe((items: IOrdersViewParameters) => {
      if (items) {
        this.displayedColumns = items.titles.split(',')[0] === '' ? [] : items.titles.split(',');
      }
    });

    this.isStoreEmpty = true;
    this.bigOrderTable$.subscribe((item) => {
      if (item) {
        if (this.isPostData) {
          this.idsToChange = [];
        }
        this.editCellProgressBar = false;
        this.allChecked = false;
        this.isStoreEmpty = false;
        this.currentPage = item.number;
        if (this.firstPageLoad) {
          this.firstPageLoad = false;
          this.totalElements = item[`totalElements`];
          this.tableData = JSON.parse(JSON.stringify(item[`content`]));
          this.allElements = !this.allElements ? this.totalElements : this.allElements;
          this.dataSource = new MatTableDataSource(this.tableData);
          this.isTableHeightSet = false;
        } else {
          const data = JSON.parse(JSON.stringify(item[`content`]));
          this.tableData = [...this.tableData, ...data.slice(this.tableData.length)];
          this.dataSource.data = this.tableData;
          this.isUpdate = false;
        }
        this.totalPages = item[`totalPages`];
        this.formatTableData();
        this.isLoading = false;
        this.cdr.detectChanges();
        this.applyColumnsWidthPreference();
      }
    });
    this.bigOrderTableParams$.subscribe((columns: IBigOrderTableParams) => {
      if (columns) {
        const columnsForFiltering: Array<IFilteredColumn> = [];
        this.tableViewHeaders = columns.columnBelongingList;
        this.columns = JSON.parse(JSON.stringify(columns.columnDTOList));
        this.displayedColumnsView = columns.columnDTOList;
        this.displayedColumnsViewTitles = this.displayedColumnsView.map((item) => item.title.key);
        this.columns.forEach((column) => {
          if (column.filtered) {
            const filteredColumn = {
              key: column.title.key,
              en: column.title.en,
              ua: column.title.ua,
              values: [...column.checked]
            };
            columnsForFiltering.push(filteredColumn);
          }
        });
        this.setColumnsForFiltering(columnsForFiltering);
        if (this.displayedColumns.length === 0) {
          this.setDisplayedColumns();
        }
        const { sortDirection, sortBy } = columns.page;
        if (this.isStoreEmpty) {
          this.getTable(this.filterValue, sortBy, sortDirection, true);
        }
        this.editDetails();
      }
      this.sortColumnsToDisplay();
      this.checkAllColumnsDisplayed();

      this.restoredFilters = this.localStorageService.getUbsAdminOrdersTableTitleColumnFilter();

      if (!this.restoredFilters.length) {
        this.isRestoredFilters = true;
      }

      if (this.restoredFilters && !this.isRestoredFilters && this.getColumnsForFiltering().length) {
        this.noFiltersApplied = false;

        this.restoredFilters.forEach((filter) => {
          if (Object.keys(filter).length < 2) {
            const column = this.adminTableService.changeColumnNameEqualToTable(Object.keys(filter)[0]);
            const value = String(Object.values(filter)[0]);
            const options: IFilteredColumnValue = { key: value, filtered: false };
            this.changeFilters(true, column, options);
            this.applyFilters();
          } else {
            const column = this.adminTableService.changeColumnNameEqualToTable(Object.keys(filter)[0].split('From')[0]);
            this.adminTableService.saveDateFilters(true, column, filter);
            this.adminTableService.setDateCheckedFromStorage(column);
            this.adminTableService.filters = [...this.adminTableService.filters, filter];
            this.localStorageService.setUbsAdminOrdersTableTitleColumnFilter(this.adminTableService.filters);
          }
        });
        this.isRestoredFilters = true;
      }
    });

    if (this.isStoreEmpty) {
      this.getColumns();
      this.store.dispatch(GetColumnToDisplay());
    }
  }

  ngAfterViewChecked() {
    if (!this.isTableHeightSet) {
      const table = document.getElementById('table');
      const tableContainer = document.getElementById('table-container');
      this.isTableHeightSet = this.tableHeightService.setTableHeightToContainerHeight(table, tableContainer);
      if (!this.isTableHeightSet) {
        this.onScroll();
      }
    }
    this.cdr.detectChanges();
  }

  get isAllSelected(): boolean {
    const numRows = this.dataSource?.data.filter((row) => !this.checkStatusOfOrders(row.id)).length;

    return numRows && this.selection.selected.length === numRows;
  }

  get isIndeterminate(): boolean {
    return !!this.idsToChange.length && !this.isAllSelected;
  }

  checkAllColumnsDisplayed(): void {
    this.isAllColumnsDisplayed = this.displayedColumns.length === this.displayedColumnsView.length;
  }

  applyFilter(filterValue: string): void {
    this.filterValue = filterValue;
    this.modelChanged.next(filterValue);
  }

  dropListDropped(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.displayedColumns, event.previousIndex, event.currentIndex);
    this.sortColumnsToDisplay();
    const displayedColumns = this.displayedColumns.join(',');
    this.store.dispatch(SetColumnToDisplay({ columns: encodeURIComponent(displayedColumns), titles: displayedColumns }));
  }

  stickColumns() {
    this.stickyColumn = [];
    const displayedColumnsViewCopy = JSON.parse(JSON.stringify(this.displayedColumnsView));

    for (let i = 0; i < this.stickyColumnsAmount; i++) {
      this.stickyColumn.push(this.displayedColumns[i]);
    }

    displayedColumnsViewCopy.forEach((item) => {
      item.sticky = this.stickyColumn.includes(item.title.key);
    });

    this.displayedColumnsView = displayedColumnsViewCopy;
  }

  masterToggle(event: MatCheckboxChange): void {
    this.allChecked = event.checked;

    if (this.isAllSelected) {
      this.selection.clear();
      this.idsToChange.length = 0;

      return;
    }

    this.dataSource.data.forEach((row) => {
      if (!this.checkStatusOfOrders(row.id) && !this.idsToChange.includes(row.id)) {
        this.selection.select(row);
        this.idsToChange.push(row.id);
      }
    });
  }

  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

  public showBlockedMessage(info): void {
    this.blockedInfo = info;

    const uniqUsers: string[] = [];
    const convertInfo = [];

    this.blockedInfo.forEach((item: IAlertInfo) => {
      if (!uniqUsers.includes(item.userName)) {
        uniqUsers.push(item.userName);
      }

      const index = this.dataSource.filteredData.findIndex((row) => row.id === item.orderId);
      this.selection.deselect(this.dataSource.filteredData[index]);

      if (this.idsToChange.includes(item.orderId)) {
        this.idsToChange = this.idsToChange.filter((id) => id !== item.orderId);
      }
    });

    uniqUsers.forEach((userName) => {
      let ids: number[] = [];
      this.blockedInfo.forEach((userInfo: IAlertInfo) => {
        if (userName === userInfo.userName) {
          ids.push(userInfo.orderId);
        }
      });
      convertInfo.push({ ordersId: ids, userName });
      ids = [];
    });
    this.blockedInfo = convertInfo;

    timer(7000)
      .pipe(take(1))
      .subscribe(() => {
        this.blockedInfo = [];
      });
  }

  public changeColumns(checked: boolean, key: string, positionIndex): void {
    this.displayedColumns = checked
      ? [...this.displayedColumns.slice(0, positionIndex), key, ...this.displayedColumns.slice(positionIndex)]
      : this.displayedColumns.filter((item) => item !== key);
    this.checkAllColumnsDisplayed();
    this.sortColumnsToDisplay();
  }

  public toggleFilters(): void {
    this.isFiltersOpened = !this.isFiltersOpened;
  }

  public toggleTableView(): void {
    this.display = this.display === 'none' ? 'block' : 'none';
    this.isPopupOpen = !this.isPopupOpen;
    if (!this.isPopupOpen) {
      const displayedColumns = this.displayedColumns.join(',');
      this.store.dispatch(SetColumnToDisplay({ columns: encodeURIComponent(displayedColumns), titles: displayedColumns }));
    }
    this.previousSettings = this.displayedColumns;
  }

  public showAllColumns(isCheckAll: boolean): void {
    isCheckAll ? this.setUnDisplayedColumns() : this.setDisplayedColumns();
  }

  private getColumns() {
    this.store.dispatch(GetColumns());
  }

  private getTable(filterValue: string, columnName = this.sortingColumn || 'id', sortingType = this.sortType || 'DESC', reset: boolean) {
    this.isLoading = true;
    this.store.dispatch(GetTable({ columnName, page: this.currentPage, filter: filterValue, size: this.pageSize, sortingType, reset }));
  }

  formatTableData() {
    const currency = {
      ua: 'грн',
      en: 'UAH'
    };

    this.tableData.forEach((row) => {
      const priceKeys = ['amountDue', 'totalOrderSum', 'generalDiscount', 'totalPayment'];
      for (const key of priceKeys) {
        row[key] = parseFloat(row[key]).toFixed(2) + ' ' + currency[this.currentLang];
      }
      const arr = row.orderCertificateCode?.split(', ');
      if (arr && arr.length > 0) {
        row.orderCertificatePoints = arr.reduce((res, elem) => {
          res = parseInt(res, 10);
          res += parseInt(elem, 10);
          return res ? res + '' : '';
        });
      }
    });
  }

  updateTableData() {
    this.isUpdate = true;
    this.store.dispatch(
      GetTable({
        columnName: this.sortingColumn || 'id',
        page: this.currentPage,
        filter: this.filterValue,
        size: this.pageSize,
        sortingType: this.sortType || 'DESC',
        reset: false
      })
    );
  }

  getSortingData(columnName, sortingType) {
    this.sortingColumn = columnName;
    this.sortType = sortingType;
    this.arrowDirection = this.arrowDirection === columnName ? null : columnName;
    this.currentPage = 0;
    this.firstPageLoad = true;
    this.getTable(this.filterValue, columnName, sortingType, true);
  }

  openExportExcel(): void {
    const dialogConfig = new MatDialogConfig();
    const dialogRef = this.dialog.open(UbsAdminTableExcelPopupComponent, dialogConfig);
    dialogRef.componentInstance.totalElements = this.totalElements;
    dialogRef.componentInstance.allElements = this.allElements;
    dialogRef.componentInstance.sortingColumn = this.sortingColumn;
    dialogRef.componentInstance.sortType = this.sortType;
    dialogRef.componentInstance.search = this.filterValue;
    dialogRef.componentInstance.name = 'Orders-Table.xlsx';
  }

  onScroll() {
    const table = document.getElementById('table');
    const tableContainer = document.getElementById('table-container');
    this.tableHeightService.setTableHeightToContainerHeight(table, tableContainer);
    if (!this.isUpdate && this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updateTableData();
    }
  }
  editDetails(): void {
    const keys = ['receivingStation', 'responsibleDriver', 'responsibleCaller', 'responsibleLogicMan', 'responsibleNavigator'];
    this.displayedColumnsView
      .filter((el) => keys.includes(el.title.key))
      .forEach((field) => this.dataForPopUp.push({ arrayData: field.checked, title: field.titleForSorting }));
  }
  // checks if all required fields is filled in
  openPopUpRequires(orderId?: number): void {
    const keysForEditDetails = [
      'responsibleDriver',
      'responsibleCaller',
      'responsibleLogicMan',
      'responsibleNavigator',
      'dateOfExport',
      'timeOfExport',
      'receivingStation'
    ];
    if (this.idsToChange.length === 0) {
      this.idsToChange.push(orderId);
    }
    let sortedOrders = this.tableData.filter((el) => this.idsToChange.includes(el.id));
    sortedOrders = sortedOrders
      .map((e) => keysForEditDetails.filter((elem) => e[elem] === null || e[elem] === ''))
      .filter((arrayList) => arrayList?.length !== 0);
    this.showPopUp = sortedOrders.length !== 0;
  }

  selectRowsToChange(event: MatCheckboxChange, row: any): void {
    this.selection.toggle(row);

    if (event.checked && !this.idsToChange.includes(row.id)) {
      this.idsToChange.push(row.id);
    } else {
      this.idsToChange = this.idsToChange.filter((item: number) => item !== row.id);
    }

    this.allChecked = this.isAllSelected;
  }

  public editCell(e: IEditCell): void {
    if (this.allChecked) {
      this.editAll(e);
    } else if (this.idsToChange.length === 0) {
      this.editSingle(e);
    } else {
      this.editGroup(e);
    }
  }

  public cancelEditCell(ids: number[]): void {
    this.adminTableService.cancelEdit(ids).subscribe();
    this.idsToChange = [];
    this.allChecked = false;
  }

  public closeAlertMess(): void {
    this.blockedInfo = [];
  }

  private setDisplayedColumns(): void {
    this.displayedColumnsView.forEach((column, index) => {
      this.displayedColumnsViewTitles[index] = column.title.key;
    });
    this.isAllColumnsDisplayed = true;
    this.displayedColumns = this.displayedColumnsViewTitles;
    this.count = this.displayedColumnsViewTitles.length;
    this.sortColumnsToDisplay();
  }
  private setUnDisplayedColumns(): void {
    this.displayedColumnsViewTitles = [];
    this.displayedColumns = ['select'];
    this.isAllColumnsDisplayed = false;
  }

  private editSingle(e: IEditCell): void {
    this.editCellProgressBar = true;
    const id = this.tableData.findIndex((item) => item.id === e.id);
    const newRow = { ...this.tableData[id], [e.nameOfColumn]: e.newValue };
    const newTableData = [...this.tableData.slice(0, id), newRow, ...this.tableData.slice(id + 1)];
    this.tableData = newTableData;
    this.dataSource = new MatTableDataSource(newTableData);
    this.openPopUpRequires(id);
    this.postData([e.id], e.nameOfColumn, e.newValue);
  }

  private editGroup(e: IEditCell): void {
    this.editCellProgressBar = true;
    const ids = [];
    let newTableDataCombine = this.tableData;

    for (const idIter of this.idsToChange) {
      const check = this.tableData.findIndex((item) => item.id === idIter);
      if (check > -1) {
        ids.push(check);
      }
    }

    for (const idGroup of ids) {
      const newRowGroup = { ...this.tableData[idGroup], [e.nameOfColumn]: e.newValue };
      newTableDataCombine = [...newTableDataCombine.slice(0, idGroup), newRowGroup, ...newTableDataCombine.slice(idGroup + 1)];
    }

    this.tableData = newTableDataCombine;
    this.dataSource = new MatTableDataSource(newTableDataCombine);
    this.postData(this.idsToChange, e.nameOfColumn, e.newValue);
  }

  public addOrderCancellationData(orderCancellationData: { cancellationReason: string; cancellationComment: string | null }) {
    this.cancellationReason = orderCancellationData.cancellationReason;
    this.cancellationComment = orderCancellationData.cancellationComment;
  }

  private editAll(e: IEditCell): void {
    this.editCellProgressBar = true;
    const newTableData = this.tableData.map((item) => {
      return {
        ...item,
        [e.nameOfColumn]: e.newValue
      };
    });
    this.tableData = newTableData;
    this.dataSource = new MatTableDataSource(newTableData);
    this.allChecked = false;
    this.idsToChange = [];
    this.editCellProgressBar = false;
    // empty array define that we change all in column
    this.postData([], e.nameOfColumn, e.newValue);
  }

  private postData(orderId: number[], columnName: string, newValue: string): void {
    const orderData = [{ orderId, columnName, newValue }];
    if (this.cancellationReason) {
      orderData.push({ orderId, columnName: 'cancellationReason', newValue: this.cancellationReason });
    }
    if (this.cancellationComment) {
      orderData.push({ orderId, columnName: 'cancellationComment', newValue: this.cancellationComment });
    }
    this.store.dispatch(ChangingOrderData({ orderData }));
    this.isPostData = true;
    this.cancellationReason = null;
    this.cancellationComment = null;
  }

  toggleAccordion(e: PointerEvent): void {
    (e.target as HTMLElement).parentElement.parentElement.querySelector('.accordion-collapse').classList.toggle('show');
    const matIcon = (e.target as HTMLElement).closest('div').querySelector('mat-icon');
    matIcon.textContent = matIcon.textContent === 'keyboard_arrow_down' ? 'keyboard_arrow_up' : 'keyboard_arrow_down';
  }

  openOrder(id: number): void {
    this.router.navigate(['ubs-admin', 'order', `${id}`]);
  }

  showTooltip(event, title, tooltip) {
    event.stopImmediatePropagation();

    const lengthStrUa = title.ua.split('').length;
    const lengthStrEn = title.en.split('').length;
    if ((this.currentLang === 'ua' && lengthStrUa > 17) || (this.currentLang === 'en' && lengthStrEn > 18)) {
      tooltip.toggle();
    }

    event.type === MouseEvents.MouseEnter ? this.calculateTextWidth(event, tooltip) : tooltip.hide();
  }

  calculateTextWidth(event, tooltip): void {
    const textContainerWidth = event.toElement.offsetWidth;
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    context.font = '14.8px Lato, sans-serif';
    const textWidth = Math.round(context.measureText(event.toElement.innerText).width);

    if (textContainerWidth < textWidth) {
      tooltip.show();
    }
  }

  getColumnsForFiltering() {
    return this.adminTableService.columnsForFiltering;
  }

  changeFilters(checked: boolean, currentColumn: string, option: IFilteredColumnValue): void {
    this.adminTableService.changeFilters(checked, currentColumn, option);
    this.noFiltersApplied = !this.adminTableService.filters.length;
  }

  changeDateFilters(e: MatCheckboxChange, checked: boolean, currentColumn: string): void {
    this.adminTableService.changeDateFilters(e, checked, currentColumn);
    this.noFiltersApplied = false;
    switch (currentColumn) {
      case 'orderDate':
        this.checkOrderDate = !this.checkOrderDate;
        break;
      case 'dateOfExport':
        this.checkDateOfExport = !this.checkDateOfExport;
        break;
      case 'paymentDate':
        this.checkPaymentDate = !this.checkPaymentDate;
        break;
    }
  }

  changeInputDateFilters(value: string, currentColumn: string, suffix: string): void {
    this.noFiltersApplied = false;
    let check = this.getDateChecked(currentColumn);
    this.adminTableService.changeOrderDateFilters(value, currentColumn, suffix, check);
  }

  getDateChecked(dateColumn): boolean {
    let check: boolean = false;
    switch (dateColumn) {
      case 'orderDate':
        check = this.checkOrderDate;
        break;
      case 'dateOfExport':
        check = this.checkDateOfExport;
        break;
      case 'paymentDate':
        check = this.checkPaymentDate;
        break;
    }
    return check;
  }

  getDateValue(suffix: 'From' | 'To', dateColumn): boolean {
    return this.adminTableService.getDateValue(suffix, dateColumn);
  }

  public clearFilters(): void {
    const columnsForFiltering = this.adminTableService.columnsForFiltering;
    columnsForFiltering.forEach((column) => {
      column.values.forEach((value) => {
        value.filtered = false;
      });
    });
    this.setColumnsForFiltering(columnsForFiltering);
    this.adminTableService.setFilters([]);
    this.applyFilters();
    this.noFiltersApplied = true;
    this.localStorageService.removeAdminOrderFilters();
  }

  public applyFilters() {
    this.currentPage = 0;
    this.firstPageLoad = true;
    this.getTable(this.filterValue, this.sortingColumn || 'id', this.sortType || 'DESC', true);
  }

  openColumnFilterPopup(event: PointerEvent, column) {
    const popupWidth = 350;
    const popupHeight = 400;
    const isDateFilter = column.title.key.toLowerCase().includes('date');
    const target = new ElementRef(event.target);
    const dialogRef = this.dialog.open(ColumnFiltersPopUpComponent, {
      panelClass: 'dropdown-menu',
      data: {
        trigger: target,
        isDateFilter,
        columnName: column.title.key,
        width: popupWidth,
        height: popupHeight,
        currentLang: this.currentLang
      }
    });
    dialogRef.afterClosed().subscribe((data) => {
      let buttonName: 'clear' | 'apply' | undefined;
      if (data) {
        buttonName = data[0];
      }
      if (buttonName === 'clear') {
        const columnName = data[1];
        this.adminTableService.clearColumnFilters(columnName);
      }
      if (buttonName) {
        this.applyFilters();
      }
    });
  }

  sortColumnsToDisplay() {
    const displayedColumnsCopy = JSON.parse(JSON.stringify(this.displayedColumns));
    const prop = this.nestedSortProperty.split('.');
    const len = prop.length;

    this.columns.sort((a, b) => {
      let i = 0;
      while (i < len) {
        a = a[prop[i]];
        b = b[prop[i]];
        i++;
      }
      return displayedColumnsCopy.indexOf(a) - displayedColumnsCopy.indexOf(b);
    });

    this.checkAllColumnsDisplayed();
    if (!this.isAllColumnsDisplayed) {
      const undisplayedColumns = [];
      for (const column of this.columns) {
        if (!this.displayedColumns.includes(column.title.key)) {
          undisplayedColumns.push(this.columns[column]);
        }
      }
      undisplayedColumns.length =
        undisplayedColumns.length % this.columns.length >= 0 ? undisplayedColumns.length % this.columns.length : 0;
      for (let i = 0; i < undisplayedColumns.length; i++) {
        this.columns.push(this.columns[i]);
      }
      this.columns.splice(0, undisplayedColumns.length);
    }
    this.columns.forEach((item) => {
      item.index = this.columns.indexOf(item);
    });
    this.displayedColumnsView = this.columns;
    this.stickColumns();
  }

  public onResizeColumn(event: MouseEvent, columnIndex: number): void {
    const resizeHandleWidth = 15; // Px
    const resizeStartX = event.pageX;
    const tableOffsetX = this.getTableOffsetX();

    const {
      left: leftColumnBoundary,
      right: rightColumnBoundary,
      width: originalColumnWidth
    } = this.getColumnHeaderBoundaries(columnIndex);

    const isResizingLeft = resizeStartX <= leftColumnBoundary + resizeHandleWidth;
    const isResizingRight = resizeStartX >= rightColumnBoundary - resizeHandleWidth;
    if (!isResizingLeft && !isResizingRight) {
      return;
    }

    event.preventDefault();

    const adjColumnIndex = isResizingRight ? columnIndex + 1 : columnIndex - 1;
    const isAdjColumnSticky = adjColumnIndex < this.stickyColumnsAmount;
    const { width: adjColumnOriginalWidth, left: adjColumnLeftBoundary } = this.getColumnHeaderBoundaries(adjColumnIndex);

    let newColumnWidth = originalColumnWidth;
    let newAdjColumnWidth = adjColumnOriginalWidth;
    let cleanupMouseMove = () => {};
    let cleanupMouseUp = () => {};
    const onMouseMove = (moveEvent) => {
      const movedToX = moveEvent.pageX;
      const dx = isResizingRight ? movedToX - resizeStartX : -movedToX + resizeStartX;
      if (originalColumnWidth + dx < this.minColumnWidth || adjColumnOriginalWidth - dx < this.minColumnWidth) {
        return;
      }
      newColumnWidth = originalColumnWidth + dx;
      newAdjColumnWidth = adjColumnOriginalWidth - dx;
      this.setColumnWidth(columnIndex, newColumnWidth);
      this.setColumnWidth(adjColumnIndex, newAdjColumnWidth);
      // Move column if it is sticky
      if (isAdjColumnSticky) {
        const leftColumnLeftBoundary = isResizingRight ? leftColumnBoundary : adjColumnLeftBoundary;
        const newLeftColumnWidth = isResizingRight ? newColumnWidth : newAdjColumnWidth;
        const rightColumnIndex = isResizingRight ? adjColumnIndex : columnIndex;
        const rightColumnOffsetX = leftColumnLeftBoundary + newLeftColumnWidth - tableOffsetX;
        this.setStickyColumnOffsetX(rightColumnIndex, rightColumnOffsetX);
      }
    };
    const onMouseUp = () => {
      this.updateColumnsWidthPreference(columnIndex, newColumnWidth);
      this.updateColumnsWidthPreference(adjColumnIndex, newAdjColumnWidth);
      cleanupMouseMove();
      cleanupMouseUp();
    };
    cleanupMouseMove = this.renderer.listen('document', 'mousemove', onMouseMove);
    cleanupMouseUp = this.renderer.listen('document', 'mouseup', onMouseUp);
  }

  private getTableOffsetX(): number | undefined {
    return this.getColumnHeaderBoundaries(0)?.left;
  }

  private getColumnHeaderBoundaries(index: number) {
    const headerRow = this.matTableRef.nativeElement.children[0];
    const cell = headerRow.children[0].children[index];
    return cell?.getBoundingClientRect();
  }

  private setStickyColumnOffsetX(index: number, offset: number): void {
    // Relative to table start
    const columnKey = this.columns[index].title.key;
    const columnCells = Array.from(document.getElementsByClassName('mat-column-' + columnKey));
    columnCells.forEach((cell) => {
      this.renderer.setStyle(cell, 'left', `${offset}px`);
    });
  }

  private setColumnWidth(index: number, width: number): void {
    const columnKey = this.columns[index].title.key;
    const columnCells = Array.from(document.getElementsByClassName('mat-column-' + columnKey));
    columnCells.forEach((cell) => {
      this.renderer.setStyle(cell, 'width', `${width}px`);
    });
  }

  applyColumnsWidthPreference(): void {
    for (const [idx, col] of this.columns.entries()) {
      const key = col.title.key;
      const width = this.columnsWidthPreference.get(key) ?? this.defaultColumnWidth;
      this.setColumnWidth(idx, width);
    }
    const tableOffsetX = this.getTableOffsetX();
    if (tableOffsetX === undefined) {
      return;
    }
    for (let idx = 1; idx < this.stickyColumnsAmount; idx++) {
      this.setStickyColumnOffsetX(idx, this.getColumnHeaderBoundaries(idx - 1).right - tableOffsetX);
    }
  }

  updateColumnsWidthPreference(columnIndex: number, newWidth: number) {
    const col = this.columns[columnIndex];
    this.columnsWidthPreference.set(col.title.key, newWidth);
    this.localStorageService.setUbsAdminOrdersTableColumnsWidthPreference(this.columnsWidthPreference);
  }

  setColumnsForFiltering(columns): void {
    this.adminTableService.setColumnsForFiltering(columns);
  }

  checkForCheckedBoxes(column): boolean {
    return column.values.some((item) => item.filtered);
  }

  checkIfFilteredBy(columnKey): boolean {
    let key: string;
    if (columnKey === 'paymentDate') {
      key = 'paymentDateFrom';
    } else {
      key = columnKey === 'orderDate' ? 'orderDateFrom' : columnKey;
    }

    return this.adminTableService.filters ? this.adminTableService.filters.some((obj) => Object.keys(obj)[0] === key) : false;
  }

  checkStatusOfOrders(id: number): boolean {
    return this.uneditableStatuses.includes(this.tableData.find((el) => el.id === id).orderStatus);
  }
  showTable(): string {
    return this.displayedColumns.length > 1 ? 'block' : 'none';
  }
  ngOnDestroy() {
    this.destroy.next();
    this.destroy.unsubscribe();
  }
}
