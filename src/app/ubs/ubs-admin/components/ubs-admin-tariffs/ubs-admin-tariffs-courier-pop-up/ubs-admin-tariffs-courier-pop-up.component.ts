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
import { LanguageService } from '../../../../../main/i18n/language.service';

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
  datePipe = new DatePipe('ua');
  newDate = this.datePipe.transform(new Date(), 'MMM dd, yyyy');
  couriers = [];
  selectedCourier;
  couriersName;
  currentLanguage;
  couriersNameEng;
  array;
  courierPlaceholder: string;
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
    private languageService: LanguageService,
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
    this.subscribeToLangChange();
    this.getCouriers();
    this.localStorageService.firstNameBehaviourSubject.pipe(takeUntil(this.unsubscribe)).subscribe((firstName) => {
      this.authorName = firstName;
    });
    this.name.valueChanges.subscribe((value) => {
      const temp = this.couriers.filter((it) => it.courierTranslationDtos.find((ob) => (ob.name === value ? value.trim() : '')));
      this.courierExist = temp.length !== 0;
    });
    this.englishName.valueChanges.subscribe((value) => {
      const temp = this.couriers.filter((it) => it.courierTranslationDtos.find((ob) => (ob.name === value ? value.trim() : '')));
      this.enCourierExist = temp.length !== 0;
    });
    this.courierPlaceholder = this.data.edit ? 'ubs-tariffs.placeholder-choose-courier' : 'ubs-tariffs.placeholder-enter-courier';
  }

  getCouriers(): void {
    this.tariffsService
      .getCouriers()
      .pipe(takeUntil(this.destroy))
      .subscribe((res) => {
        this.couriers = res;
        this.couriersName = res.map((it) => it.courierTranslationDtos.map((el) => el.name)).flat(2);
        this.couriersNameEng = res.map((it) => it.courierTranslationDtos.map((el) => el.nameEng)).flat(2);
      });
  }

  openAuto(event: Event, trigger: MatAutocompleteTrigger): void {
    event.stopPropagation();
    trigger.openPanel();
  }

  selectCourier(event): void {
    this.selectedCourier = this.couriers.filter((it) =>
      it.courierTranslationDtos.find((ob) => ob.nameEng === event.option.value.toString() || ob.name === event.option.value.toString())
    );
  }

  editor() {
    this.setNewCourierName();
    this.editCourier();
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

  setNewCourierName() {
    this.courierForm.setValue({
      name: this.courierForm.controls.name.value,
      englishName: this.courierForm.controls.englishName.value
    });
  }

  editCourier(): void {
    const newCourier = {
      courierId: this.selectedCourier[0].courierId,
      courierTranslationDtos: [
        {
          name: this.name.value,
          nameEng: this.englishName.value
        }
      ]
    };
    this.tariffsService
      .editCourier(newCourier)
      .pipe(takeUntil(this.destroy))
      .subscribe(() => {
        this.dialogRef.close();
      });
  }

  private subscribeToLangChange(): void {
    this.localStorageService.languageBehaviourSubject.pipe(takeUntil(this.destroy)).subscribe(() => {
      this.currentLanguage = this.localStorageService.getCurrentLanguage();
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.unsubscribe();
  }
}
