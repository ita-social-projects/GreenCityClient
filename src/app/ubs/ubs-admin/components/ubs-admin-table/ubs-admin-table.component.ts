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
  currentResizeIndex: number;
  pressed = false;
  startX: number;
  startWidth: number;
  isResizingRight: boolean;
  previousSettings: string[];
  displayedColumnsView: any[] = [];
  displayedColumnsViewTitles: string[] = [];
  firstPageLoad: boolean;
  isStoreEmpty: boolean;
  isPostData = false;
  dataForPopUp = [];
  uneditableStatuses = ['CANCELED', 'DONE'];
  noFiltersApplied = true;
  isFiltersOpened = false;
  public showPopUp: boolean;
  resizableMousemove: () => void;
  resizableMouseup: () => void;
  @ViewChild(MatTable, { read: ElementRef }) private matTableRef: ElementRef;

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
    this.localStorageService.languageBehaviourSubject.pipe(takeUntil(this.destroy)).subscribe((lang) => {
      this.currentLang = lang;
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
        this.changeView();
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
          column.width = 200;
        });
        this.setColumnsForFiltering(columnsForFiltering);
        if (this.displayedColumns.length === 0) {
          this.setDisplayedColumns();
        }
        const { sortDirection, sortBy } = columns.page;
        if (this.isStoreEmpty) {
          this.getTable(this.filterValue, sortBy, sortDirection, true);
        }
        this.sortColumnsToDisplay();
        this.editDetails();
      }
      this.checkAllColumnsDisplayed();
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

  checkAllColumnsDisplayed(): void {
    this.isAllColumnsDisplayed = this.displayedColumns.length === this.displayedColumnsView.length;
  }

  applyFilter(filterValue: string): void {
    this.filterValue = filterValue;
    this.modelChanged.next(filterValue);
  }

  dropListDropped(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.displayedColumns, event.previousIndex, event.currentIndex);
    const displayedColumns = this.displayedColumns.join(',');
    this.store.dispatch(SetColumnToDisplay({ columns: encodeURIComponent(displayedColumns), titles: displayedColumns }));
    this.stickyColumn = [];
    for (let i = 0; i < 4; i++) {
      this.stickyColumn.push(this.displayedColumns[i]);
    }
    this.columns.forEach((item) => {
      item.sticky = this.stickyColumn.includes(item.title.key);
    });
    this.sortColumnsToDisplay();
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ? this.selection.clear() : this.dataSource.data.forEach((row) => this.selection.select(row));
  }

  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
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

  changeView() {
    this.tableData.forEach((el) => {
      el.amountDue = parseFloat(el.amountDue).toFixed(2);
      el.totalOrderSum = parseFloat(el.totalOrderSum).toFixed(2);
      const arr = el.orderCertificateCode?.split(', ');
      if (arr && arr.length > 0) {
        el.orderCertificatePoints = arr.reduce((res, elem) => {
          res = parseInt(res, 10);
          res += parseInt(elem, 10);
          return res ? res + '' : '';
        });
      }
    });
    this.isLoading = false;
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
      .filter((array) => array.length !== 0);
    this.showPopUp = sortedOrders.length !== 0 ? true : false;
  }
  selectRowsToChange(event, id: number): void {
    if (event.checked) {
      this.idsToChange.push(id);
    } else {
      this.idsToChange = this.idsToChange.filter((item) => item !== id);
    }
  }

  selectAll(checked: boolean) {
    if (checked) {
      this.allChecked = checked;
      this.idsToChange = [];
    } else {
      this.allChecked = checked;
    }
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
    this.store.dispatch(ChangingOrderData({ orderId, columnName, newValue }));
    this.isPostData = true;
  }

  toggleAccordion(e: PointerEvent): void {
    (e.target as HTMLElement).parentElement.parentElement.querySelector('.accordion-collapse').classList.toggle('show');
    const matIcon = (e.target as HTMLElement).closest('div').querySelector('mat-icon');
    matIcon.textContent = matIcon.textContent === 'keyboard_arrow_down' ? 'keyboard_arrow_up' : 'keyboard_arrow_down';
  }

  openOrder(id: number): void {
    this.router.navigate(['ubs-admin', 'order', `${id}`]);
  }

  showTooltip(title, tooltip) {
    const lengthStrUa = title.ua.split('').length;
    const lengthStrEn = title.en.split('').length;
    if ((this.currentLang === 'ua' && lengthStrUa > 17) || (this.currentLang === 'en' && lengthStrEn > 18)) {
      tooltip.toggle();
    }
  }

  getColumnsForFiltering() {
    return this.adminTableService.columnsForFiltering;
  }

  changeFilters(checked: boolean, currentColumn: string, option: IFilteredColumnValue): void {
    this.adminTableService.changeFilters(checked, currentColumn, option);
    this.noFiltersApplied = this.adminTableService.filters.length === 0;
  }

  changeDateFilters(e: MatCheckboxChange, checked: boolean, currentColumn: string): void {
    this.adminTableService.changeDateFilters(e, checked, currentColumn);
    this.noFiltersApplied = this.adminTableService.filters.length === 0;
  }

  changeInputDateFilters(value: string, currentColumn: string, suffix: string): void {
    this.adminTableService.changeInputDateFilters(value, currentColumn, suffix);
  }

  getDateChecked(dateColumn): boolean {
    return this.adminTableService.getDateChecked(dateColumn);
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
    const arr = [];
    this.columns.forEach((el) => {
      arr[this.displayedColumns.findIndex((res) => res === el.title.key)] = el;
    });
    this.columns = arr;
  }

  public onResizeColumn(event: any, index: number) {
    this.checkResizing(event, index);
    this.currentResizeIndex = index;
    this.pressed = true;
    this.startX = event.pageX;
    this.startWidth = event.target.clientWidth;
    this.mouseMove(index);
  }

  private checkResizing(event: any, index: any) {
    const cellData = this.getCellData(index);
    if (index === 0 || (Math.abs(event.pageX - cellData.right) < cellData.width / 2 && index !== this.columns.length - 1)) {
      this.isResizingRight = true;
    } else {
      this.isResizingRight = false;
    }
  }

  private getCellData(index: number) {
    const headerRow = this.matTableRef.nativeElement.children[0];
    const cell = headerRow.children[0].children[index];
    return cell.getBoundingClientRect();
  }

  private mouseMove(index: number) {
    this.resizableMousemove = this.renderer.listen('document', 'mousemove', (event) => {
      if (this.pressed && event.buttons) {
        const dx = this.isResizingRight ? event.pageX - this.startX : -event.pageX + this.startX;
        const width = this.startWidth + dx;
        if (this.currentResizeIndex === index && width > 100) {
          this.setColumnWidthChanges(index, width);
        }
      }
    });
    this.resizableMouseup = this.renderer.listen('document', 'mouseup', (event) => {
      if (this.pressed) {
        this.pressed = false;
        this.currentResizeIndex = -1;
        this.resizableMousemove();
        this.resizableMouseup();
      }
    });
  }

  private setColumnWidthChanges(index: number, width: number) {
    const orgWidth = this.columns[index].width;
    const dx = width - orgWidth;
    if (dx !== 0) {
      const j = this.isResizingRight ? index + 1 : index - 1;
      const newWidth = this.columns[j].width - dx;

      if (newWidth > 100 && index > 3) {
        this.columns[index].width = width;
        this.setColumnWidth(this.columns[index]);
        this.columns[j].width = newWidth;
        this.setColumnWidth(this.columns[j]);
      }
    }
  }

  private setColumnWidth(column: any) {
    const columnEls = Array.from(document.getElementsByClassName('mat-column-' + column.title.key));
    columnEls.forEach((el: any) => {
      el.style.width = column.width + 'px';
    });
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
