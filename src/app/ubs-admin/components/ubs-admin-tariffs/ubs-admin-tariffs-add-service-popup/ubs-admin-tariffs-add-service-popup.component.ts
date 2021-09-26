import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from '../../../models/ubs-admin.interface';

@Component({
  selector: 'app-ubs-admin-tariffs-add-service-popup',
  templateUrl: './ubs-admin-tariffs-add-service-popup.component.html',
  styleUrls: ['./ubs-admin-tariffs-add-service-popup.component.scss']
})
export class UbsAdminTariffsAddServicePopupComponent implements OnInit {
  addServiceForm: FormGroup;
  public icons = {
    close: './assets/img/icon/sign-in/close-btn.svg'
  };

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.addServiceForm = this.fb.group({
      serviceName: new FormControl('', Validators.required),
      capacity: new FormControl('', Validators.required),
      basicCost: new FormControl('', [Validators.required]),
      carriers_commission: new FormControl('', [Validators.required]),
      fullCost: new FormControl('', [Validators.required])
    });
  }
}
