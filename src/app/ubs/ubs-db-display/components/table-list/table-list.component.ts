import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-table-list',
  templateUrl: './table-list.component.html',
  styleUrls: ['./table-list.component.scss']
})
export class TableListComponent {
  @Input() tables: string[] = [];
  @Output() selectTable = new EventEmitter<string>();

  searchTerm = '';
  selectedTable: string | null = null;

  get filteredTables(): string[] {
    return this.tables.filter((table) => table.toLowerCase().includes(this.searchTerm.toLowerCase()));
  }

  onSelect(table: string): void {
    this.selectedTable = table;
    this.selectTable.emit(table);
  }
}
