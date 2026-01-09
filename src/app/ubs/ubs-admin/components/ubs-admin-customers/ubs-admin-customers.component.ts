import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild
} from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { LocalStorageService } from 'src/app/shared/services/localstorage/local-storage.service';
import { map, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, take, takeUntil } from 'rxjs/operators';
import { ICustomersTable } from '../../models/customers-table.model';
import { nonSortableColumns } from '../../models/non-sortable-columns.model';
import { AdminCustomersService } from '../../services/admin-customers.service';
import { TableHeightService } from '../../services/table-height.service';
import { UbsAdminTableExcelPopupComponent } from '../ubs-admin-table/ubs-admin-table-excel-popup/ubs-admin-table-excel-popup.component';
import { Filters } from './filters.interface';
import { ConvertFromDateToStringService } from 'src/app/shared/pipes/convert-from-date-to-string/convert-from-date-to-string.service';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { Store } from '@ngrx/store';
import { adminTableOfCustomersSelector } from 'src/app/store/selectors/ubs-admin.selectors';
import { GetCustomerTable } from 'src/app/store/actions/ubs-admin.actions';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MomentDateAdapter } from '@global-service/moment-date-adapter';
import { ClientStatusEnum } from '@ubs/ubs/enums/client-status.enum';
import { MatSelectChange } from '@angular/material/select';
import { IAppState } from '../../../../store/state/app.state';
import { ColumnParam, columnsParams } from '@ubs/ubs-admin/components/ubs-admin-customers/columnsParams.mock';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';

export const CUSTOM_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY'
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  }
};

@Component({
  selector: 'app-ubs-admin-customers',
  templateUrl: './ubs-admin-customers.component.html',
  styleUrls: ['./ubs-admin-customers.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS }
  ]
})
export class UbsAdminCustomersComponent implements OnInit, AfterViewChecked, OnDestroy {
  isLoading = false;
  isUpdate = false;
  nonSortableColumns = nonSortableColumns;
  columns = columnsParams;
  arrowDirection: string;
  currentLang: string;
  displayedColumns: string[] = [];
  dataSource: MatTableDataSource<any>;
  currentPage = 0;
  totalElements = 0;
  allElements: number;
  display = 'none';
  filterForm: FormGroup;
  hasChange = false;
  canEditClient = false;
  filters: Filters;
  filterValue = '';
  pageSize = 10;
  enterPressed: boolean;
  adminTableOfCustomersSelector$ = this.store.select(adminTableOfCustomersSelector);
  tableData: any[];
  activeFilters: Array<{key: string; labelKey: string;valueText: string; fromControl: string; toControl: string;}> = [];
  readonly customerStatus = Object.values(ClientStatusEnum);
  private sortType: string;
  private sortingColumn: string;
  private pressed = false;
  private currentResizeIndex: number;
  private startX: number;
  private startWidth: number;
  private isResizingRight: boolean;
  private totalPages = 1;
  private isTableHeightSet = false;
  private initialFilterValues: object;
  private queryString = '';
  private resizableMousemove: () => void;
  private resizableMouseup: () => void;
  private permissions$ = this.store.select((appState: IAppState) => appState?.employees?.employeesPermissions);
  private readonly destroy$: Subject<boolean> = new Subject<boolean>();
  private readonly filterSubject = new Subject<string>();
  private readonly pointerColumns: string[] = ['clientName', 'number_of_orders', 'violations'];

  @ViewChild(MatTable, { read: ElementRef }) private readonly matTableRef: ElementRef;

  constructor(
    private readonly adapter: DateAdapter<any>,
    public readonly dialog: MatDialog,
    private readonly fb: FormBuilder,
    private readonly cdr: ChangeDetectorRef,
    private readonly renderer: Renderer2,
    private readonly router: Router,
    private readonly store: Store,
    private readonly destroyRef: DestroyRef,
    private readonly convertFromDateToStringService: ConvertFromDateToStringService,
    private readonly localStorageService: LocalStorageService,
    private readonly tableHeightService: TableHeightService,
    private readonly adminCustomerService: AdminCustomersService,
    private readonly translate: TranslateService
  ) {}

