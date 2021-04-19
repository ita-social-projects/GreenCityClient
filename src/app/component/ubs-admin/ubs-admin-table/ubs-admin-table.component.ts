
import { CdkDragStart, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';
import { CheckboxComponent } from 'angular-bootstrap-md';
import 'hammerjs';

export interface PeriodicElement {
  'статус замовлення': string;
  'замовлення': number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  
  {'замовлення': 1, 'статус замовлення': 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {'замовлення': 2, 'статус замовлення': 'Helium', weight: 4.0026, symbol: 'He'},
  {'замовлення': 3, 'статус замовлення': 'Lithium', weight: 6.941, symbol: 'Li'},
  {'замовлення': 4, 'статус замовлення': 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {'замовлення': 5, 'статус замовлення': 'Boron', weight: 10.811, symbol: 'B'},
  {'замовлення': 6, 'статус замовлення': 'Carbon', weight: 12.0107, symbol: 'C'},
  {'замовлення': 7, 'статус замовлення': 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {'замовлення': 8, 'статус замовлення': 'Oxygen', weight: 15.9994, symbol: 'O'},
  {'замовлення': 9, 'статус замовлення': 'Fluorine', weight: 18.9984, symbol: 'F'},
  {'замовлення': 10, 'статус замовлення': 'Neon', weight: 20.1797, symbol: 'Ne'},
];


@Component({
  selector: 'app-ubs-admin-table',
  templateUrl: './ubs-admin-table.component.html',
  styleUrls: ['./ubs-admin-table.component.scss']
})
export class UbsAdminTableComponent implements OnInit {
 
  sticky: boolean;
  visibile: boolean;

  columns: any[] = [
    { field: 'select', sticky: true, visibile: true},
    { field: 'замовлення' },
    { field: 'статус замовлення' },
    { field: 'weight' },
    { field: 'symbol' },
    ];

  displayedColumns: string[] = [];

  dataSource = new MatTableDataSource(ELEMENT_DATA);
  selection = new SelectionModel<PeriodicElement>(true, []);

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  previousIndex: number;

  

  constructor() { }

  ngOnInit() {
    this.setDisplayedColumns();
    this.dataSource.sort = this.sort;
    
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  setDisplayedColumns() {
    this.columns.forEach(( colunm, index) => {
      colunm.index = index;
      this.displayedColumns[index] = colunm.field;
    });
  }

  dragStarted(event: CdkDragStart, index: number ) {
    this.previousIndex = index;
  }

  dropListDropped(event: CdkDropList, index: number) {
    if (event) {
      moveItemInArray(this.columns, this.previousIndex, index);
      this.setDisplayedColumns();
    }
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
  }

  checkboxLabel(row?: PeriodicElement): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.замовлення + 1}`;
  }
}
