import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { AdminTableService } from 'src/app/ubs-admin/services/admin-table.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-ubs-admin-table-excel-popup',
  templateUrl: './ubs-admin-table-excel-popup.component.html',
  styleUrls: ['./ubs-admin-table-excel-popup.component.scss']
})
export class UbsAdminTableExcelPopupComponent implements OnInit, OnDestroy {
  destroy: Subject<boolean> = new Subject<boolean>();
  tableView: string;
  totalElements: number;

  constructor(private adminTableService: AdminTableService) {}

  ngOnInit() {
    this.tableView = 'allTable';
  }

  saveTable() {
    // const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.tableData);
    // const wb: XLSX.WorkBook = XLSX.utils.book_new();
    // XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    // XLSX.writeFile(wb, 'SheetJS.xlsx');
    console.log(this.totalElements);
  }

  // getTable('orderid', sortingType = this.sortType || 'desc') {
  //   this.adminTableService
  //     .getTable(columnName, this.currentPage, this.pageSize, sortingType)
  //     .pipe(takeUntil(this.destroy))
  //     .subscribe((item) => {
  //       console.log(item);
  //       this.tableData = item[`page`];
  //       this.totalPages = item[`totalPages`];
  //       this.totalElements = item[`totalElements`];
  //     });
  // }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.unsubscribe();
  }
}
