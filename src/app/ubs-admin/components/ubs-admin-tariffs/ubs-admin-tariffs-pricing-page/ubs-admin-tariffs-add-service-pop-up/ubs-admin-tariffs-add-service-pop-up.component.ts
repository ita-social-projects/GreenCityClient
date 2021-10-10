import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TariffsService } from '../../../../services/tariffs.service';
import { Bag, Service } from '../../../../models/tariffs.interface';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-ubs-admin-tariffs-add-service-pop-up',
  templateUrl: './ubs-admin-tariffs-add-service-pop-up.component.html',
  styleUrls: ['./ubs-admin-tariffs-add-service-pop-up.component.scss']
})
export class UbsAdminTariffsAddServicePopUpComponent implements OnInit, OnDestroy {
  tariffService: Bag;
  service: Service;
  date: string;
  user: string;
  langCode: string;
  receivedData;
  loadingAnim: boolean;
  namePattern = /^[А-Яа-яЯїЇіІєЄёЁ ]+$/;
  addServiceForm: FormGroup;
  private destroy: Subject<boolean> = new Subject<boolean>();
  public icons = {
    close: './assets/img/icon/sign-in/close-btn.svg'
  };
  price: 0;
  commission: 0;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    private fb: FormBuilder,
    private tariffsService: TariffsService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<UbsAdminTariffsAddServicePopUpComponent>
  ) {
    this.receivedData = data;
  }

  ngOnInit(): void {
    this.initForm();
    this.fillFields(this.receivedData);
  }

  private initForm() {
    this.receivedData.serviceData ? this.updateForm() : this.addForm();
  }

  addForm(): void {
    this.addServiceForm = this.fb.group({
      name: new FormControl('', [Validators.required, Validators.pattern(this.namePattern)]),
      capacity: new FormControl('', [Validators.required, Validators.pattern('[0-9]{1,3}')]),
      price: new FormControl('', [Validators.required, Validators.pattern('[0-9]{1,3}')]),
      commission: new FormControl('', [Validators.required, Validators.pattern('[0-9]{1,3}')]),
      description: new FormControl('', [Validators.required])
    });
  }

  updateForm(): void {
    this.addServiceForm = this.fb.group({
      name: new FormControl({ value: this.receivedData.serviceData.name, disabled: true }),
      capacity: new FormControl({ value: this.receivedData.serviceData.capacity, disabled: true }),
      price: new FormControl('', [Validators.required, Validators.pattern('[0-9]{1,3}')]),
      commission: new FormControl('', [Validators.required, Validators.pattern('[0-9]{1,3}')]),
      description: new FormControl({ value: this.receivedData.serviceData.description, disabled: true })
    });
  }

  addNewService() {
    const locationId = this.receivedData.locationId;
    const { name, capacity, price, commission, description } = this.addServiceForm.value;
    this.service = {
      name,
      capacity,
      price,
      commission,
      description,
      languageCode: 'ua',
      locationId
    };
    this.loadingAnim = true;
    this.tariffsService
      .createService(this.service)
      .pipe(takeUntil(this.destroy))
      .subscribe(() => {
        this.loadingAnim = false;
        this.dialogRef.close({});
      });
  }

  fillFields(receivedData) {
    if (this.receivedData.serviceData) {
      const { name, price, capacity, commission, description } = this.receivedData.serviceData;
      this.addServiceForm.patchValue({
        name,
        price,
        capacity,
        commission,
        description
      });
    }
  }

  editService(receivedData) {
    const locationId = receivedData.serviceData.locationId;
    const { name, price, capacity, commission, description } = this.addServiceForm.getRawValue();
    this.service = {
      name,
      capacity,
      price,
      commission,
      description,
      languageCode: 'ua',
      locationId
    };
    this.loadingAnim = true;
    this.tariffsService
      .editService(receivedData.serviceData.id, this.service)
      .pipe(takeUntil(this.destroy))
      .subscribe(() => {
        this.loadingAnim = false;
        this.dialogRef.close({});
      });
  }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.unsubscribe();
  }
}
