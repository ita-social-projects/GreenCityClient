import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UbsAdminEmployeeService } from '../../../services/ubs-admin-employee.service';
import { MatDialogRef } from '@angular/material';
import { Page } from '../../../models/ubs-admin.interface';

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.scss']
})
export class EmployeeFormComponent implements OnInit {
  @Input()
  locations;
  roles;
  employeeForm: FormGroup;
  employeePositions;
  receivingStations;
  phoneMask = '{+38} (000) 00 000 00';

  ngOnInit() {
    this.employeeService.getAllPositions().subscribe(
      (roles) => {
        this.roles = roles;
      },
      (error) => console.error('Observer for role got an error: ' + error)
    );
    this.employeeService.getAllStations().subscribe(
      (locations) => {
        this.locations = locations;
      },
      (error) => console.error('Observer for stations got an error: ' + error)
    );
  }

  constructor(
    private employeeService: UbsAdminEmployeeService,
    public dialogRef: MatDialogRef<EmployeeFormComponent>,
    public fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: Page
  ) {
    this.employeeForm = this.fb.group({
      firstName: [this.data.firstName, Validators.required],
      lastName: [this.data.lastName, Validators.required],
      phoneNumber: [this.data.phoneNumber, Validators.required],
      email: [this.data.email]
    });
    this.employeePositions = this.data.employeePositions ?? [];
    this.receivingStations = this.data.receivingStations ?? [];
  }

  get isUpdatingEmployee() {
    return !(Object.keys(this.data).length === 0);
  }

  findRole(id: number): number {
    return this.employeePositions.findIndex((role) => {
      return role.id === id;
    });
  }

  onCheckChangeRole(role) {
    if (this.doesIncludeRole(role)) {
      const removeIndex = this.findRole(role.id);
      this.employeePositions.splice(removeIndex, 1);
      return;
    }
    this.employeePositions.push(role);
  }

  doesIncludeRole(role) {
    return this.employeePositions.some((existingRole) => existingRole.id === role.id);
  }

  findLocation(id: number): number {
    return this.receivingStations.findIndex((location) => {
      return location.id === id;
    });
  }

  onCheckChangeLocation(location) {
    if (this.doesIncludeLocation(location)) {
      const removeIndex = this.findLocation(location.id);
      this.receivingStations.splice(removeIndex, 1);
      return;
    }
    this.receivingStations.push(location);
  }

  doesIncludeLocation(location): boolean {
    return this.receivingStations.some((station) => location.id === station.id);
  }

  prepareEmployeeDataToSend(): FormData {
    const employeeDataToSend = {
      ...this.employeeForm.value,
      employeePositions: this.employeePositions,
      receivingStations: this.receivingStations
    };
    if (this.isUpdatingEmployee) {
      employeeDataToSend.id = this.data.id;
    }
    const stringifiedDataToSend = JSON.stringify(employeeDataToSend);
    const formData: FormData = new FormData();
    formData.append('addEmployeeDto', stringifiedDataToSend);
    return formData;
  }

  updateEmployee() {
    const dataToSend = this.prepareEmployeeDataToSend();
    this.employeeService.updateEmployee(dataToSend).subscribe(() => {
      this.dialogRef.close();
    });
  }

  createEmployee() {
    const dataToSend = this.prepareEmployeeDataToSend();
    this.employeeService.postEmployee(dataToSend).subscribe(() => {
      this.dialogRef.close();
    });
  }

  treatFileInput(event) {
    event.preventDefault();
    console.log(event);
  }

  cancelDefault(e) {
    e.preventDefault();
    console.log(e);
  }
}
