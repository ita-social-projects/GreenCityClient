import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from '../../../models/ubs-admin.interface';
import { TariffsService } from '../../../services/tariffs.service';
import { Services } from '../../../models/tariffs.interface';

@Component({
  selector: 'app-ubs-admin-tariffs-add-service-popup',
  templateUrl: './ubs-admin-tariffs-add-service-popup.component.html',
  styleUrls: ['./ubs-admin-tariffs-add-service-popup.component.scss']
})
export class UbsAdminTariffsAddServicePopupComponent implements OnInit {
  services: Services;
  addServiceForm: FormGroup;
  public icons = {
    close: './assets/img/icon/sign-in/close-btn.svg'
  };

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData, private fb: FormBuilder, private tariffsService: TariffsService) {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.addServiceForm = this.fb.group({
      name: new FormControl('', Validators.required),
      capacity: new FormControl('', Validators.required),
      price: new FormControl('', [Validators.required]),
      commission: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required])
    });
  }

  addNewService() {
    const { name, capacity, price, commission, description } = this.addServiceForm.value;
    this.services = {
      name,
      capacity,
      price,
      commission,
      description,
      languageId: 1
    };

    this.tariffsService.createNewService(this.services).subscribe((res) => {
      console.log(res);
    });
  }
}
