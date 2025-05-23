import { Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { TableDataResponse } from '@ubs/ubs-db-display/models/table.model';
import { TableService } from '@ubs/ubs-db-display/services/table.service';
import { catchError, finalize, Subject, takeUntil, throwError } from 'rxjs';

@Component({
  selector: 'app-table-view',
  templateUrl: './table-view.component.html',
  styleUrls: ['./table-view.component.scss']
})
export class TableViewComponent implements OnChanges, OnDestroy {
  @Input() tableName: string | null = null;
  tableDataResponse: TableDataResponse | null = null;
  isLoading = false;
  pageLimit = 50;
  private readonly destroy = new Subject<void>();

  constructor(private readonly tableService: TableService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.tableName && this.tableName) {
      this.resetAndLoadFirstPage();
    }
  }

  private resetAndLoadFirstPage() {
    this.tableDataResponse = {
      tableName: this.tableName,
      currentPage: 0,
      first: true,
      hasNext: false,
      hasPrevious: false,
      last: false,
      number: 0,
      page: [],
      totalElements: 0,
      totalPages: 0
    };
    this.loadPage(0);
  }

  private loadPage(pageIndex: number) {
    this.isLoading = true;

    this.tableService
      .getTableData(this.tableName, pageIndex, this.pageLimit)
      .pipe(
        takeUntil(this.destroy),
        catchError((error) => {
          console.error('Error loading table data:', error);
          return throwError(() => error);
        }),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((res: TableDataResponse) => {
        this.tableDataResponse = {
          ...res,
          page: [...this.tableDataResponse.page, ...res.page]
        };
      });
  }

  onScroll() {
    if (!this.isLoading && this.tableDataResponse.hasNext) {
      this.loadPage(this.tableDataResponse.currentPage + 1);
    }
  }
  ngOnDestroy() {
    this.destroy.next();
    this.destroy.complete();
  }
}
