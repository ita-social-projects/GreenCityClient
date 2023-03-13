import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { columnsParamsViolations } from '../../columnsParams';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { Subject } from 'rxjs';
import { AdminCustomersService } from 'src/app/ubs/ubs-admin/services/admin-customers.service';
import { AddViolationsComponent } from '../../../add-violations/add-violations.component';

@Component({
  selector: 'app-ubs-admin-customer-violations',
  templateUrl: './ubs-admin-customer-violations.component.html',
  styleUrls: ['./ubs-admin-customer-violations.component.scss']
})
export class UbsAdminCustomerViolationsComponent implements OnInit, OnDestroy {
  private destroy$: Subject<boolean> = new Subject<boolean>();
  private id: string;
  private sortingColumn: string;
  private sortingType: string;
  private page = 0;
  private totalElements: number;

  public currentLang: string;
  public username: string;
  public violationsList: any[];
  public columns = [];
  public displayedColumns: string[] = [];
  public dataSource: MatTableDataSource<any>;
  public isLoading = true;
  public switchViewButton: number | null;
  public arrowDirection: string;
  public isCanScroll = false;

  constructor(
    private localStorageService: LocalStorageService,
    private route: ActivatedRoute,
    private adminCustomerService: AdminCustomersService,
    private router: Router,
    private dialog: MatDialog
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
        .getCustomerViolations(this.id, this.page, this.sortingColumn || 'orderId', this.sortingType || 'ASC')
        .pipe(takeUntil(this.destroy$))
        .subscribe((violations) => {
          this.username = violations.fullName;
          this.violationsList = violations.userViolationsDto.page;
          this.dataSource = new MatTableDataSource(this.violationsList);
          this.isLoading = false;
          this.totalElements = violations.userViolationsDto.totalElements;
          this.checkAmountViolations();
        });
    });
  }

  private checkAmountViolations() {
    if (this.totalElements > 10) {
      this.page += 1;
      this.isCanScroll = true;
      this.updateViolations();
    }
  }

  private updateViolations() {
    this.adminCustomerService
      .getCustomerViolations(this.id, this.page, this.sortingColumn || 'orderId', this.sortingType || 'ASC')
      .pipe(takeUntil(this.destroy$))
      .subscribe((violations) => {
        this.violationsList = [...this.violationsList, ...violations.userViolationsDto.page];
        this.dataSource = new MatTableDataSource(this.violationsList);
        this.isLoading = false;
        this.page += 1;
      });
  }

  public onScroll() {
    this.updateViolations();
  }

  private setDisplayedColumns() {
    this.columns.forEach((column, index) => {
      column.index = index;
      this.displayedColumns[index] = column.title.key;
    });
  }

  public onSortTable(column: string, sortingType: string) {
    this.sortingColumn = column;
    this.sortingType = sortingType;
    this.arrowDirection = column === this.arrowDirection ? null : column;
    this.getViolations();
  }

  public goBack(): void {
    this.router.navigate(['ubs-admin', 'customers']);
  }

  public openOrder(id: number): void {
    this.router.navigate([]).then((result) => {
      window.open(`/GreenCityClient/#/ubs-admin/order/${id}`, '_blank');
    });
  }

  openModal(user): void {
    this.dialog.open(AddViolationsComponent, {
      hasBackdrop: true,
      closeOnNavigation: true,
      disableClose: true,
      panelClass: 'admin-cabinet-dialog-container',
      data: {
        id: user.orderId,
        viewMode: true
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }
}
