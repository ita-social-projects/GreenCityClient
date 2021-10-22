import { Component, OnInit } from '@angular/core';
import { AdminTableService } from 'src/app/ubs-admin/services/admin-table.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-ubs-admin-table-excel-popup',
  templateUrl: './ubs-admin-table-excel-popup.component.html',
  styleUrls: ['./ubs-admin-table-excel-popup.component.scss']
})
export class UbsAdminTableExcelPopupComponent implements OnInit {
  isLoading = false;
  readonly onePageForWholeTable = 0;
  sortingColumn: string;
  sortType: string;
  tableData: any[];
  tableView: string;
  totalElements: number;

  constructor(private adminTableService: AdminTableService) {}

  ngOnInit() {
    this.tableView = 'wholeTable';
  }

  async saveTable() {
    if (this.tableView === 'wholeTable') {
    } else if (this.tableView === 'currentFilter') {
      // implement downloading with filtering, when filtering will be implemented into project
    }

    this.isLoading = true;
    this.tableData = await this.getTable(this.onePageForWholeTable, this.totalElements, this.sortType, this.sortingColumn);
    this.isLoading = false;

    if (this.tableData) {
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.tableData);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
      XLSX.writeFile(wb, 'Orders-Table.xlsx');
    } else {
      // do something if error
    }
  }

  // Default parameters should be last.
  getTable(currentPage, pageSize, sortingType = this.sortType || 'DESC', columnName = this.sortingColumn || 'id') {
    return this.adminTableService
      .getTable(columnName, currentPage, pageSize, sortingType)
      .toPromise()
      .then((res) => {
        return res[`page`];
      })
      .catch((err) => {
        return false;
      });
  }
}
