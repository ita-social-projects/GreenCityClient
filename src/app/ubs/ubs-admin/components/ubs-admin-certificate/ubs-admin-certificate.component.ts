import { Component, OnInit, ViewChild, OnDestroy, AfterViewChecked, ElementRef, Renderer2, HostListener } from '@angular/core';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { AdminCertificateService } from '../../services/admin-certificate.service';
import { TableHeightService } from '../../services/table-height.service';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { UbsAdminCertificateAddCertificatePopUpComponent } from './ubs-admin-certificate-add-certificate-pop-up/ubs-admin-certificate-add-certificate-pop-up.component';
import { UbsAdminTableExcelPopupComponent } from '../ubs-admin-table/ubs-admin-table-excel-popup/ubs-admin-table-excel-popup.component';
import { columnsParamsCertificates } from '../ubs-admin-customers/columnsParams';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { nonSortableColumns } from '../../models/non-sortable-columns.model';

@Component({
  selector: 'app-ubs-admin-certificate',
  templateUrl: './ubs-admin-certificate.component.html',
  styleUrls: ['./ubs-admin-certificate.component.scss']
})
export class UbsAdminCertificateComponent implements OnInit, AfterViewChecked, OnDestroy {
  sortingColumn: string;
  sortType: string;
  columns: any[] = [];
  isTableHeightSet = false;
  displayedColumns: string[] = [];
  orderInfo: string[] = [];
  customerInfo: string[] = [];
  orderDetails: string[] = [];
  certificate: string[] = [];
  detailsOfExport: string[] = [];
  responsiblePerson: string[] = [];
  dataSource: MatTableDataSource<any>;
  nonSortableColumns = nonSortableColumns;
  selection = new SelectionModel<any>(true, []);
  arrayOfHeaders = [];
  previousIndex: number;
  isLoading = true;
  isUpdate = false;
  destroy: Subject<boolean> = new Subject<boolean>();
  tableData: any[];
  totalPages: number;
  currentPage = 0;
  pageSize = 25;
  totalElements = 0;
  allElements: number;
  filterValue = '';
  modelChanged: Subject<string> = new Subject<string>();
  currentLang: string;
  currentResizeIndex: number;
  pressed = false;
  startX: number;
  startWidth: number;
  isResizingRight: boolean;
  arrowDirection: string;
  resizableMousemove: () => void;
  resizableMouseup: () => void;
  @ViewChild(MatTable, { read: ElementRef }) private matTableRef: ElementRef;

  constructor(
    private adminCertificateService: AdminCertificateService,
    private tableHeightService: TableHeightService,
    public dialog: MatDialog,
    private localStorageService: LocalStorageService,
    public dialogRef: MatDialogRef<UbsAdminCertificateAddCertificatePopUpComponent>,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    this.localStorageService.languageBehaviourSubject.pipe(takeUntil(this.destroy)).subscribe((lang) => {
      this.currentLang = lang;
    });
    this.modelChanged.pipe(debounceTime(500)).subscribe((model) => {
      this.currentPage = 0;
      this.getTable(model, this.sortingColumn, this.sortType);
    });
    this.columns = columnsParamsCertificates;
    this.setDisplayedColumns();
    this.getTable();
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
    if (!this.isLoading) {
      this.setTableResize(this.matTableRef.nativeElement.clientWidth);
    }
  }

  getSortingData(columnName, sortingType) {
    this.sortingColumn = columnName;
    this.sortType = sortingType;
    this.arrowDirection = this.arrowDirection === columnName ? null : columnName;
    this.currentPage = 0;
    this.getTable(this.filterValue, columnName, sortingType);
  }

  applyFilter(filterValue: string): void {
    this.filterValue = filterValue;
    this.modelChanged.next(filterValue);
  }

  setDisplayedColumns() {
    this.columns.forEach((column, index) => {
      column.index = index;
      this.displayedColumns[index] = column.title.key;
    });
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
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.orderId + 1}`;
  }

  getTable(filterValue = this.filterValue || '', columnName = this.sortingColumn || 'code', sortingType = this.sortType || 'DESC') {
    this.isLoading = true;
    this.adminCertificateService
      .getTable(columnName, this.currentPage, filterValue, this.pageSize, sortingType)
      .pipe(takeUntil(this.destroy))
      .subscribe((item) => {
        this.tableData = item[`page`];
        this.totalPages = item[`totalPages`];
        this.totalElements = item[`totalElements`];
        this.allElements = !this.allElements ? this.totalElements : this.allElements;
        this.dataSource = new MatTableDataSource(this.tableData);
        this.isLoading = false;
        this.isTableHeightSet = false;
      });
  }

  updateTableData() {
    this.isUpdate = true;
    this.adminCertificateService
      .getTable(this.sortingColumn || 'code', this.currentPage, this.filterValue || '', this.pageSize, this.sortType || 'DESC')
      .pipe(takeUntil(this.destroy))
      .subscribe((item) => {
        const data = item[`page`];
        this.totalPages = item[`totalPages`];
        this.tableData = [...this.tableData, ...data];
        this.dataSource.data = this.tableData;
        this.isUpdate = false;
      });
  }

  onScroll() {
    if (!this.isUpdate && this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updateTableData();
    }
  }

  openAddCertificate() {
    const dialogRef = this.dialog.open(UbsAdminCertificateAddCertificatePopUpComponent, {
      hasBackdrop: true,
      disableClose: true,
      panelClass: 'cdk-table'
    });
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy))
      .subscribe((result) => {
        if (result) {
          this.currentPage = 0;
          this.getTable();
        }
      });
  }

  openExportExcel(): void {
    const dialogConfig = new MatDialogConfig();
    const dialogRef = this.dialog.open(UbsAdminTableExcelPopupComponent, dialogConfig);
    dialogRef.componentInstance.isElementSelected = !!this.selection.selected.length;
    dialogRef.componentInstance.selectedElements = this.selection.selected;
    dialogRef.componentInstance.totalElements = this.totalElements;
    dialogRef.componentInstance.allElements = this.allElements;
    dialogRef.componentInstance.sortingColumn = this.sortingColumn;
    dialogRef.componentInstance.sortType = this.sortType;
    dialogRef.componentInstance.search = this.filterValue;
    dialogRef.componentInstance.name = 'Certificates-Table.xlsx';
  }

  public onResizeColumn(event: any, index: number) {
    this.checkResizing(event, index);
    this.currentResizeIndex = index;
    this.pressed = true;
    this.startX = event.pageX;
    this.startWidth = event.target.clientWidth;
    this.mouseMove(index);
  }

  private setTableResize(tableWidth: number) {
    let totWidth = 0;
    this.columns.forEach((column) => {
      totWidth += column.width;
    });

    const scale = (tableWidth - 5) / totWidth;
    this.columns.forEach((column) => {
      column.width *= scale;
      this.setColumnWidth(column);
    });
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

  private setColumnWidth(column: any) {
    const columnEls = Array.from(document.getElementsByClassName('mat-column-' + column.title.key));
    columnEls.forEach((el: any) => {
      el.style.width = column.width + 'px';
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.setTableResize(this.matTableRef.nativeElement.clientWidth);
  }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.unsubscribe();
  }
}
