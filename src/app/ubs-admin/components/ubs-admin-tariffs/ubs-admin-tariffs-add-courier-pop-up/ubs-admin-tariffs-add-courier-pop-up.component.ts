import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-ubs-admin-tariffs-add-courier-pop-up',
  templateUrl: './ubs-admin-tariffs-add-courier-pop-up.component.html',
  styleUrls: ['./ubs-admin-tariffs-add-courier-pop-up.component.scss']
})
export class UbsAdminTariffsAddCourierPopUpComponent implements OnInit {
  courierForm: FormGroup;
  constructor(private fb: FormBuilder, public dialogRef: MatDialogRef<UbsAdminTariffsAddCourierPopUpComponent>) {}

  ngOnInit(): void {
    this.courierForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(40)]]
    });
  }

  onNoClick() {
    this.dialogRef.close();
  }
}
