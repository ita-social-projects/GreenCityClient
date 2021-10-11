import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit, ViewChild, OnDestroy, AfterViewChecked } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSort } from '@angular/material/sort';
import { AdminCertificateService } from '../../services/admin-certificate.service';
import { TableHeightService } from '../../services/table-height.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UbsAdminCertificateAddCertificatePopUpComponent } from './ubs-admin-certificate-add-certificate-pop-up/ubs-admin-certificate-add-certificate-pop-up.component';

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
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private adminCertificateService: AdminCertificateService,
    private tableHeightService: TableHeightService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<UbsAdminCertificateAddCertificatePopUpComponent>
  ) {}

  ngOnInit() {
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
    this.dataSource.filter = filterValue.trim().toLowerCase();
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

  getTable(columnName = this.sortingColumn || 'code', sortingType = this.sortType || 'DESC') {
    this.isLoading = true;
    this.adminCertificateService
      .getTable(columnName, this.currentPage, this.pageSize, sortingType)
      .pipe(takeUntil(this.destroy))
      .subscribe((item) => {
        this.tableData = item[`page`];
        this.totalPages = item[`totalPages`];
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
      .getTable(this.sortingColumn || 'code', this.currentPage, this.pageSize, this.sortType || 'DESC')
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

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.unsubscribe();
  }
}
