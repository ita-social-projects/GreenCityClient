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
  sizeForTable = 30;
  displayedColumns: string[] = [];
  dataSource: MatTableDataSource<any>;
  arrayOfHeaders = [];
  totalPagesForTable: number;
  tableData: any[];
  isStationsOpen = false;
  isPositionsOpen = false;
  allPositions: any[] = [];
  allStations: any[] = [];
  selectedStations: string[] = [];
  selectedPositions: string[] = [];
  filteredTableData: any[] = [];

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

  openPositions() {
    this.isPositionsOpen = !this.isPositionsOpen;
    this.isStationsOpen = false;
    if (this.allPositions.length === 0) {
      this.ubsAdminEmployeeService.getAllPositions().subscribe((pos) => {
        this.allPositions = pos;
        console.log(this.allPositions);
      });
    }
    if (this.isPositionsOpen === false) {
      this.selectedPositions = [];
    }
  }

  getPositionId(e: any, id: string) {
    if (e.target.checked) {
      this.selectedPositions.push(id);
      this.positionsFilter();
    } else {
      this.selectedPositions = this.selectedPositions.filter((m) => m !== id);
      this.positionsFilter();
    }
  }

  positionsFilter() {
    if (this.selectedPositions.length !== 0) {
      this.onPositionSelected();
    } else if (this.selectedStations.length === 0 && this.selectedPositions.length === 0) {
      this.dataSource.data = this.tableData;
    }
  }

  onPositionSelected() {
    this.filteredTableData = this.tableData.filter((user) => {
      return user.employeePositions.some((position) => {
        return this.selectedPositions.some((ids) => position.id === ids);
      });
    });
    this.dataSource.data = this.filteredTableData;
  }

  getStationId(e: any, id: string) {
    if (e.target.checked) {
      this.selectedStations.push(id);
      this.stationsFilter();
    } else {
      this.selectedStations = this.selectedStations.filter((m) => m !== id);
      this.stationsFilter();
    }
  }

  stationsFilter() {
    if (this.selectedStations.length !== 0) {
      this.onStationSelected();
    } else if (this.selectedPositions.length === 0 && this.selectedStations.length === 0) {
      this.dataSource.data = this.tableData;
    }
  }

  onStationSelected() {
    this.filteredTableData = this.tableData.filter((user) => {
      return user.receivingStations.some((station) => {
        return this.selectedStations.some((ids) => station.id === ids);
      });
    });
    this.dataSource.data = this.filteredTableData;
  }

  openStations() {
    this.isStationsOpen = !this.isStationsOpen;
    this.isPositionsOpen = false;
    if (this.allStations.length === 0) {
      this.ubsAdminEmployeeService.getAllStations().subscribe((stations) => {
        this.allStations = stations;
      });
    }
    if (this.isStationsOpen === false) {
      this.selectedStations = [];
    }
  }
}
