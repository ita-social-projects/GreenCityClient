import { Component, ElementRef } from '@angular/core';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-ubs-admin-table-excel-popup',
  templateUrl: './ubs-admin-table-excel-popup.component.html',
  styleUrls: ['./ubs-admin-table-excel-popup.component.scss']
})
export class UbsAdminTableExcelPopupComponent {
  tableData: any[];
  constructor() {}

  saveTable() {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.tableData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'SheetJS.xlsx');

    const opts = {
      suggestedName: 'admin-table.xls',
      types: [
        {
          description: 'Excel file',
          accept: { 'application/vnd.ms-excel': ['.xls'] }
        }
      ]
    };

    // @ts-ignore
    window.showSaveFilePicker(opts);
  }
}
