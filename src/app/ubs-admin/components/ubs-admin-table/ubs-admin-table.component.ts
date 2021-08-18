import { AdminTableService } from '../../services/admin-table.service';
import { CdkDragStart, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit, ViewChild } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { ubsAdminTable } from '../ubs-image-pathes/ubs-admin-table';

@Component({
  selector: 'app-ubs-admin-table',
  templateUrl: './ubs-admin-table.component.html',
  styleUrls: ['./ubs-admin-table.component.scss']
})
export class UbsAdminTableComponent implements OnInit {
  columns: any[] = [];
  displayedColumns: string[] = [];
  orderInfo: string[] = [];
  customerInfo: string[] = [];
  orderDetails: string[] = [];
  sertificate: string[] = [];
  detailsOfExport: string[] = [];
  responsiblePerson: string[] = [];
  dataSource: MatTableDataSource<any>;
  selection = new SelectionModel<any>(true, []);
  arrayOfHeaders: string[] = [];
  previousIndex: number;
  isLoading = true;
  isUpdate = false;
  destroy: Subject<boolean> = new Subject<boolean>();
  arrowDirection: string;
  tableData: any[];
  totalPages: number;
  pageSizeOptions: number[] = [10, 15, 20];
  currentPage = 0;
  pageSize = 10;
  ubsAdminTableIcons = ubsAdminTable;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private adminTableService: AdminTableService) {}

  ngOnInit() {
    this.getTable();
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  setDisplayedColumns() {
    this.columns.forEach((colunm, index) => {
      colunm.index = index;
      this.displayedColumns[index] = colunm.field;
    });
  }

  dragStarted(event: CdkDragStart, index: number) {
    this.previousIndex = index;
  }

  dropListDropped(event: CdkDropList, index: number) {
    if (event) {
      moveItemInArray(this.columns, this.previousIndex, index);
      this.setDisplayedColumns();
    }
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

  showAllColumns(): void {
    this.getTable();
  }

  changeColumns(field: string, i: number) {
    const beforeColumnsLength = this.columns.length;
    this.columns = this.columns.filter((el) => el.field !== field);
    const afterColumnsLength = this.columns.length;
    const requiredFieldValues = ['orderid', 'order_status', 'order_date'];
    if (beforeColumnsLength === afterColumnsLength) {
      const newObjectForHeader = {
        field,
        sticky: this.isPropertyRequired(field, requiredFieldValues),
        index: i
      };
      this.columns = [...this.columns.slice(0, i), newObjectForHeader, ...this.columns.slice(i, this.columns.length)];
      this.setDisplayedColumns();
    } else {
      this.setDisplayedColumns();
    }
  }

  getTable(columnName = 'orderId', sortingType = 'desc') {
    this.isLoading = true;
    this.adminTableService
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
          const requiredFieldValues = ['orderid', 'order_status', 'order_date'];
          const objectOfValue = {
            field: property,
            sticky: this.isPropertyRequired(property, requiredFieldValues)
          };
          dynamicallyColumns.push(objectOfValue);
        });
        this.columns = [].concat(requiredColumns, dynamicallyColumns);
        this.setDisplayedColumns();
        this.isLoading = false;
        this.arrayOfHeaders = dynamicallyColumns;
        this.orderInfo = dynamicallyColumns.slice(0, 3);
        this.customerInfo = dynamicallyColumns.slice(3, 10);
        this.orderDetails = dynamicallyColumns.slice(10, 18);
        this.sertificate = dynamicallyColumns.slice(18, 22);
        this.detailsOfExport = dynamicallyColumns.slice(22, 27);
        this.responsiblePerson = dynamicallyColumns.slice(27, 33);
      });
  }

  private isPropertyRequired(field: string, requiredFields: string[]) {
    return requiredFields.some((reqField) => field === reqField);
  }

  updateTableData() {
    this.isUpdate = true;
    this.adminTableService
      .getTable('orderId', this.currentPage, this.pageSize, 'desc')
      .pipe(takeUntil(this.destroy))
      .subscribe((item) => {
        const data = item[`page`];
        this.totalPages = item[`totalPages`];
        this.tableData = [...this.tableData, ...data];
        this.dataSource.data = this.tableData;
        this.isUpdate = false;
      });
  }

  getSortingDate(columnName, sortingType) {
    this.arrowDirection = this.arrowDirection === columnName ? null : columnName;
    this.getTable(columnName, sortingType);
  }

  selectPageSize(value: number) {
    this.pageSize = value;
  }

  onScroll() {
    if (!this.isUpdate && this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updateTableData();
    }
  }
}
