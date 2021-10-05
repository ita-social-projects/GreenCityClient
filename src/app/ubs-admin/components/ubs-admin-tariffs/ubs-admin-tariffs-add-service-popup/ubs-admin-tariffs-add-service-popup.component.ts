import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { DialogData } from '../../../models/ubs-admin.interface';
import { TariffsService } from '../../../services/tariffs.service';
import { Bag } from '../../../models/tariffs.interface';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-ubs-admin-tariffs-add-service-popup',
  templateUrl: './ubs-admin-tariffs-add-service-popup.component.html',
  styleUrls: ['./ubs-admin-tariffs-add-service-popup.component.scss']
})
export class UbsAdminTariffsAddServicePopupComponent implements OnInit, OnDestroy {
  service: Bag;
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

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: FormBuilder,
    private tariffsService: TariffsService,
    public dialog: MatDialog
  ) {
    this.receivedData = data;
  }

  ngOnInit(): void {
    this.initForm();
    this.fillFields(this.receivedData);
    this.showInfo(this.receivedData);
  }

  private initForm(): void {
    this.addServiceForm = this.fb.group({
      name: new FormControl('', [Validators.required, Validators.pattern(this.namePattern)]),
      capacity: new FormControl('', [Validators.required, Validators.pattern('[0-9]{1,3}')]),
      price: new FormControl('', [Validators.required, Validators.pattern('[0-9]{1,3}')]),
      commission: new FormControl('', [Validators.required, Validators.pattern('[0-9]{1,3}')]),
      description: new FormControl('', [Validators.required])
    });
  }

  addNewService() {
    const { name, capacity, price, commission, description } = this.addServiceForm.value;
    this.service = {
      name,
      capacity,
      price,
      commission,
      description,
      languageId: 1
    };
    this.loadingAnim = true;
    this.tariffsService
      .createNewService(this.service)
      .pipe(takeUntil(this.destroy))
      .subscribe(() => {
        this.loadingAnim = false;
        this.dialog.closeAll();
      });
  }

  fillFields(receivedData) {
    if (this.data.button === 'update') {
      this.addServiceForm.controls['name'.toString()].setValue(receivedData.bagData.name);
      this.addServiceForm.controls['capacity'.toString()].setValue(receivedData.bagData.capacity);
      this.addServiceForm.controls['price'.toString()].setValue(receivedData.bagData.price);
      this.addServiceForm.controls['commission'.toString()].setValue(receivedData.bagData.commission);
      this.addServiceForm.controls['description'.toString()].setValue(receivedData.bagData.description);
    }
  }

  editService(receivedData) {
    const langCode = receivedData.bagData.languageCode;
    const { name, capacity, price, commission, description } = this.addServiceForm.value;
    this.service = {
      name,
      capacity,
      price,
      commission,
      description,
      langCode
    };
    this.loadingAnim = true;
    this.tariffsService
      .editService(receivedData.bagData.id, this.service)
      .pipe(takeUntil(this.destroy))
      .subscribe(() => {
        this.loadingAnim = false;
        this.dialog.closeAll();
      });
  }

  showInfo(receivedData) {
    if (this.data.button === 'update') {
      this.date = receivedData.bagData.createdAt;
      this.user = receivedData.bagData.createdBy;
    }
  }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.unsubscribe();
  }
}
