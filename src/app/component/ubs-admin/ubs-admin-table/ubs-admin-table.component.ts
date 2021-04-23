
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
  'дата замовлення': number;
  'ім"я замовника': string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  
  {'замовлення': 1, 'статус замовлення': 'Hydrogen', 'дата замовлення': 1.0079, 'ім"я замовника': 'H'},
  {'замовлення': 2, 'статус замовлення': 'Helium', 'дата замовлення': 4.0026, 'ім"я замовника': 'He'},
  {'замовлення': 3, 'статус замовлення': 'Lithium', 'дата замовлення': 6.941, 'ім"я замовника': 'Li'},
  {'замовлення': 4, 'статус замовлення': 'Beryllium', 'дата замовлення': 9.0122, 'ім"я замовника': 'Be'},
  {'замовлення': 5, 'статус замовлення': 'Boron', 'дата замовлення': 10.811, 'ім"я замовника': 'B'},
  {'замовлення': 6, 'статус замовлення': 'Carbon', 'дата замовлення': 12.0107, 'ім"я замовника': 'C'},
  {'замовлення': 7, 'статус замовлення': 'Nitrogen', 'дата замовлення': 14.0067, 'ім"я замовника': 'N'},
  {'замовлення': 8, 'статус замовлення': 'Oxygen', 'дата замовлення': 15.9994, 'ім"я замовника': 'O'},
  {'замовлення': 9, 'статус замовлення': 'Fluorine', 'дата замовлення': 18.9984, 'ім"я замовника': 'F'},
  {'замовлення': 10, 'статус замовлення': 'Neon', 'дата замовлення': 20.1797, 'ім"я замовника': 'Ne'},
];


@Component({
  selector: 'app-ubs-admin-table',
  templateUrl: './ubs-admin-table.component.html',
  styleUrls: ['./ubs-admin-table.component.scss']
})
export class UbsAdminTableComponent implements OnInit {
 
  sortt: boolean = false; 

  columns: any[] = [
    { field: 'select', sort: false, sticky: true},
    { field: 'замовлення', sort: false, sticky: true },
    { field: 'статус замовлення', sort: true, sticky: true },
    { field: 'дата замовлення', sort: false, sticky: false },
    { field: 'ім"я замовника', sort: true, sticky: false },
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

  showTable(): void {
    console.log("Yes")
  }

  change(i:number) {
    console.log("No" + i)
    }

}
