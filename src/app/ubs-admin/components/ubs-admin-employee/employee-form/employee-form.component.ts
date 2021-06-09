import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
export interface Position {
  name: string;
}
@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.scss']
})
export class EmployeeFormComponent implements OnInit {
  stantions: string[] = ['Саперно-Слобідська', 'Петрівка'];
  positions: string[] = ['Менеджер послуги', 'Менеджер обдзвону', 'Логіст', 'Штурман', 'Водій'];
  // positions: Position[] = [
  //   {name: 'Менеджер послуги'},
  //   {name: 'Менеджер обдзвону'},
  //   {name: 'Логіст'},
  //   {name: 'Штурман'},
  //   {name: 'Водій'}]
  // constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  ngOnInit() {}
}
