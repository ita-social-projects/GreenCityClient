import { MatTableDataSource } from '@angular/material/table';
import { columnsParamsViolations } from './../../columnsParams';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { AdminCustomersService } from 'src/app/ubs-admin/services/admin-customers.service';

@Component({
  selector: 'app-ubs-admin-customer-violations',
  templateUrl: './ubs-admin-customer-violations.component.html',
  styleUrls: ['./ubs-admin-customer-violations.component.scss']
})
export class UbsAdminCustomerViolationsComponent implements OnInit {
  private destroy$: Subject<boolean> = new Subject<boolean>();
  private id: string;

  public currentLang: string;
  public username: string;
  public violationsList: any[];
  public columns = [];
  public displayedColumns: string[] = [];
  public dataSource: MatTableDataSource<any>;
  public isLoading = true;

  constructor(
    private localStorageService: LocalStorageService,
    private route: ActivatedRoute,
    private adminCustomerService: AdminCustomersService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.localStorageService.languageBehaviourSubject.pipe(takeUntil(this.destroy$)).subscribe((lang) => {
      this.currentLang = lang;
    });
    this.columns = columnsParamsViolations;
    this.setDisplayedColumns();
    this.getViolations();
  }

  getViolations() {
    this.route.params.subscribe((params) => {
      this.id = params.id;
      this.adminCustomerService
        .getCustomerViolations(this.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe((violations) => {
          console.log(violations);
          this.username = violations.username;
          this.violationsList = violations.userViolationsList;
          this.dataSource = new MatTableDataSource(this.violationsList);
          this.isLoading = false;
        });
    });
  }

  private setDisplayedColumns() {
    this.columns.forEach((column, index) => {
      column.index = index;
      this.displayedColumns[index] = column.title.key;
    });
  }

  public goBack(): void {
    this.router.navigate(['ubs-admin', 'customers']);
  }

  public openOrder(id: number): void {
    this.router.navigate([]).then((result) => {
      window.open(`/#/ubs-admin/order/${id}`, '_blank');
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }
}
