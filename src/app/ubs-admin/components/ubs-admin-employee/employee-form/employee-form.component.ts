import { Component, OnInit, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UbsAdminEmployeeService } from '../../../services/ubs-admin-employee.service';

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
  positionsArr = [];

  ngOnInit() {
    this.employeeService.getAllPositions().subscribe(
      (data) => {
        this.roles = data;
      },
      (error) => console.error('Observer for role got an error: ' + error)
    );
    this.employeeService.getAllStations().subscribe(
      (data) => {
        this.locations = data;
        console.log(this.locations);
      },
      (error) => console.error('Observer for stations got an error: ' + error)
    );
  }

  constructor(private employeeService: UbsAdminEmployeeService, public fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public data) {
    this.employeeForm = this.fb.group({
      image: [this.data.image],
      firstName: [this.data.firstName, Validators.required],
      lastName: [this.data.lastName, Validators.required],
      phoneNumber: [this.data.phoneNumber, Validators.required],
      email: [this.data.email],
      employeePositions: this.fb.array([], Validators.required),
      receivingStations: this.fb.array([], Validators.required)
    });
  }

  get employeeControls() {
    return this.employeeForm.get('employeePositions') as FormArray;
  }

  get stationControls() {
    return this.employeeForm.get('receivingStations') as FormArray;
  }

  onCheckChangeRole(data) {
    this.employeeControls.value.push(new FormControl(data));
  }

  onCheckChangeLocation(data) {
    if (this.doesIncludeLocation(data)) {
      return;
    }
    this.stationControls.value.push(new FormControl(data));
    console.log(this.stationControls);
  }

  doesIncludeLocation(location): boolean {
    return this.stationControls.value.some((station) => location.id === station.value.id);
  }

  submit() {
    const formData: any = new FormData();
    const addEmployeeDto = new Blob([JSON.stringify(this.employeeForm.value)], { type: 'application/json' });
    formData.append('addEmployeeDto', addEmployeeDto);
    this.employeeService.postEmployee(formData).subscribe(console.log);
  }
}
