import { Component, OnInit } from '@angular/core';
import { AdminTableService } from 'src/app/ubs/ubs-admin/services/admin-table.service';
import { AdminCertificateService } from 'src/app/ubs/ubs-admin/services/admin-certificate.service';
import { AdminCustomersService } from 'src/app/ubs/ubs-admin/services/admin-customers.service';
import { LanguageService } from 'src/app/main/i18n/language.service';
import { Language } from 'src/app/main/i18n/Language';
import { IBigOrderTableOrderInfo } from '../../../models/ubs-admin.interface';
import { tableViewParameters, nameOfTable, notTranslatedRows } from '../../../models/admin-tables.model';
import * as XLSX from 'xlsx';
import { ColumnParam, columnsParams, columnsParamsCertificates, columnsParamsOrders } from '../../ubs-admin-customers/columnsParams';

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
  selectedElements: any[];
  isElementSelected: boolean;
  search: string;
  name: string;
  allElements: number;
  filters: string;
  dataForTranslation: any[];
  language: Language;
  columnTitles: string[] = [];
  columnKeys: string[] = [];
  columnToDisplay: string[] = [];

  constructor(
    private adminTableService: AdminTableService,
    private adminCertificateService: AdminCertificateService,
    private adminCustomerService: AdminCustomersService,
    private languageService: LanguageService
  ) {}

  ngOnInit() {
    this.language = this.languageService.getCurrentLanguage();
    this.tableView = tableViewParameters.wholeTable;

    if (this.dataForTranslation) {
      this.dataForTranslation.forEach((el) => {
        if (el?.title?.key !== 'select') {
          this.columnTitles.push(el?.title?.[this.language]);
          this.columnKeys.push(el?.title?.key);
        }
      });
    }
  }

  saveTable(): void {
    this.isLoading = true;
    const isSelectedOrders = this.tableView === tableViewParameters.selectedOrders;

    const isOrdersTable = this.name === nameOfTable.ordersTable;
    const isCertificatesTable = this.name === nameOfTable.certificatesTable;
    const isCustomersTable = this.name === nameOfTable.customersTable;

    if (this.tableView === tableViewParameters.wholeTable) {
      if (isOrdersTable) {
        this.getOrdersTable(this.onePageForWholeTable, this.allElements, '', 'DESC', 'id')
          .then((res) => {
            this.tableData = res[`content`];
            this.setTranslatedOrders();
          })
          .finally(() => {
            this.createXLSX();
          });
      }
      if (isCertificatesTable) {
        this.getCertificatesTable(this.onePageForWholeTable, this.allElements, '', 'DESC', 'code')
          .then((res) => {
            this.tableData = res[`page`];
          })
          .finally(() => {
            this.createXLSX();
          });
      }
      if (isCustomersTable) {
        this.getCustomersTable(this.onePageForWholeTable, this.allElements, '', '', 'ASC', 'clientName')
          .then((res) => {
            this.tableData = res[`page`];
          })
          .finally(() => {
            this.createXLSX();
          });
      }
    }
    if (this.tableView === tableViewParameters.currentFilter) {
      if (isOrdersTable) {
        this.getOrdersTable(this.onePageForWholeTable, this.totalElements, this.search, this.sortType, this.sortingColumn)
          .then((res) => {
            this.tableData = res[`content`];
            this.setTranslatedOrders();
            this.filterDataForDeletedColumn();
          })
          .finally(() => {
            this.createXLSX();
          });
      }
      if (isCertificatesTable) {
        this.getCertificatesTable(this.onePageForWholeTable, this.totalElements, this.search, this.sortType, this.sortingColumn)
          .then((res) => {
            this.tableData = res[`page`];
          })
          .finally(() => {
            this.createXLSX();
          });
      }
      if (isCustomersTable) {
        this.getCustomersTable(this.onePageForWholeTable, this.totalElements, this.filters, this.search, this.sortType, this.sortingColumn)
          .then((res) => {
            this.tableData = res[`page`];
          })
          .finally(() => {
            this.createXLSX();
          });
      }
    }
    if (isSelectedOrders && isOrdersTable) {
      this.tableData = this.selectedElements;
      this.setTranslatedOrders();
      this.filterDataForDeletedColumn();
      this.createXLSX();
    }
    if (isSelectedOrders && isCertificatesTable) {
      this.tableData = this.selectedElements;
      this.createXLSX();
    }
  }

  getColumnValue(columnKey: string, itemKey: string): string {
    const column = this.dataForTranslation.find((columnItem) => columnItem.titleForSorting === columnKey);
    const item = column.checked.find((status) => status.key === itemKey);
    return item ? item[this.language] : itemKey;
  }

  getUpdatedRows(row): IBigOrderTableOrderInfo {
    return {
      ...row,
      orderStatus: this.getColumnValue(notTranslatedRows.orderStatus, row.orderStatus),
      orderPaymentStatus: this.getColumnValue(notTranslatedRows.orderPaymentStatus, row.orderPaymentStatus),
      address: row.address ? row.address[this.language] : row.address,
      city: row.city ? row.city[this.language] : row.city,
      region: row.region ? row.region[this.language] : row.region,
      district: row.district ? row.district[this.language] : row.district,
      receivingStation: this.getColumnValue(notTranslatedRows.receivingStation, row.receivingStation),
      responsibleDriver: this.getColumnValue(notTranslatedRows.responsibleDriver, row.responsibleDriver),
      responsibleNavigator: this.getColumnValue(notTranslatedRows.responsibleNavigator, row.responsibleNavigator),
      responsibleCaller: this.getColumnValue(notTranslatedRows.responsibleCaller, row.responsibleCaller),
      responsibleLogicMan: this.getColumnValue(notTranslatedRows.responsibleLogicMan, row.responsibleLogicMan)
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

  filterDataForDeletedColumn() {
    this.columnTitles = this.columnTitles.filter((title, index) => this.columnToDisplay.includes(this.columnKeys[index]));

    this.columnKeys = this.columnKeys.filter((key) => this.columnToDisplay.includes(key));

    this.tableData = this.tableData.map((row) => {
      const filteredRow = {};
      this.columnKeys.forEach((key) => {
        filteredRow[key] = row[key];
      });
      return filteredRow;
    });
  }

  private getTranslatedColumnTitles(columnTitles: string[], translations: Record<string, ColumnParam[]>): string[] {
    let currentLanguage = this.languageService.getCurrentLanguage();
    if (currentLanguage === Language.UK) {
      currentLanguage = Language.UA;
    }

    return columnTitles.map((key: string) => {
      const column = translations[this.name]?.find((col) => col.title.key === key);
      if (column) {
        return column.title[currentLanguage.toLowerCase()] || key;
      }
      return key;
    });
  }

  createXLSX() {
    const translations: Record<string, ColumnParam[]> = {
      [nameOfTable.ordersTable]: columnsParamsOrders,
      [nameOfTable.certificatesTable]: columnsParamsCertificates,
      [nameOfTable.customersTable]: columnsParams
    };

    this.isLoading = false;

    let columnTitles: string[];
    if (this.tableData && this.tableData.length > 0) {
      columnTitles = Object.keys(this.tableData[0]);
    } else if (this.columnTitles.length) {
      columnTitles = this.columnTitles;
    } else {
      columnTitles = this.columnKeys;
    }

    if (this.tableData) {
      const translatedColumnTitles = this.getTranslatedColumnTitles(columnTitles, translations);
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.tableData, { header: this.columnKeys });
      const wst = XLSX.utils.sheet_add_aoa(ws, [translatedColumnTitles], { origin: 'A1' });
      const wb: XLSX.WorkBook = XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(wb, wst, 'Sheet1');
      XLSX.writeFile(wb, this.name);
    } else {
      alert('Error. Please try again');
    }
  }
}