  ngOnInit() {
    this.localStorageService.languageBehaviourSubject.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((lang) => {
      this.currentLang = lang;
      const locale = lang !== 'uk' ? 'en-GB' : 'uk-UA';
      this.adapter.setLocale(locale);
    });
    this.getTable();
    this.adminTableOfCustomersSelector$.pipe(take(1)).subscribe((tableData) => {
      this.setDisplayedColumns();
    });
    this.initFilterForm();
    this.onCreateGroupFormValueChange();
    this.filterSubject.pipe(debounceTime(1000), distinctUntilChanged(), takeUntil(this.destroy$)).subscribe((value) => {
      if (!this.enterPressed) {
        this.applyFilter(value);
      } else {
        this.enterPressed = false;
      }
    });
    this.permissions$
      .pipe(
        filter(Boolean),
        take(1),
        map((permissions) => permissions.some((p) => p === 'EDIT_CLIENT'))
      )
      .subscribe((permission) => {
        this.canEditClient = permission;
      });
  }

  ngAfterViewChecked() {
    if (!this.isTableHeightSet && !this.isLoading) {
      const table = document.getElementById('table');
      const tableContainer = document.getElementById('table-container');
      this.isTableHeightSet = this.tableHeightService.setTableHeightToContainerHeight(table, tableContainer);
      if (!this.isTableHeightSet) {
        this.onScroll();
      }
    }
    if (!this.isLoading) {
      this.setTableResize(this.matTableRef.nativeElement.clientWidth);
    }
    this.cdr.detectChanges();
  }

  onChangeStatus(event: MatSelectChange, user: any) {
    return this.adminCustomerService.changeCustomerStatus(user.userId, event.value).subscribe({
      error: () => {
        this.dataSource.data = this.dataSource.data.map((u) =>
          u.userId === user.userId
            ? {
                ...u,
                status: user.status
              }
            : u
        );
        console.error(`Could not change status ${event.value} for user ${user.userId}`);
      }
    });
  }

  getSortingData(columnName: string, sortingType: string) {
    this.sortingColumn = columnName;
    this.sortType = sortingType;
    this.arrowDirection = this.arrowDirection === columnName ? null : columnName;
    this.currentPage = 0;
    this.getTable();
  }

  togglePopUp() {
    if (this.display === 'block') {
      this.submitFilterForm();
    }
    this.display = this.display === 'none' ? 'block' : 'none';
  }

  isPointerColumn(column: ColumnParam): boolean {
    return this.pointerColumns.includes(column.title.key);
  }

  private initFilterForm() {
    this.filterForm = this.fb.group({
      registrationDateFrom: [''],
      registrationDateTo: [''],
      lastOrderDateFrom: [''],
      lastOrderDateTo: [''],
      ordersCountFrom: [''],
      ordersCountTo: [''],
      violationsFrom: [''],
      violationsTo: [''],
      bonusesFrom: [''],
      bonusesTo: ['']
    });
    this.filters = this.filterForm.value;
  }

  checkOnNumber(event: KeyboardEvent): boolean {
    return !isNaN(Number(event.key));
  }

  numberPlusOrMinus(column: string, add: boolean): void {
    const val = Number(this.filterForm.get(column).value);
    add ? this.filterForm.get(column).setValue(val + 1) : this.filterForm.get(column).setValue(val - 1);
  }

  submitFilterForm() {
    this.filters = this.filterForm.value;
    const prevQueryString = this.queryString;
    const queryParams = [];
    const filtersObj = {
      numberOfBonuses: [this.filters.bonusesFrom, this.filters.bonusesTo],
      numberOfOrders: [this.filters.ordersCountFrom, this.filters.ordersCountTo],
      numberOfViolations: [this.filters.violationsFrom, this.filters.violationsTo],
      orderDate: [
        this.filters.lastOrderDateFrom
          ? this.convertFromDateToStringService.toISOStringWithTimezoneOffset(this.filters.lastOrderDateFrom)
          : '',
        this.filters.lastOrderDateTo ? this.convertFromDateToStringService.toISOStringWithTimezoneOffset(this.filters.lastOrderDateTo) : ''
      ],
      userRegistrationDate: [
        this.filters.registrationDateFrom
          ? this.convertFromDateToStringService.toISOStringWithTimezoneOffset(this.filters.registrationDateFrom)
          : '',
        this.filters.registrationDateTo
          ? this.convertFromDateToStringService.toISOStringWithTimezoneOffset(this.filters.registrationDateTo)
          : ''
      ]
    };
    for (const filter in filtersObj) {
      if (filtersObj[filter][0] && filtersObj[filter][1]) {
        queryParams.push(`${filter}=${filtersObj[filter][0]}`, `${filter}=${filtersObj[filter][1]}`);
      } else if (filtersObj[filter][0] && !filtersObj[filter][1]) {
        queryParams.push(`${filter}=${filtersObj[filter][0]}`);
      } else if (!filtersObj[filter][0] && filtersObj[filter][1]) {
        queryParams.push(`${filter}=0`, `${filter}=${filtersObj[filter][1]}`);
      }
    }
    this.queryString = queryParams.join('&');
    if (this.queryString !== prevQueryString) {
      this.currentPage = 0;
      this.getTable();
    }
    this.buildActiveFilters();
  }

