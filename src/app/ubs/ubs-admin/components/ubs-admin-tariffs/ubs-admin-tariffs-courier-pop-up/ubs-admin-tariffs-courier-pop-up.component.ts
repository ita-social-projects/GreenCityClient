import { DatePipe } from '@angular/common';
import { QueryValueType } from '@angular/compiler/src/core';
import { Component, Inject, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TariffsService } from '../../../services/tariffs.service';

@Component({
  selector: 'app-ubs-admin-tariffs-courier-pop-up',
  templateUrl: './ubs-admin-tariffs-courier-pop-up.component.html',
  styleUrls: ['./ubs-admin-tariffs-courier-pop-up.component.scss']
})
export class UbsAdminTariffsCourierPopUpComponent implements OnInit, OnDestroy {
  namePattern = /^[A-Za-zА-Яа-яїЇіІєЄ0-9\'\-\ ]+[A-Za-zА-Яа-яїЇіІєЄ0-9\'\-\ ]$/;
  courierForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(40), Validators.pattern(this.namePattern)]],
    englishName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(40), Validators.pattern(this.namePattern)]]
  });

  courierExist = false;
  authorName: string;
  unsubscribe: Subject<any> = new Subject();
  datePipe = new DatePipe('ua');
  newDate = this.datePipe.transform(new Date(), 'MMM dd, yyyy');
  couriers = [];
  couriersName = [];
  enValue;
  private destroy: Subject<boolean> = new Subject<boolean>();

  public icons = {
    arrowDown: '././assets/img/ubs-tariff/arrow-down.svg'
  };

  constructor(
    private fb: FormBuilder,
    private localeStorageService: LocalStorageService,
    public dialogRef: MatDialogRef<UbsAdminTariffsCourierPopUpComponent>,
    private tariffsService: TariffsService,
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
    this.localeStorageService.firstNameBehaviourSubject.pipe(takeUntil(this.unsubscribe)).subscribe((firstName) => {
      this.authorName = firstName;
    });
    this.name.valueChanges.subscribe((value) => {
      const temp = this.couriers.filter((it) => it.courierTranslationDtos.find((ob) => ob.name === value));
      this.courierExist = temp.length === 0 ? false : true;
    });
  }

  getCouriers(): void {
    this.tariffsService
      .getCouriers()
      .pipe(takeUntil(this.destroy))
      .subscribe((res) => {
        this.couriers = res;
        this.couriersName = res.map((it) => it.courierTranslationDtos.filter((ob) => ob.languageCode === 'ua').map((item) => item.name));
      });
  }

  openAuto(event: Event, trigger: MatAutocompleteTrigger): void {
    event.stopPropagation();
    trigger.openPanel();
  }

  selectedCourier(event): void {
    console.log(event.option.value);
    this.enValue = this.couriers.filter((it) => it.courierTranslationDtos.find((ob) => ob.name === event.option.value.toString()));
    console.log(this.enValue[0].courierId);
    this.englishName.setValue(
      this.enValue.map((it) => it.courierTranslationDtos.filter((ob) => ob.languageCode === 'en').map((i) => i.name))
    );
  }

  addCourier(): void {
    const newCourier = { nameEn: this.englishName.value, nameUa: this.name.value };
    this.tariffsService
      .addCourier(newCourier)
      .pipe(takeUntil(this.destroy))
      .subscribe(() => {
        this.dialogRef.close();
      });
  }

  editCourier(): void {
    this.dialogRef.close();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.unsubscribe();
  }
}
