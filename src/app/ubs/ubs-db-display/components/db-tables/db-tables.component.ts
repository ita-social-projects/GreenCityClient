import { Component, OnInit } from '@angular/core';
import { TablesResponse } from '@ubs/ubs-db-display/models/table.model';
import { TableService } from '@ubs/ubs-db-display/services/table.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-db-tables',
  templateUrl: './db-tables.component.html',
  styleUrls: ['./db-tables.component.scss']
})
export class DbTablesComponent implements OnInit {
  tableNames: string[];
  private readonly selectedTableSubject = new BehaviorSubject<string | null>(null);
  selectedTable$ = this.selectedTableSubject.asObservable();

  constructor(private readonly tableService: TableService) {}

  ngOnInit() {
    this.tableService.getTableNames().subscribe((res: TablesResponse) => {
      this.tableNames = Object.keys(res.tables);
    });
  }

  onTableSelected(name: string) {
    this.selectedTableSubject.next(name);
  }
}
