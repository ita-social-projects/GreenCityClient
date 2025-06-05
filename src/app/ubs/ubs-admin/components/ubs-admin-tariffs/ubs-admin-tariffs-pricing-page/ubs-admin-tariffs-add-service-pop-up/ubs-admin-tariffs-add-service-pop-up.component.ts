import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TariffsService } from '../../../../services/tariffs.service';
import { Service } from '../../../../models/tariffs.interface';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { LocalStorageService } from 'src/app/shared/services/localstorage/local-storage.service';
import { ModalTextComponent } from '../../../shared/components/modal-text/modal-text.component';
import { Patterns } from 'src/assets/patterns/patterns';
import { LanguageService } from 'src/app/shared/i18n/language.service';

@Component({
  selector: 'app-ubs-admin-tariffs-add-service-pop-up',
  templateUrl: './ubs-admin-tariffs-add-service-pop-up.component.html',
  styleUrls: ['./ubs-admin-tariffs-add-service-pop-up.component.scss']
})
export class UbsAdminTariffsAddServicePopUpComponent implements OnInit {
  service: Service;
  date: string;
  user: string;
  receivedData;
  loadingAnim: boolean;
  addServiceForm: FormGroup;
  private isLangEn = false;
  private destroy: Subject<boolean> = new Subject<boolean>();
  name: string;
  unsubscribe: Subject<any> = new Subject();
  newDate: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    private tariffsService: TariffsService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<UbsAdminTariffsAddServicePopUpComponent>,
    private fb: FormBuilder,
    private localeStorageService: LocalStorageService,
    private languageService: LanguageService
  ) {
    this.receivedData = data;
  }

  ngOnInit(): void {
    this.localeStorageService.firstNameBehaviourSubject.pipe(takeUntil(this.unsubscribe)).subscribe((firstName) => {
      this.name = firstName;
    });

    this.initForm();
    this.fillFields(this.receivedData);
    this.setDate();
  }

  setDate(): void {
    const lang = this.languageService.getCurrentLanguage();
    this.newDate = this.tariffsService.setDate(lang);
    this.isLangEn = lang === 'en';
  }

  private initForm() {
    this.receivedData.serviceData ? this.editForm() : this.addForm();
  }

  addForm(): void {
    this.addServiceForm = this.createService();
  }

  createService() {
    return this.fb.group({
      nameUk: new FormControl('', [Validators.required, Validators.maxLength(30)]),
      nameEn: new FormControl('', [Validators.required, Validators.maxLength(30)]),
      price: new FormControl('', [Validators.required, Validators.pattern(Patterns.ubsServiceBasicPrice)]),
      description: new FormControl('', [Validators.required, Validators.maxLength(255)]),
      descriptionEng: new FormControl('', [Validators.required, Validators.maxLength(255)])
    });
  }

  editForm(): void {
    this.addServiceForm = this.fb.group({
      nameUk: new FormControl(this.receivedData.serviceData.nameUk, [
        Validators.required,
        Validators.pattern(Patterns.ServiceNamePattern),
        Validators.maxLength(255)
      ]),
      nameEn: new FormControl(this.receivedData.serviceData.nameEn, [
        Validators.required,
        Validators.pattern(Patterns.ServiceNamePattern),
        Validators.maxLength(255)
      ]),
      price: new FormControl(this.receivedData.serviceData.price, [Validators.required, Validators.pattern(Patterns.ubsServiceBasicPrice)]),
      description: new FormControl(this.receivedData.serviceData.descriptionUk, [Validators.maxLength(255), Validators.required]),
      descriptionEng: new FormControl(this.receivedData.serviceData.descriptionEn, [Validators.maxLength(255), Validators.required])
    });
  }

  getControl(control: string): FormControl {
    return this.addServiceForm.get(control) as FormControl;
  }

  isDescriptionInvalid(): boolean {
    return this.getControl('description').invalid && this.getControl('description').touched;
  }

  isDescriptionEnInvalid(): boolean {
    return this.getControl('descriptionEng').invalid && this.getControl('descriptionEng').touched;
  }

  addNewService() {
    const tariffId = this.receivedData.tariffId;

    const { nameUk, nameEn, price, description, descriptionEng } = this.addServiceForm.value;
    this.service = {
      price,
      descriptionUk: description,
      descriptionEn: descriptionEng,
      nameUk: nameUk,
      nameEn: nameEn
    };
    this.loadingAnim = true;
    this.tariffsService
      .createService(this.service, tariffId)
      .pipe(takeUntil(this.destroy))
      .subscribe(() => {
        this.dialogRef.close();
      });
  }

  fillFields(receivedData) {
    if (receivedData.serviceData) {
      const { nameUk, nameEn, price, descriptionUk, descriptionEn } = this.receivedData.serviceData;
      this.addServiceForm.patchValue({
        nameUk,
        nameEn,
        price,
        description: descriptionUk,
        descriptionEng: descriptionEn
      });
    }
  }

  editService() {
    const id = this.receivedData.serviceData.id;
    const { nameUk, nameEn, price, description, descriptionEng } = this.addServiceForm.getRawValue();
    this.service = {
      nameUk,
      nameEn,
      price,
      descriptionUk: description,
      descriptionEn: descriptionEng
    };
    this.loadingAnim = true;
    this.tariffsService
      .editService(this.service, id)
      .pipe(takeUntil(this.destroy))
      .subscribe(() => {
        this.dialogRef.close();
      });
    this.loadingAnim = false;
  }

  onCancel(): void {
    const matDialogRef = this.dialog.open(ModalTextComponent, {
      hasBackdrop: true,
      panelClass: 'address-matDialog-styles-w-100',
      data: {
        title: 'modal-text.cancel',
        name: 'cancel',
        text: 'modal-text.cancel-message',
        action: 'modal-text.yes'
      }
    });
    matDialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.dialogRef.close();
      }
    });
  }
}
