import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
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
  filePath: string;
  uploaded: boolean = false;
  employeeForm: FormGroup;
  constructor(public fb: FormBuilder) {
    this.employeeForm = this.fb.group({
      img: [null],
      filename: ['']
    });
  }
  ngOnInit() {}
  imagePreview(e) {
    const file = (e.target as HTMLInputElement).files[0];
    this.employeeForm.patchValue({
      img: file
    });
    this.employeeForm.get('img').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.filePath = reader.result as string;
    };
    reader.readAsDataURL(file);
    this.uploaded = true;
  }
}
