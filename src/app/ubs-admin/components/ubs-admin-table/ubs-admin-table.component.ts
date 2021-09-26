import { nonSortableColumns } from './../../models/non-sortable-columns.model';
import { AdminTableService } from '../../services/admin-table.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { ubsAdminTable } from '../ubs-image-pathes/ubs-admin-table';
import { MatSort } from '@angular/material/sort';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { IEditCell } from '../../models/edit-cell.model';

@Component({
  selector: 'app-ubs-admin-table',
  templateUrl: './ubs-admin-table.component.html',
  styleUrls: ['./ubs-admin-table.component.scss']
})
export class UbsAdminTableComponent implements OnInit, OnDestroy {
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
  tableData: any[];
  totalPages: number;
  pageSizeOptions: number[] = [10, 15, 20];
  currentPage = 0;
  pageSize = 10;
  ubsAdminTableIcons = ubsAdminTable;
  idsToChange: number[] = [];
  allChecked: boolean;
  tableViewHeaders = [];
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private adminTableService: AdminTableService, private localStorageService: LocalStorageService) {}

  ngOnInit() {
    this.localStorageService.languageBehaviourSubject.pipe(takeUntil(this.destroy)).subscribe((lang) => {
      this.currentLang = lang;
    });
    this.getColumns();
    this.getTable();
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
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

  public changeColumns(checked: boolean, key: string, positionIndex): void {
    checked
      ? (this.displayedColumns = [...this.displayedColumns.slice(0, positionIndex), key, ...this.displayedColumns.slice(positionIndex)])
      : (this.displayedColumns = this.displayedColumns.filter((item) => item !== key));
  }

  public showAllColumns(): void {
    this.setDisplayedColumns();
  }

  private getColumns() {
    this.adminTableService
      .getColumns()
      .pipe(takeUntil(this.destroy))
      .subscribe((columns: any) => {
        this.tableViewHeaders = columns.columnBelongingList;
        this.columns = columns.columnStateDTOList;
        this.setDisplayedColumns();
      });
  }

  private getTable(columnName = this.sortingColumn || 'orderid', sortingType = this.sortType || 'desc') {
    this.isLoading = true;
    this.adminTableService
      .getTable(columnName, this.currentPage, this.pageSize, sortingType)
      .pipe(takeUntil(this.destroy))
      .subscribe((item) => {
        this.tableData = item[`page`];
        this.totalPages = item[`totalPages`];
        this.dataSource = new MatTableDataSource(this.tableData);
        this.isLoading = false;
      });
  }

  private isPropertyRequired(field: string, requiredFields: string[]) {
    return requiredFields.some((reqField) => field === reqField);
  }

  updateTableData() {
    this.isUpdate = true;
    this.adminTableService
      .getTable(this.sortingColumn || 'orderid', this.currentPage, this.pageSize, this.sortType || 'desc')
      .pipe(takeUntil(this.destroy))
      .subscribe((item) => {
        const data = item[`page`];
        this.totalPages = item[`totalPages`];
        this.tableData = [...this.tableData, ...data];
        this.dataSource.data = this.tableData;
        this.isUpdate = false;
      });
  }

  getSortingData(columnName, sortingType) {
    this.sortingColumn = columnName;
    this.sortType = sortingType;
    this.arrowDirection = this.arrowDirection === columnName ? null : columnName;
    this.currentPage = 0;
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

  selectRowsToChange(event, id: number) {
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

  private setDisplayedColumns(): void {
    this.columns.forEach((column, index) => {
      this.displayedColumns[index] = column.title.key;
    });
  }

  private editSingle(e: IEditCell): void {
    this.editCellProgressBar = true;
    const id = this.tableData.findIndex((item) => item.orderid === e.id);
    const newRow = { ...this.tableData[id], [e.nameOfColumn]: e.newValue };
    const newTableData = [...this.tableData.slice(0, id), newRow, ...this.tableData.slice(id + 1)];
    this.tableData = newTableData;
    this.dataSource = new MatTableDataSource(newTableData);
    this.postData([e.id], e.nameOfColumn, e.newValue);
  }

  private editGroup(e: IEditCell): void {
    this.editCellProgressBar = true;
    const ids = [];
    let newTableDataCombine = this.tableData;

    for (const idIter of this.idsToChange) {
      const check = this.tableData.findIndex((item) => item.orderid === idIter);
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
  }

  private postData(id, nameOfColumn, newValue): void {
    this.adminTableService.postData(id, nameOfColumn, newValue).subscribe(
      (val) => {
        this.editCellProgressBar = false;
        this.idsToChange = [];
      },
      (error) => {
        this.editCellProgressBar = false;
        this.idsToChange = [];
      }
    );
  }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.unsubscribe();
  }
}
