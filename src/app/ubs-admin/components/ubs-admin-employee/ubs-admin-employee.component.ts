import { UbsAdminEmployeeService } from './../../services/ubs-admin-employee.service';
import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EmployeeFormComponent } from './employee-form/employee-form.component';
@Component({
  selector: 'app-ubs-admin-employee',
  templateUrl: './ubs-admin-employee.component.html',
  styleUrls: ['./ubs-admin-employee.component.scss']
})
export class UbsAdminEmployeeComponent implements OnInit {
  fakeData: string[] = [];
  destroy: Subject<boolean> = new Subject<boolean>();
  totalLength: number;
  currentPage = 1;
  paginPage: number;
  size = 5;
  paginationId = 'employee';

  constructor(
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private ubsAdminEmployeeService: UbsAdminEmployeeService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.paginPage = params.page - 1;
    });
    this.getEmployees(this.paginPage, this.size);
  }

  getEmployees(currentPage: number, size: number) {
    this.ubsAdminEmployeeService
      .getEmployees(currentPage, size)
      .pipe(takeUntil(this.destroy))
      .subscribe((item) => this.setData(item));
  }

  setData(item) {
    this.fakeData = item.page;
    this.totalLength = item.totalElements;
  }

  changeCurrentPage(page: number): void {
    this.currentPage = page;
    this.paginPage = this.currentPage - 1;
    this.getEmployees(this.paginPage, this.size);
    this.location.go(`/ubs-admin/employee/${this.currentPage}`);
  }
  openDialog() {
    const dialogRef = this.dialog.open(EmployeeFormComponent, {
      panelClass: 'custom-modalbox'
    });
  }
}
