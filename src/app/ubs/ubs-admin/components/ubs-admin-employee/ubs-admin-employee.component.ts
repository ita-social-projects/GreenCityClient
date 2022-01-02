import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';

import { GetEmployees } from 'src/app/store/actions/employee.actions';
import { Employees, Page } from '../../models/ubs-admin.interface';
import { IAppState } from 'src/app/store/state/app.state';
import { EmployeeFormComponent } from './employee-form/employee-form.component';

@Component({
  selector: 'app-ubs-admin-employee',
  templateUrl: './ubs-admin-employee.component.html',
  styleUrls: ['./ubs-admin-employee.component.scss']
})
export class UbsAdminEmployeeComponent implements OnInit {
  employeesData: Page[] = [];
  destroy: Subject<boolean> = new Subject<boolean>();
  totalLength: number;
  currentPage = 1;
  paginPage: number;
  size = 5;
  paginationId = 'employee';
  tiles: boolean;
  employees$ = this.store.select((state: IAppState): Employees => state.employees.employees);

  constructor(
    private activatedRoute: ActivatedRoute,
    private location: Location,
    public dialog: MatDialog,
    private store: Store<IAppState>
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.paginPage = params.page - 1;
      this.getEmployees();

      this.employees$.subscribe((item: Employees) => {
        if (item) {
          this.setData(item);
        }
      });
    });
    this.tiles = true;
  }

  getEmployees(): void {
    this.store.dispatch(GetEmployees({ pageNumber: this.paginPage, pageSize: this.size, reset: true }));
  }

  setData(item: Employees): void {
    this.employeesData = item.content;
    this.totalLength = item.totalElements;
  }

  changeCurrentPage(page: number): void {
    this.currentPage = page;
    this.paginPage = this.currentPage - 1;
    this.getEmployees();
    this.location.go(`/ubs-admin/employee/${this.currentPage}`);
  }

  openDialog() {
    this.dialog.open(EmployeeFormComponent, {
      hasBackdrop: true,
      closeOnNavigation: true,
      disableClose: true,
      panelClass: 'custom-dialog-container'
    });
  }

  openTable() {
    this.tiles = false;
  }

  openTiles() {
    this.tiles = true;
  }
}