  private buildActiveFilters(): void {
  this.activeFilters = [];

  const map = [
    {
      key: 'registrationDate',
      label: 'ubs-customer-filters.registration-date',
      from: 'registrationDateFrom',
      to: 'registrationDateTo',
      isDate: true
    },
    {
      key: 'lastOrderDate',
      label: 'ubs-customer-filters.last-order-date',
      from: 'lastOrderDateFrom',
      to: 'lastOrderDateTo',
      isDate: true
    },
    {
      key: 'ordersCount',
      label: 'ubs-customer-filters.orders-amount',
      from: 'ordersCountFrom',
      to: 'ordersCountTo'
    },
    {
      key: 'violations',
      label: 'ubs-customer-filters.violations',
      from: 'violationsFrom',
      to: 'violationsTo'
    },
    {
      key: 'bonuses',
      label: 'ubs-customer-filters.bonuses',
      from: 'bonusesFrom',
      to: 'bonusesTo'
    }
  ];

  const localeMap = {
    uk: 'uk-UA',
    en: 'en-GB'
  };
  const locale = localeMap[this.currentLang] || this.currentLang;
  const datePipe = new DatePipe(locale);

  map.forEach((f) => {
    let from = this.filterForm.get(f.from).value;
    let to = this.filterForm.get(f.to).value;

    if (from || to) {
      const fromText = this.translate.instant('ubs-customer-filters.from').toLowerCase();
      const toText = this.translate.instant('ubs-customer-filters.to').toLowerCase();

      if (f.isDate) {
        from = from ? datePipe.transform(new Date(from), 'dd/MM/yyyy') : from;
        to = to ? datePipe.transform(new Date(to), 'dd/MM/yyyy') : to;
      }

      let valueText = '';

      if (from && to) {
        valueText = `${fromText} ${from} ${toText} ${to}`;
      } else if (from) {
        valueText = `${fromText} ${from}`;
      } else if (to) {
        valueText = `${toText} ${to}`;
      }

      this.activeFilters.push({
        key: f.key,
        labelKey: f.label,
        valueText,
        fromControl: f.from,
        toControl: f.to
      });
    }
  });
}

removeActiveFilter(filter): void {
  this.filterForm.get(filter.fromControl).setValue('');
  this.filterForm.get(filter.toControl).setValue('');
  this.activeFilters = this.activeFilters.filter(f => f.key !== filter.key);
  this.submitFilterForm();
}

  onDeleteFilter(filterFrom: string, filterTo: string) {
    this.filterForm.get(filterFrom).setValue('');
    this.filterForm.get(filterTo).setValue('');
    this.submitFilterForm();
  }

  private onCreateGroupFormValueChange() {
    this.initialFilterValues = this.filterForm?.value;
    this.filterForm?.valueChanges.subscribe((value) => {
      this.hasChange = Object.keys(this.initialFilterValues).some(
        (key) => this.filterForm.value[key] !== null && this.filterForm.value[key] !== this.initialFilterValues[key]
      );
    });
  }

  onClearFilters() {
    this.filterForm.reset(this.initialFilterValues);
    this.submitFilterForm();
  }

  openExportExcel(): void {
    const dialogConfig = new MatDialogConfig();
    const dialogRef = this.dialog.open(UbsAdminTableExcelPopupComponent, dialogConfig);
    dialogRef.componentInstance.totalElements = this.totalElements;
    dialogRef.componentInstance.allElements = this.allElements;
    dialogRef.componentInstance.sortingColumn = this.sortingColumn;
    dialogRef.componentInstance.sortType = this.sortType;
    dialogRef.componentInstance.search = this.filterValue;
    dialogRef.componentInstance.filters = this.queryString;
    dialogRef.componentInstance.name = 'Customers-Table.xlsx';
  }

  onScroll(): void {
    if (!this.isUpdate && this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.updateTableData();
    }
  }

