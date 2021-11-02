import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { UbsAdminEmployeeService } from 'src/app/ubs-admin/services/ubs-admin-employee.service';

@Component({
  selector: 'app-ubs-admin-employee-table',
  templateUrl: './ubs-admin-employee-table.component.html',
  styleUrls: ['./ubs-admin-employee-table.component.scss']
})
export class UbsAdminEmployeeTableComponent implements OnInit {
  currentPageForTable = 0;
  isUpdateTable = false;
  isLoading = true;
  sizeForTable = 15;
  displayedColumns: string[] = [];
  dataSource: MatTableDataSource<any>;
  arrayOfHeaders = [];
  totalPagesForTable: number;
  tableData: any[];

  constructor(private ubsAdminEmployeeService: UbsAdminEmployeeService) {}

  ngOnInit(): void {
    this.getTable();
  }

  getTable() {
    this.isLoading = true;
    this.ubsAdminEmployeeService.getEmployees(this.currentPageForTable, this.sizeForTable).subscribe((item) => {
      this.tableData = item[`page`];
      this.totalPagesForTable = item[`totalPages`];
      this.dataSource = new MatTableDataSource(this.tableData);
      this.setDisplayedColumns();
      this.isLoading = false;
      this.isUpdateTable = false;
    });
  }

  setDisplayedColumns() {
    this.displayedColumns = ['fullName', 'position', 'location', 'email', 'phoneNumber'];
  }

  updateTable() {
    this.isUpdateTable = true;
    this.ubsAdminEmployeeService.getEmployees(this.currentPageForTable, this.sizeForTable).subscribe((item) => {
      this.tableData.push(...item[`page`]);
      this.dataSource.data = this.tableData;
      this.isUpdateTable = false;
    });
  }

  onScroll() {
    if (!this.isUpdateTable && this.currentPageForTable < this.totalPagesForTable - 1) {
      this.currentPageForTable++;
      this.updateTable();
    }
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
