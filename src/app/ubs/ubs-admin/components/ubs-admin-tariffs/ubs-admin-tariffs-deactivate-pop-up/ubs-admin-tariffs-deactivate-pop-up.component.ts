import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TariffsService } from '../../../services/tariffs.service';
import { FormBuilder, ValidatorFn, Validators } from '@angular/forms';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { Subject } from 'rxjs';
import { map, startWith, takeUntil } from 'rxjs/operators';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-ubs-admin-tariffs-deactivate-pop-up',
  templateUrl: './ubs-admin-tariffs-deactivate-pop-up.component.html',
  styleUrls: ['./ubs-admin-tariffs-deactivate-pop-up.component.scss']
})

//@ts-ignore
export class UbsAdminTariffsDeactivatePopUpComponent implements OnInit {
  DeactivateCardForm = this.fb.group({
    courier: ['', Validators.required],
    station: ['', Validators.required],
    region: ['', Validators.required],
    city: [{ value: '', disabled: true }, [Validators.maxLength(40), Validators.required]]
  });

  public name: string;
  public datePipe = new DatePipe('ua');
  public newDate = this.datePipe.transform(new Date(), 'MMM dd, yyyy');

  public selectedStation = [];
  public blurOnOption = false;
  public stationPlaceholder: string;
  public stations;
  public filteredStations;
  unsubscribe: Subject<any> = new Subject();

  public icons = {
    arrowDown: '././assets/img/ubs-tariff/arrow-down.svg',
    cross: '././assets/img/ubs/cross.svg'
  };

  get station() {
    return this.DeactivateCardForm.get('station');
  }
  get courier() {
    return this.DeactivateCardForm.get('courier');
  }
  get region() {
    return this.DeactivateCardForm.get('region');
  }
  get city() {
    return this.DeactivateCardForm.get('city');
  }

  constructor(
    private fb: FormBuilder,
    private translate: TranslateService,
    private tariffsService: TariffsService,
    private localeStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    this.localeStorageService.firstNameBehaviourSubject.pipe(takeUntil(this.unsubscribe)).subscribe((firstName) => {
      this.name = firstName;
    });
    this.setStationPlaceholder();
    this.getReceivingStation();
  }

  public onBlur(event): void {
    if (event.relatedTarget.localName === 'mat-option') {
      this.blurOnOption = true;
    }
  }

  public checkStation(item): boolean {
    return this.selectedStation.map((it) => it.name).includes(item);
  }

  openAuto(event: Event, trigger: MatAutocompleteTrigger, flag: boolean): void {
    if (!flag) {
      event.stopPropagation();
      trigger.openPanel();
    }
  }

  public setStationPlaceholder(): void {
    if (this.selectedStation.length) {
      this.stationPlaceholder = this.selectedStation.length + ' вибрано';
    } else {
      this.translate.get('ubs-tariffs.placeholder-choose-station').subscribe((data) => (this.stationPlaceholder = data));
    }
  }

  public onSelectStation(event, trigger?: MatAutocompleteTrigger): void {
    this.station.clearValidators();
    this.station.updateValueAndValidity();
    this.blurOnOption = false;
    const selectedValue = this.stations.find((ob) => ob.name === event.option.value);
    const tempItem = {
      name: selectedValue.name,
      id: selectedValue.id
    };
    const newValue = event.option.value;
    if (this.selectedStation.map((it) => it.name).includes(newValue)) {
      this.selectedStation = this.selectedStation.filter((item) => item.name !== newValue);
    } else {
      this.selectedStation.push(tempItem);
    }
    this.station.setValidators(this.stationValidator());
    this.station.setValue('');
    this.setStationPlaceholder();
    if (trigger) {
      requestAnimationFrame(() => {
        trigger.openPanel();
      });
    }
  }

  public _filterOptions(name: string, items: any[]): any[] {
    const filterValue = name.toLowerCase();
    return items.filter((option) => option.toLowerCase().includes(filterValue));
  }

  public stationValidator(): ValidatorFn {
    let error;
    if (!this.selectedStation.length) {
      error = this.station.setErrors({ emptySelectedStation: true });
    }
    return error;
  }

  public getReceivingStation(): void {
    this.tariffsService
      .getAllStations()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((res) => {
        this.stations = res;
        const stationsName = this.stations.map((it) => it.name);
        this.station.valueChanges
          .pipe(
            startWith(''),
            map((value: string) => this._filterOptions(value, stationsName))
          )
          .subscribe((data) => {
            this.filteredStations = data;
            this.station.setValidators(this.stationValidator());
          });
      });
  }

  public ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
