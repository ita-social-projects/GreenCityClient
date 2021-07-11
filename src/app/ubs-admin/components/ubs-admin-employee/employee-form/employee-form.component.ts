import { Component, OnInit, Inject, Input } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { UbsAdminEmployeeService } from '../../../services/ubs-admin-employee.service';
import { Validators } from '@angular/forms';


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
  uploaded = false;
  employeeForm: FormGroup;
  positionsArr = [];
  ngOnInit() {
    this.employeeService.getAllPositions().subscribe({
      next: (data) => {
        this.roles = data;
      },
      error: (err: Error) => console.error('Observer for role got an error: ' + err)
    });
    this.employeeService.getAllStantions().subscribe({
      next: (locations) => {
        this.locations = locations;
      },
      error: (err: Error) => console.error('Observer for stations got an error: ' + err)
    });
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
  get stationControls(){
    return this.employeeForm.get('receivingStations') as FormArray;
  }
  
  onCheckChangeRole(data) {
    this.employeeControls.value.push(new FormControl(data));
  }
  onCheckChangeLocation(data) {
    this.stationControls.value.push(new FormControl(data));
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
    const formData: any = new FormData();
    const addEmployeeDto = new Blob([JSON.stringify(this.employeeForm.value)], { type: 'application/json' });
    formData.append('addEmployeeDto', addEmployeeDto);
    formData.append('image', this.selectedFile);
    this.employeeService.postEmployee(formData).subscribe((res) => console.log(res));
  }
}
