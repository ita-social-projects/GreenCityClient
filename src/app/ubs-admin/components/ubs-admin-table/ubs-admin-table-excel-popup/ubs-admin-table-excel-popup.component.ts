import { Component, OnInit } from '@angular/core';
import { AdminTableService } from 'src/app/ubs-admin/services/admin-table.service';
import { AdminCertificateService } from 'src/app/ubs-admin/services/admin-certificate.service';
import { AdminCustomersService } from 'src/app/ubs-admin/services/admin-customers.service';
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
  search: string;
  name: string;
  allElements: number;
  filters: string;

  constructor(
    private adminTableService: AdminTableService,
    private adminCertificateService: AdminCertificateService,
    private adminCustomerService: AdminCustomersService
  ) {}

  ngOnInit() {
    this.tableView = 'wholeTable';
  }

  saveTable() {
    this.isLoading = true;
    if (this.tableView === 'wholeTable') {
      if (this.name === 'Orders-Table.xlsx') {
        this.getOrdersTable(this.onePageForWholeTable, this.allElements, '', 'DESC', 'id')
          .then((res) => {
            this.tableData = res[`content`];
          })
          .finally(() => {
            this.createXLSX();
          });
      }
      if (this.name === 'Certificates-Table.xlsx') {
        this.getCertificatesTable(this.onePageForWholeTable, this.allElements, '', 'DESC', 'code')
          .then((res) => {
            this.tableData = res[`page`];
          })
          .finally(() => {
            this.createXLSX();
          });
      }
      if (this.name === 'Customers-Table.xlsx') {
        this.getCustomersTable(this.onePageForWholeTable, this.allElements, '', '', 'ASC', 'clientName')
          .then((res) => {
            this.tableData = res[`page`];
          })
          .finally(() => {
            this.createXLSX();
          });
      }
    } else if (this.tableView === 'currentFilter') {
      if (this.name === 'Orders-Table.xlsx') {
        this.getOrdersTable(this.onePageForWholeTable, this.totalElements, this.search, this.sortType, this.sortingColumn)
          .then((res) => {
            this.tableData = res[`content`];
          })
          .finally(() => {
            this.createXLSX();
          });
      }
      if (this.name === 'Certificates-Table.xlsx') {
        this.getCertificatesTable(this.onePageForWholeTable, this.totalElements, this.search, this.sortType, this.sortingColumn)
          .then((res) => {
            this.tableData = res[`page`];
          })
          .finally(() => {
            this.createXLSX();
          });
      }
      if (this.name === 'Customers-Table.xlsx') {
        this.getCustomersTable(this.onePageForWholeTable, this.totalElements, this.filters, this.search, this.sortType, this.sortingColumn)
          .then((res) => {
            this.tableData = res[`page`];
          })
          .finally(() => {
            this.createXLSX();
          });
      }
    }
  }

  getOrdersTable(
    currentPage,
    pageSize,
    filters = this.search || '',
    sortingType = this.sortType || 'DESC',
    columnName = this.sortingColumn || 'id'
  ) {
    return this.adminTableService.getTable(columnName, currentPage, filters, pageSize, sortingType).toPromise();
  }

  getCertificatesTable(
    currentPage,
    pageSize,
    search = this.search || '',
    sortingType = this.sortType || 'DESC',
    columnName = this.sortingColumn || 'code'
  ) {
    return this.adminCertificateService.getTable(columnName, currentPage, search, pageSize, sortingType).toPromise();
  }

  getCustomersTable(
    currentPage,
    pageSize,
    filters = this.filters || '',
    search = this.search || '',
    sortingType = this.sortType || 'ASC',
    columnName = this.sortingColumn || 'clientName'
  ) {
    return this.adminCustomerService.getCustomers(columnName, currentPage, filters, search, pageSize, sortingType).toPromise();
  }

  createXLSX() {
    this.isLoading = false;
    if (this.tableData) {
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.tableData);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
      XLSX.writeFile(wb, this.name);
    } else {
      alert('Error. Please try again');
    }
  }
}
