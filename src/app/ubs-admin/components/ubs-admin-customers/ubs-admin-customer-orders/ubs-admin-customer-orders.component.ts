import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Component,
  OnInit,
  HostListener,
  Renderer2,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
  AfterViewChecked,
  OnDestroy
} from '@angular/core';
import { columnsParamsOrders } from './../columnsParams';
import { AdminCustomersService } from 'src/app/ubs-admin/services/admin-customers.service';
import { ICustomerOrdersTable } from './../../../models/customer-orders-table.model';
import { LocalStorageService } from './../../../../main/service/localstorage/local-storage.service';

@Component({
  selector: 'app-ubs-admin-customer-orders',
  templateUrl: './ubs-admin-customer-orders.component.html',
  styleUrls: ['./ubs-admin-customer-orders.component.scss']
})
export class UbsAdminCustomerOrdersComponent implements OnInit, AfterViewChecked, OnDestroy {
  private id: string;
  private destroy$: Subject<boolean> = new Subject<boolean>();
  private pressed = false;
  private currentResizeIndex: number;
  private startX: number;
  private startWidth: number;
  private isResizingRight: boolean;
  private resizableMousemove: () => void;
  private resizableMouseup: () => void;
  private sortingColumn: string;
  private sortingType: string;
  private page = 0;

  public columns = [];
  public displayedColumns: string[] = [];
  public dataSource: MatTableDataSource<any>;
  public currentLang: string;
  public arrowDirection: string;
  public userName: string;
  public orders = [];
  public isLoading = true;
  public isCanScroll = false;
  public isTableLoading = false;

  @ViewChild(MatTable, { read: ElementRef }) private matTableRef: ElementRef;

  constructor(
    private renderer: Renderer2,
    private route: ActivatedRoute,
    private router: Router,
    private adminCustomerService: AdminCustomersService,
    private localStorageService: LocalStorageService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.localStorageService.languageBehaviourSubject.pipe(takeUntil(this.destroy$)).subscribe((lang) => {
      this.currentLang = lang;
    });
    this.getOrders();
    this.columns = columnsParamsOrders;
    this.setDisplayedColumns();
  }

  ngAfterViewChecked() {
    if (!this.isLoading) {
      this.setTableResize(this.matTableRef.nativeElement.clientWidth);
      this.cdr.detectChanges();
    }
  }

  private getOrders() {
    this.route.params.subscribe((params) => {
      this.id = params.id;
      this.adminCustomerService
        .getCustomerOrders(this.id, this.page, this.sortingColumn || 'id', this.sortingType || 'ASC')
        .pipe(takeUntil(this.destroy$))
        .subscribe((orders: ICustomerOrdersTable) => {
          this.userName = orders.username;
          this.orders = orders.userOrdersList;
          this.isLoading = false;
          this.dataSource = new MatTableDataSource(this.orders);
          this.page = ++this.page;
          this.checkAmountOrders(orders.userOrdersList);
        });
    });
  }

  private checkAmountOrders(orders) {
    if (this.page < 2 && orders.length === 10) {
      this.isCanScroll = true;
      this.updateOrders();
    }
  }

  public onScroll() {
    this.updateOrders();
  }

  private updateOrders() {
    this.isTableLoading = true;
    this.adminCustomerService
      .getCustomerOrders(this.id, this.page, this.sortingColumn || 'id', this.sortingType || 'ASC')
      .pipe(takeUntil(this.destroy$))
      .subscribe((orders: ICustomerOrdersTable) => {
        this.userName = orders.username;
        this.orders = [...this.orders, ...orders.userOrdersList];
        this.dataSource = new MatTableDataSource(this.orders);
        this.page = ++this.page;
        this.isTableLoading = false;
      });
  }

  public onSortTable(column: string, sortingType: string) {
    this.sortingColumn = column;
    this.sortingType = sortingType;
    this.arrowDirection = column === this.arrowDirection ? null : column;
    this.getOrders();
  }

  public goBack(): void {
    this.router.navigate(['ubs-admin', 'customers']);
  }

  private setDisplayedColumns() {
    this.columns.forEach((column, index) => {
      column.index = index;
      this.displayedColumns[index] = column.title.key;
    });
  }

  public openOrder(id: number): void {
    this.router.navigate([]).then((result) => {
      window.open(`/#/ubs-admin/order/${id}`, '_blank');
    });
  }

  //////////// resize logic
  public onResizeColumn(event: any, index: number) {
    this.checkResizing(event, index);
    this.currentResizeIndex = index;
    this.pressed = true;
    this.startX = event.pageX;
    this.startWidth = event.target.clientWidth;
    event.preventDefault();
    this.mouseMove(index);
  }

  private setTableResize(tableWidth: number) {
    let totWidth = 0;
    this.columns.forEach((column) => {
      totWidth += column.width;
    });
    const scale = (tableWidth - 5) / totWidth;
    this.columns.forEach((column) => {
      column.width *= scale;
      this.setColumnWidth(column);
    });
  }

  private checkResizing(event: any, index: any) {
    const cellData = this.getCellData(index);
    if (index === 0 || (Math.abs(event.pageX - cellData.right) < cellData.width / 2 && index !== this.columns.length - 1)) {
      this.isResizingRight = true;
    } else {
      this.isResizingRight = false;
    }
  }

  private getCellData(index: number) {
    const headerRow = this.matTableRef.nativeElement.children[0];
    const cell = headerRow.children[index];
    return cell.getBoundingClientRect();
  }

  private mouseMove(index: number) {
    this.resizableMousemove = this.renderer.listen('document', 'mousemove', (event) => {
      if (this.pressed && event.buttons) {
        const dx = this.isResizingRight ? event.pageX - this.startX : -event.pageX + this.startX;
        const width = this.startWidth + dx;
        if (this.currentResizeIndex === index && width > 100) {
          this.setColumnWidthChanges(index, width);
        }
      }
    });
    this.resizableMouseup = this.renderer.listen('document', 'mouseup', (event) => {
      if (this.pressed) {
        this.pressed = false;
        this.currentResizeIndex = -1;
        this.resizableMousemove();
        this.resizableMouseup();
      }
    });
  }

  private setColumnWidthChanges(index: number, width: number) {
    const orgWidth = this.columns[index].width;
    const dx = width - orgWidth;
    if (dx !== 0) {
      const j = this.isResizingRight ? index + 1 : index - 1;
      const newWidth = this.columns[j].width - dx;
      if (newWidth > 50) {
        this.columns[index].width = width;
        this.setColumnWidth(this.columns[index]);
        this.columns[j].width = newWidth;
        this.setColumnWidth(this.columns[j]);
      }
    }
  }

  private setColumnWidth(column: any) {
    const columnEls = Array.from(document.getElementsByClassName('mat-column-' + column.title.key));
    columnEls.forEach((el: any) => {
      el.style.width = column.width + 'px';
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.setTableResize(this.matTableRef.nativeElement.clientWidth);
  }

  ngOnDestroy() {
    this.destroy$.unsubscribe();
  }
}
