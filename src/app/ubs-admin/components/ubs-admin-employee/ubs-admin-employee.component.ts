import { UbsAdminEmployeeService } from './../../services/ubs-admin-employee.service';
import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-ubs-admin-employee',
  templateUrl: './ubs-admin-employee.component.html',
  styleUrls: ['./ubs-admin-employee.component.scss']
})
export class UbsAdminEmployeeComponent implements OnInit {
  fakeData = [];
  destroy: Subject<boolean> = new Subject<boolean>();
  totalLength = this.fakeData.length;
  currentPage = 1;
  paginationId = 'employee';
  changeCurrentPage(page: number): void {
    this.currentPage = page;
    this.location.go(`/ubs-admin/employee/${this.currentPage}`);
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private ubsAdminEmployeeService: UbsAdminEmployeeService
  ) {}

  ngOnInit(): void {
    this.getEmployees();
    this.activatedRoute.params.subscribe((params: Params) => {
      this.currentPage = params['page'];
    });
  }

  getEmployees() {
    this.ubsAdminEmployeeService
      .getEmployees()
      .pipe(takeUntil(this.destroy))
      .subscribe((item) => {
        this.fakeData = item;
      });
    console.log(this.fakeData);
  }
}
