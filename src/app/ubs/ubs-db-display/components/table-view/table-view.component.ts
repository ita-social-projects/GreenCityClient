import { Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { MatSnackBarService } from '@global-service/mat-snack-bar/mat-snack-bar.service';
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

  constructor(
    private readonly tableService: TableService,
    private readonly snackBar: MatSnackBarService
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.tableName && this.tableName) {
      this.loadPage(0);
    }
  }

  private loadPage(pageIndex: number) {
    this.isLoading = true;

    this.tableService
      .getTableData(this.tableName, pageIndex, this.pageLimit)
      .pipe(
        takeUntil(this.destroy),
        catchError((error) => {
          this.snackBar.openSnackBar('snack-bar.error.default');
          return throwError(() => error);
        }),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((res: TableDataResponse) => {
        this.tableDataResponse =
          pageIndex === 0
            ? res
            : {
                ...res,
                page: [...(this.tableDataResponse?.page ?? []), ...res.page]
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
