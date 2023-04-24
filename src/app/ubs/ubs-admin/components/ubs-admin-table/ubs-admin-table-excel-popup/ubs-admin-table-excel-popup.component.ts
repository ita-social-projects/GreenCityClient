import { Component, OnInit } from '@angular/core';
import { AdminTableService } from 'src/app/ubs/ubs-admin/services/admin-table.service';
import { AdminCertificateService } from 'src/app/ubs/ubs-admin/services/admin-certificate.service';
import { AdminCustomersService } from 'src/app/ubs/ubs-admin/services/admin-customers.service';
import { LanguageService } from 'src/app/main/i18n/language.service';
import { Language } from 'src/app/main/i18n/Language';
import { tableViewParameters, nameOfTable, notTranslatedRows } from '../../../models/admin-tables.model';
import * as XLSX from 'xlsx';
import { IBigOrderTableOrderInfo } from '../../../models/ubs-admin.interface';

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
  dataForTranslation: any[];
  language: Language;

  constructor(
    private adminTableService: AdminTableService,
    private adminCertificateService: AdminCertificateService,
    private adminCustomerService: AdminCustomersService,
    private languageService: LanguageService
  ) {}

  ngOnInit() {
    this.language = this.languageService.getCurrentLanguage();
    this.tableView = tableViewParameters.wholeTable;
  }

  saveTable() {
    this.isLoading = true;
    if (this.tableView === tableViewParameters.wholeTable) {
      if (this.name === nameOfTable.ordersTable) {
        this.getOrdersTable(this.onePageForWholeTable, this.allElements, '', 'DESC', 'id')
          .then((res) => {
            this.tableData = res[`content`];
            this.setTranslatedOrders();
          })
          .finally(() => {
            this.createXLSX();
          });
      }
      if (this.name === nameOfTable.certificatesTable) {
        this.getCertificatesTable(this.onePageForWholeTable, this.allElements, '', 'DESC', 'code')
          .then((res) => {
            this.tableData = res[`page`];
          })
          .finally(() => {
            this.createXLSX();
          });
      }
      if (this.name === nameOfTable.customersTable) {
        this.getCustomersTable(this.onePageForWholeTable, this.allElements, '', '', 'ASC', 'clientName')
          .then((res) => {
            this.tableData = res[`page`];
          })
          .finally(() => {
            this.createXLSX();
          });
      }
    } else if (this.tableView === tableViewParameters.currentFilter) {
      if (this.name === nameOfTable.ordersTable) {
        this.getOrdersTable(this.onePageForWholeTable, this.totalElements, this.search, this.sortType, this.sortingColumn)
          .then((res) => {
            this.tableData = res[`content`];
            this.setTranslatedOrders();
          })
          .finally(() => {
            this.createXLSX();
          });
      }
      if (this.name === nameOfTable.certificatesTable) {
        this.getCertificatesTable(this.onePageForWholeTable, this.totalElements, this.search, this.sortType, this.sortingColumn)
          .then((res) => {
            this.tableData = res[`page`];
          })
          .finally(() => {
            this.createXLSX();
          });
      }
      if (this.name === nameOfTable.customersTable) {
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

  getColumnValue(columnKey: string, itemKey: string, language: string): string {
    const column = this.dataForTranslation.find((columnItem) => columnItem.titleForSorting === columnKey);
    const item = column.checked.find((status) => status.key === itemKey);
    return item ? item[language] : itemKey;
  }

  getUpdatedRows(row): IBigOrderTableOrderInfo {
    return {
      ...row,
      orderStatus: this.getColumnValue('orderStatus', row.orderStatus, this.language),
      orderPaymentStatus: this.getColumnValue('orderPaymentStatus', row.orderPaymentStatus, this.language),
      address: row.address ? row.address[this.language] : row.address,
      city: row.city ? row.city[this.language] : row.city,
      region: row.region ? row.region[this.language] : row.region,
      district: row.district ? row.district[this.language] : row.district,
      receivingStation: this.getColumnValue('receivingStation', row.receivingStation, this.language),
      responsibleDriver: this.getColumnValue('responsibleDriver', row.responsibleDriver, this.language),
      responsibleNavigator: this.getColumnValue('responsibleNavigator', row.responsibleNavigator, this.language),
      responsibleCaller: this.getColumnValue('responsibleCaller', row.responsibleCaller, this.language),
      responsibleLogicMan: this.getColumnValue('responsibleLogicMan', row.responsibleLogicMan, this.language)
    };
  }

  setTranslatedOrders(): void {
    this.tableData = this.tableData.map((row) => this.getUpdatedRows(row));
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