  onKeyDown(event: KeyboardEvent, columnKey: string, row) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.openPages(columnKey, row);
    }
  }

  applyFilter(filterValue: string): void {
    this.filterValue = filterValue;
    this.currentPage = 0;
    this.getTable();
    this.hasChange = true;
  }

  getFilteredTable(filterValue: string, enterPressed: boolean) {
    if (enterPressed) {
      this.enterPressed = enterPressed;
      this.applyFilter(filterValue);
    }
    this.filterSubject.next(filterValue);
  }

  private getTable(
    filterValue = this.filterValue || '',
    columnName = this.sortingColumn || 'clientName',
    sortingType = this.sortType || 'ASC'
  ) {
    this.isLoading = true;
    this.adminCustomerService
      .getCustomers(columnName, this.currentPage, this.queryString, filterValue, this.pageSize, sortingType)
      .pipe(takeUntil(this.destroy$))
      .subscribe((customerTable: ICustomersTable) => {
        this.store.dispatch(GetCustomerTable({ table: customerTable }));
        this.setTableData(customerTable);
      });
  }

  private setTableData(customerTable: ICustomersTable) {
    this.tableData = customerTable.page;
    this.dataSource = new MatTableDataSource(this.tableData);
    this.isLoading = false;
    this.totalPages = customerTable.totalPages;
    this.totalElements = customerTable.totalElements;
    this.allElements = !this.allElements ? this.totalElements : this.allElements;
    this.isTableHeightSet = false;
  }

  private updateTableData() {
    this.isUpdate = true;
    this.sortingColumn = !this.sortingColumn ? 'clientName' : this.sortingColumn;
    this.adminCustomerService
      .getCustomers(this.sortingColumn, this.currentPage, this.queryString, this.filterValue, this.pageSize, this.sortType || 'ASC')
      .pipe(takeUntil(this.destroy$))
      .subscribe((item: ICustomersTable) => {
        this.store.dispatch(GetCustomerTable({ table: item }));
        this.tableData = [...this.tableData, ...item.page];
        this.dataSource = new MatTableDataSource(this.tableData);
        this.totalPages = item.totalPages;
        this.isUpdate = false;
        if (item.page.length) {
          this.totalElements = item.totalElements;
        }
      });
  }

  private setDisplayedColumns() {
    this.columns.forEach((column, index) => {
      column.index = index;
      this.displayedColumns[index] = column.title.key;
    });
  }

  onResizeColumn(event: any, index: number) {
    this.checkResizing(event, index);
    this.currentResizeIndex = index;
    this.pressed = true;
    this.startX = event.pageX;
    this.startWidth = event.target.clientWidth;
    event.preventDefault();
    this.mouseMove(index);
  }

  private setTableResize(tableWidth: number): void {
    const totalW = this.columns.reduce((acc, item) => acc + item.width, 0);
    const scale = tableWidth / totalW;

    this.columns.forEach((column) => {
      column.width *= scale;
      this.setColumnWidth(column);
    });
  }

  private checkResizing(event: any, index: any) {
    const cellData = this.getCellData(index);
    this.isResizingRight =
      index === 0 || (Math.abs(event.pageX - cellData.right) < cellData.width / 2 && index !== this.columns.length - 1);
  }

  private getCellData(index: number) {
    const headerRow = this.matTableRef.nativeElement.children[0];
    const cell = headerRow.children[index];
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
      if (newWidth > 50) {
        this.columns[index].width = width;
        this.setColumnWidth(this.columns[index]);
        this.columns[j].width = newWidth;
        this.setColumnWidth(this.columns[j]);
      }
    }
  }

  private setColumnWidth(column: ColumnParam) {
    const columnEls = Array.from(document.getElementsByClassName('mat-column-' + column.title.key));
    columnEls.forEach((el: any) => {
      el.style.width = column.width + 'px';
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.setTableResize(this.matTableRef.nativeElement.clientWidth);
  }

  openPages(columnName, row) {
    if (columnName === 'clientName') {
      this.openCustomer(row, row[columnName]);
    } else if (columnName === 'number_of_orders') {
      this.openOrders(row);
    } else if (columnName === 'violations') {
      this.openViolations(row);
    }
  }

  onOpenChat(chatId: number) {
    this.router.navigate(['ubs/admin', 'chat-page'], { queryParams: { chatId: chatId } });
  }

  private openCustomer(row, username): void {
    this.localStorageService.setCustomer(row);
    this.router.navigate(['ubs/admin', 'customers', `${username.replaceAll(' ', '')}`]);
  }

  private openOrders(user): void {
    this.router.navigate(['ubs/admin', 'customerOrders', `${user.userId}`]);
  }

  private openViolations(user): void {
    if (user.violations) {
      this.router.navigate(['ubs/admin', 'customerViolations', `${user.userId}`]);
    }
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
