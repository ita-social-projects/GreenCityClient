import { DatePipe } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Patterns } from 'src/assets/patterns/patterns';
import { TariffsService } from '../../../services/tariffs.service';
import { Couriers } from '../../../models/tariffs.interface';

@Component({
  selector: 'app-ubs-admin-tariffs-courier-pop-up',
  templateUrl: './ubs-admin-tariffs-courier-pop-up.component.html',
  styleUrls: ['./ubs-admin-tariffs-courier-pop-up.component.scss']
})
export class UbsAdminTariffsCourierPopUpComponent implements OnInit, OnDestroy {
  courierForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(40), Validators.pattern(Patterns.NamePattern)]],
    englishName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(40), Validators.pattern(Patterns.NamePattern)]]
  });

  courierExist = false;
  enCourierExist = false;
  authorName: string;
  unsubscribe: Subject<any> = new Subject();
  datePipe;
  newDate;
  couriers = [];
  selectedCourier;
  couriersName;
  couriersNameEng;
  array;
  currentLang: string;
  placeholder: string;
  placeholderTranslate: string;
  courierAdd: string;
  courierEdit: string;
  private destroy: Subject<boolean> = new Subject<boolean>();

  public icons = {
    arrowDown: '././assets/img/ubs-tariff/arrow-down.svg',
    cross: '././assets/img/ubs/cross.svg'
  };

  constructor(
    private fb: FormBuilder,
    private localStorageService: LocalStorageService,
    public dialogRef: MatDialogRef<UbsAdminTariffsCourierPopUpComponent>,
    private tariffsService: TariffsService,
    private localeStorageService: LocalStorageService,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      headerText: string;
      template: TemplateRef<any>;
      edit: boolean;
    }
  ) {}

  get name() {
    return this.courierForm.get('name');
  }

  get englishName() {
    return this.courierForm.get('englishName');
  }

  ngOnInit(): void {
    this.getCouriers();
    this.localeStorageService.languageBehaviourSubject.pipe(takeUntil(this.destroy)).subscribe((lang: string) => {
      this.currentLang = lang;
      this.setDate();
    });
    this.localStorageService.firstNameBehaviourSubject.pipe(takeUntil(this.unsubscribe)).subscribe((firstName) => {
      this.authorName = firstName;
    });
    this.name.valueChanges.subscribe((value) => {
      this.courierExist = this.checkIsCourierExist(value, this.couriersName);
    });
    this.englishName.valueChanges.subscribe((value) => {
      this.enCourierExist = this.checkIsCourierExist(value, this.couriersNameEng);
    });
    this.placeholder = this.data.edit ? 'ubs-tariffs.placeholder-choose-courier' : 'ubs-tariffs.placeholder-enter-courier';
    this.placeholderTranslate = this.data.edit
      ? 'ubs-tariffs.placeholder-choose-courier-translate'
      : 'ubs-tariffs.placeholder-enter-courier-translate';
  }

  getCouriers(): void {
    this.tariffsService
      .getCouriers()
      .pipe(takeUntil(this.destroy))
      .subscribe((res) => {
        this.couriers = res;
        this.couriersName = res.map((el) => el.nameUk);
        this.couriersNameEng = res.map((el) => el.nameEn);
      });
  }

  setDate(): void {
    this.datePipe = new DatePipe(this.currentLang);
    this.newDate = this.datePipe.transform(new Date(), 'MMM dd, yyyy');
  }

  checkIsCourierExist(value: string, array: Array<string>): boolean {
    const newCourierName = value.toLowerCase();
    const couriersList = array.map((it) => it.toLowerCase());
    return couriersList.includes(newCourierName);
  }

  openAuto(event: Event, trigger: MatAutocompleteTrigger): void {
    event.stopPropagation();
    trigger.openPanel();
  }

  selectCourier(event): void {
    this.selectedCourier = this.couriers.find(
      (courier: Couriers) => courier.nameUk === event.option.value || courier.nameEn === event.option.value
    );
  }

  editCourierName() {
    this.setNewCourierName();
    this.editCourier();
  }

  addCourier(): void {
    const newCourier = { nameEn: this.englishName.value, nameUk: this.name.value };
    this.tariffsService
      .addCourier(newCourier)
      .pipe(takeUntil(this.destroy))
      .subscribe(() => {
        this.dialogRef.close();
      });
  }

  setNewCourierName() {
    this.courierForm.setValue({
      name: this.courierForm.controls.name.value,
      englishName: this.courierForm.controls.englishName.value
    });
  }

  editCourier(): void {
    const newCourier = {
      courierId: this.selectedCourier.courierId,
      nameUk: this.name.value,
      nameEn: this.englishName.value
    };
    this.tariffsService
      .editCourier(newCourier)
      .pipe(takeUntil(this.destroy))
      .subscribe(() => {
        this.dialogRef.close();
      });
  }

  checkLang(valUa, valEn): any {
    return this.currentLang === 'ua' ? valUa : valEn;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.unsubscribe();
  }
}
