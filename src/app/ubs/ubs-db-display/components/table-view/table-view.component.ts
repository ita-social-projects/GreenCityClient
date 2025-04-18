import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { TableDataResponse } from '@ubs/ubs-db-display/models/table.model';
import { TableService } from '@ubs/ubs-db-display/services/table.service';

@Component({
  selector: 'app-table-view',
  templateUrl: './table-view.component.html',
  styleUrls: ['./table-view.component.scss']
})
export class TableViewComponent implements OnChanges {
  @Input() tableName: string | null = null;
  tableDataResponse: TableDataResponse | null = null;
  isLoading = false;

  constructor(private readonly tableService: TableService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.tableName && this.tableName) {
      console.log('get data from table: ', this.tableName);
      this.isLoading = true;

      this.tableService.getTableData(this.tableName).subscribe({
        next: (res: TableDataResponse) => {
          this.tableDataResponse = res;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Failed to load table data:', err);
          this.tableDataResponse = { tableName: this.tableName, tableData: [] };
          this.isLoading = false;
        }
      });
    }
  }
}
