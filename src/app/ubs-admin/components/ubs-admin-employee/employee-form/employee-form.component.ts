import { Component, OnInit, Inject, Input } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { EmployeeService } from '../../../services/employee.service';
export interface Position {
  name: string;
}
@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.scss']
})
export class EmployeeFormComponent implements OnInit {
  @Input()
  locations;
  roles;
  selectedFile: File;
  filePath: string;
  uploaded: boolean = false;
  employeeForm: FormGroup;
  positionsArr = [];
  ngOnInit() {
    this.employeeService.getAllPositions().subscribe({
      next: (roles) => {
        this.roles = roles;
      }
    });
    this.employeeService.getAllStantions().subscribe({
      next: (locations) => {
        this.locations = locations;
      }
    });
  }
  constructor(private employeeService: EmployeeService, public fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public data) {
    this.employeeForm = this.fb.group({
      image: [this.data.image],
      firstName: [this.data.name],
      lastName: [this.data.surname],
      phoneNumber: [this.data.phoneNumber],
      email: [this.data.email],
      employeePositions: this.fb.array([]),
      receivingStations: this.fb.array([])
    });
    // this.addPosition();
  }
  // get positions(): FormArray {
  //   return this.employeeForm.get('employeePositions') as FormArray;
  // }

  //   onCheckChangeEmployee(role){
  //     this.positionsArr.push(role)
  //   console.log(this.positionsArr)
  // }

  // addPosition(){
  //   this.roles.forEach(() => this.positions.push(new FormControl(false)));
  // }
  // setPositions(){
  //   const selectedRoleId = this.employeeForm.value.employeePositions
  //     .map((checked, i) => checked ? this.roles[i].id : null)
  //     .filter(v => v !== null);
  //   console.log(selectedRoleId)
  // }
  onCheckChangeRole(data) {
    const formLocationArray: FormArray = this.employeeForm.get('employeePositions') as FormArray;
    formLocationArray.push(new FormControl(data));
  }
  onCheckChangeLocation(data) {
    const formLocationArray: FormArray = this.employeeForm.get('receivingStations') as FormArray;
    formLocationArray.push(new FormControl(data));
  }
  imagePreview(e) {
    this.selectedFile = (e.target as HTMLInputElement).files[0];
    this.employeeForm.patchValue({
      img: this.selectedFile
    });
    this.employeeForm.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.filePath = reader.result as string;
    };
    reader.readAsDataURL(this.selectedFile);
    this.uploaded = true;
  }
  submit() {
    // this.setPositions()
    console.log(this.employeeForm.value);
    this.employeeService.postEmployee(this.employeeForm.value).subscribe((res) => console.log(res));
  }
}
