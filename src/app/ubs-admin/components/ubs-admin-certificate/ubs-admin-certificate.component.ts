import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit, ViewChild, OnDestroy, AfterViewChecked } from '@angular/core';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSort } from '@angular/material/sort';
import { AdminCertificateService } from '../../services/admin-certificate.service';
import { TableHeightService } from '../../services/table-height.service';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { UbsAdminCertificateAddCertificatePopUpComponent } from './ubs-admin-certificate-add-certificate-pop-up/ubs-admin-certificate-add-certificate-pop-up.component';
import { UbsAdminTableExcelPopupComponent } from '../ubs-admin-table/ubs-admin-table-excel-popup/ubs-admin-table-excel-popup.component';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';

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
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private adminCertificateService: AdminCertificateService,
    private tableHeightService: TableHeightService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<UbsAdminCertificateAddCertificatePopUpComponent>
  ) {}

  ngOnInit() {
    this.modelChanged.pipe(debounceTime(500)).subscribe((model) => {
      this.currentPage = 0;
      this.getTable(model, this.sortingColumn, this.sortType);
    });
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
  }

  applyFilter(filterValue: string): void {
    this.filterValue = filterValue;
    this.modelChanged.next(filterValue);
  }

  setDisplayedColumns() {
    this.columns.forEach((column, index) => {
      column.index = index;
      this.displayedColumns[index] = column.field;
    });
  }

  dropListDropped(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.displayedColumns, event.previousIndex, event.currentIndex);
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
        const requiredColumns = [{ field: 'select', sticky: true }];
        const dynamicallyColumns = [];
        const arrayOfProperties = Object.keys(this.tableData[0]);
        arrayOfProperties.forEach((property) => {
          const objectOfValue = {
            field: property,
            sticky: false
          };
          dynamicallyColumns.push(objectOfValue);
        });
        this.columns = [].concat(requiredColumns, dynamicallyColumns);
        this.setDisplayedColumns();
        this.arrayOfHeaders = arrayOfProperties;
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
      disableClose: true
    });
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy))
      .subscribe((result) => result && this.getTable());
  }

  openExportExcel(): void {
    const dialogConfig = new MatDialogConfig();
    const dialogRef = this.dialog.open(UbsAdminTableExcelPopupComponent, dialogConfig);
    dialogRef.componentInstance.totalElements = this.totalElements;
    dialogRef.componentInstance.allElements = this.allElements;
    dialogRef.componentInstance.sortingColumn = this.sortingColumn;
    dialogRef.componentInstance.sortType = this.sortType;
    dialogRef.componentInstance.filterValue = this.filterValue;
    dialogRef.componentInstance.name = 'Certificates-Table.xlsx';
  }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.unsubscribe();
  }
}
