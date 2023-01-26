import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { map, skip, startWith, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { DatePipe } from '@angular/common';
import { TariffsService } from 'src/app/ubs/ubs-admin/services/tariffs.service';
import { CreateLocation, Locations, EditLocationName } from '../../../models/tariffs.interface';
import { Store } from '@ngrx/store';
import { IAppState } from 'src/app/store/state/app.state';
import { AddLocations, EditLocation, GetLocations } from 'src/app/store/actions/tariff.actions';
import { ModalTextComponent } from '../../shared/components/modal-text/modal-text.component';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { Patterns } from 'src/assets/patterns/patterns';
import { GoogleScript } from 'src/assets/google-script/google-script';

interface LocationItem {
  location: string;
  englishLocation: string;
  latitute: number;
  longitude: number;
}

@Component({
  selector: 'app-ubs-admin-tariffs-location-pop-up',
  templateUrl: './ubs-admin-tariffs-location-pop-up.component.html',
  styleUrls: ['./ubs-admin-tariffs-location-pop-up.component.scss']
})
export class UbsAdminTariffsLocationPopUpComponent implements OnInit, AfterViewChecked, OnDestroy {
  @ViewChild('locationInput') input: ElementRef;

  locationForm = this.fb.group({
    region: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(40), Validators.pattern(Patterns.NamePattern)]],
    englishRegion: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(40), Validators.pattern(Patterns.NamePattern)]],
    location: ['', [Validators.minLength(3), Validators.maxLength(40), Validators.pattern(Patterns.NamePattern)]],
    englishLocation: ['', [Validators.minLength(3), Validators.maxLength(40), Validators.pattern(Patterns.NamePattern)]]
  });

  regionOptions = {
    types: ['administrative_area_level_1'],
    componentRestrictions: { country: 'UA' }
  };

  createdCards: CreateLocation[] = [];
  newCard: CreateLocation = {
    addLocationDtoList: [],
    latitude: 0,
    longitude: 0,
    regionTranslationDtos: []
  };
  newLocationName: EditLocationName[] = [];
  selectedCities: LocationItem[] = [];
  editedCities = [];
  locations = [];
  currentLatitude: number;
  currentLongitude: number;
  reset = true;
  localityOptions;
  regionBounds;
  autocomplete;
  autocompleteLsr;
  name: string;
  unsubscribe: Subject<any> = new Subject();
  currentLang: string;
  datePipe;
  newDate;
  regionSelected = false;
  regionExist = false;
  citySelected = false;
  cityInvalid = false;
  cityExist = false;
  editedCityExist = false;
  cities = [];
  activeCities = [];
  filteredRegions;
  filteredCities = [];
  editLocationId;
  regionId;
  enCities;
  locations$ = this.store.select((state: IAppState): Locations[] => state.locations.locations);
  placeService: google.maps.places.PlacesService;

  public icons = {
    arrowDown: '././assets/img/ubs-tariff/arrow-down.svg',
    cross: '././assets/img/ubs/cross.svg'
  };

  constructor(
    private tariffsService: TariffsService,
    private fb: FormBuilder,
    private localeStorageService: LocalStorageService,
    private googleScript: GoogleScript,
    private cdr: ChangeDetectorRef,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<UbsAdminTariffsLocationPopUpComponent>,
    private store: Store<IAppState>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      headerText: string;
      template: TemplateRef<any>;
      edit: boolean;
    }
  ) {}

  get region() {
    return this.locationForm.get('region');
  }

  get englishRegion() {
    return this.locationForm.get('englishRegion');
  }

  get location() {
    return this.locationForm.get('location');
  }

  get englishLocation() {
    return this.locationForm.get('englishLocation');
  }

  ngOnInit(): void {
    this.getLocations();
    this.localeStorageService.firstNameBehaviourSubject.pipe(takeUntil(this.unsubscribe)).subscribe((firstName) => {
      this.name = firstName;
    });
    this.region.valueChanges.subscribe((item) => {
      this.regionExist = !this.regionSelected && item.length > 3;
      const currentRegion = this.locations.filter((element) => element.regionTranslationDtos.find((it) => it.regionName === item));
      this.selectCities(currentRegion);
    });
    this.location.valueChanges.subscribe((item) => {
      this.cityInvalid = !this.citySelected && item.length > 3;
      this.cityExist = this.checkCityExist(item, this.activeCities);
    });
    this.localeStorageService.languageBehaviourSubject.pipe(takeUntil(this.unsubscribe)).subscribe((lang: string) => {
      this.currentLang = lang;
      this.datePipe = new DatePipe(this.currentLang);
      this.newDate = this.datePipe.transform(new Date(), 'MMM dd, yyyy');
    });
  }

  selectCities(currentRegion): void {
    if (!currentRegion || !currentRegion.length || !currentRegion[0].locationsDto) {
      return;
    }
    this.filteredCities = currentRegion[0].locationsDto;
    this.location.valueChanges.subscribe((data) => {
      if (!data) {
        this.filteredCities = currentRegion[0].locationsDto;
      }
      const res = [];
      this.filteredCities.forEach((elem, index) => {
        elem.locationTranslationDtoList.forEach((el) => {
          if (el.locationName.toLowerCase().includes(data) && el.languageCode === 'ua') {
            res.push(this.filteredCities[index]);
          }
        });
      });
      this.filteredCities = res;
    });
    this.regionId = currentRegion[0].regionId;
    this.cities = currentRegion
      .map((element) =>
        element.locationsDto.map((item) =>
          item.locationTranslationDtoList.filter((it) => it.languageCode === 'ua').map((it) => it.locationName)
        )
      )
      .flat(2);
    this.enCities = currentRegion
      .map((element) =>
        element.locationsDto.map((item) =>
          item.locationTranslationDtoList.filter((it) => it.languageCode === 'en').map((it) => it.locationName)
        )
      )
      .flat(2);
    this.activeCities = this.getLangValue(this.cities, this.enCities);
  }

  translate(sourceText: string, input: any): void {
    const lang = this.getLangValue('uk', 'en');
    const translateTo = this.getLangValue('en', 'uk');
    this.tariffsService.getJSON(sourceText, lang, translateTo).subscribe((data) => {
      input.setValue(data[0][0][0]);
    });
  }

  public addCity(): void {
    if (this.location.value && this.englishLocation.value && !this.cities.includes(this.location.value) && this.citySelected) {
      const uaLocation = this.getLangValue(this.location.value, this.englishLocation.value);
      const enLocation = this.getLangValue(this.englishLocation.value, this.location.value);
      const tempItem: LocationItem = {
        location: uaLocation,
        englishLocation: enLocation,
        latitute: this.currentLatitude,
        longitude: this.currentLongitude
      };
      this.selectedCities.push(tempItem);
      this.location.setValue('');
      this.englishLocation.setValue('');
      this.citySelected = false;
    }
  }

  public addEditedCity(): void {
    const locationValueExist = this.location.value && this.englishLocation.value;
    const locationValueChanged: boolean = !this.cities.includes(this.location.value) || !this.enCities.includes(this.englishLocation.value);
    if (locationValueExist && locationValueChanged) {
      this.editedCityExist = false;
      const tempItem = {
        location: this.location.value,
        englishLocation: this.englishLocation.value,
        locationId: this.editLocationId
      };
      this.editedCities.push(tempItem);
      this.location.setValue('');
      this.englishLocation.setValue('');
    } else {
      this.editedCityExist = true;
    }
  }

  public deleteCity(index): void {
    this.selectedCities.splice(index, 1);
  }

  public deleteEditedCity(index): void {
    this.editedCities.splice(index, 1);
  }

  onRegionSelected(event: any): void {
    this.regionSelected = true;
    this.setValueOfRegion(event);

    if (!this.autocomplete) {
      this.autocomplete = new google.maps.places.Autocomplete(this.input.nativeElement, this.localityOptions);
    }
    const l = event.geometry.viewport.getSouthWest();
    const x = event.geometry.viewport.getNorthEast();
    this.regionBounds = new google.maps.LatLngBounds(l, x);

    this.autocomplete.setBounds(event.geometry.viewport);
    this.localityOptions = {
      bounds: this.regionBounds,
      strictBounds: true,
      types: ['(cities)'],
      componentRestrictions: { country: 'ua' }
    };
    this.autocomplete.setOptions(this.localityOptions);
    this.addEventToAutocomplete();
  }

  setValueOfRegion(event: any): void {
    this.region.setValue(event.name);
    this.setTranslation(event.place_id, this.englishRegion);
  }

  setTranslation(region: string, abstractControl: any): void {
    const request = {
      placeId: region,
      language: this.getLangValue('en', 'uk')
    };
    this.placeService.getDetails(request, (placeDetails) => {
      abstractControl.setValue(placeDetails.name);
    });
  }

  public getLangValue(uaValue, enValue): any {
    return this.currentLang === 'ua' ? uaValue : enValue;
  }

  addEventToAutocomplete(): void {
    this.autocompleteLsr = this.autocomplete.addListener('place_changed', () => {
      this.citySelected = true;
      const locationName = this.autocomplete.getPlace().name;
      this.currentLatitude = this.autocomplete.getPlace().geometry.location.lat();
      this.currentLongitude = this.autocomplete.getPlace().geometry.location.lng();
      this.location.setValue(locationName);
      this.translate(locationName, this.englishLocation);
    });
  }

  selectedEditRegion(event): void {
    const selectedValue = this.locations.filter((it) =>
      it.regionTranslationDtos.find((ob) => ob.regionName === event.option.value.toString())
    );
    const enValue = selectedValue
      .map((it) => it.regionTranslationDtos.filter((ob) => ob.languageCode === 'en').map((i) => i.regionName))
      .flat(2);
    this.englishRegion.setValue(enValue);
  }

  selectCitiesEdit(event): void {
    event.option.value.locationTranslationDtoList.forEach((el) => {
      if (el.languageCode === 'ua') {
        this.location.setValue(el.locationName);
      }
      if (el.languageCode === 'en') {
        this.englishLocation.setValue(el.locationName);
      }
      this.editLocationId = event.option.value.locationId;
    });
  }

  getLocations(): void {
    this.store.dispatch(GetLocations({ reset: this.reset }));

    this.locations$.pipe(skip(1)).subscribe((item) => {
      if (item) {
        this.locations = item;
        const uaregions = this.locations
          .map((element) => element.regionTranslationDtos.filter((it) => it.languageCode === 'ua').map((it) => it.regionName))
          .flat(2);
        this.region.valueChanges
          .pipe(
            startWith(''),
            map((value: string) => this._filter(value, uaregions))
          )
          .subscribe((data) => {
            this.filteredRegions = data;
          });
        this.reset = false;
      }
    });
  }

  public _filter(name: string, items: any[]): any[] {
    const filterValue = name.toLowerCase();
    return items.filter((option) => option.toLowerCase().includes(filterValue));
  }

  addLocation(): void {
    const valueUa = this.getLangValue(this.locationForm.value.region, this.locationForm.value.englishRegion);
    const valueEn = this.getLangValue(this.locationForm.value.englishRegion, this.locationForm.value.region);
    const enRegion = { languageCode: 'en', regionName: valueEn };
    const region = { languageCode: 'ua', regionName: valueUa };

    for (const item of this.selectedCities) {
      const enLocation = { languageCode: 'en', locationName: item.englishLocation };
      const Location = { languageCode: 'ua', locationName: item.location };

      const cart: CreateLocation = {
        latitude: item.latitute,
        addLocationDtoList: [enLocation, Location],
        longitude: item.longitude,
        regionTranslationDtos: [enRegion, region]
      };

      this.createdCards.push(cart);
    }
    this.store.dispatch(AddLocations({ locations: this.createdCards }));
    this.dialogRef.close({});
  }

  public editLocation(): void {
    for (const item of this.editedCities) {
      const cart = {
        nameEn: item.englishLocation,
        nameUa: item.location,
        locationId: item.locationId
      };
      this.newLocationName.push(cart);
    }
    this.store.dispatch(EditLocation({ editedLocations: this.newLocationName }));
    this.dialogRef.close({});
  }

  onCancel(): void {
    if (this.selectedCities.length || this.editedCities.length) {
      const matDialogRef = this.dialog.open(ModalTextComponent, {
        hasBackdrop: true,
        panelClass: 'address-matDialog-styles-w-100',
        data: {
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
    } else {
      this.dialogRef.close();
    }
  }
  public openAuto(event: Event, trigger: MatAutocompleteTrigger): void {
    event.stopPropagation();
    trigger.openPanel();
  }

  private checkCityExist(item: string, array: Array<string>): boolean {
    const newCityName = item.toLowerCase();
    const cityList = array.map((it) => it.toLowerCase());
    return cityList.includes(newCityName);
  }

  ngAfterViewChecked(): void {
    this.cdr.detectChanges();
    this.localeStorageService.languageBehaviourSubject.pipe(takeUntil(this.unsubscribe)).subscribe((lang: string) => {
      this.googleScript.load(lang);
      this.placeService = new google.maps.places.PlacesService(document.createElement('div'));
    });
  }

  ngOnDestroy(): void {
    google.maps.event.removeListener(this.autocompleteLsr);
    google.maps.event.clearInstanceListeners(this.autocomplete);
  }
}
