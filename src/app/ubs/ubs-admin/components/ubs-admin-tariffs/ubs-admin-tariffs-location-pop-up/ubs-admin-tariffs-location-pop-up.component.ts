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
import { FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { map, skip, startWith, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { DatePipe } from '@angular/common';
import { TariffsService } from 'src/app/ubs/ubs-admin/services/tariffs.service';
import { CreateLocation, Locations, EditLocationName } from '../../../models/tariffs.interface';
import { Store } from '@ngrx/store';
import { IAppState } from 'src/app/store/state/app.state';
import { AddLocations, GetLocations } from 'src/app/store/actions/tariff.actions';
import { ModalTextComponent } from '../../shared/components/modal-text/modal-text.component';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { Patterns } from 'src/assets/patterns/patterns';
import { GoogleScript } from 'src/assets/google-script/google-script';
import { LanguageService } from 'src/app/main/i18n/language.service';
import { GooglePlaceService, GooglePrediction } from 'src/app/ubs/mocks/google-types';
import { Language } from 'src/app/main/i18n/Language';
import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';

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

  cityPredictionList: GooglePrediction[];
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
  placeService: GooglePlaceService;

  public icons = {
    arrowDown: '././assets/img/ubs-tariff/arrow-down.svg',
    cross: '././assets/img/ubs/cross.svg'
  };

  constructor(
    private tariffsService: TariffsService,
    private fb: FormBuilder,
    private localeStorageService: LocalStorageService,
    private langService: LanguageService,
    private googleScript: GoogleScript,
    private cdr: ChangeDetectorRef,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<UbsAdminTariffsLocationPopUpComponent>,
    private snackBar: MatSnackBarComponent,
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
    this.currentLang = this.localeStorageService.getCurrentLanguage();
    this.googleScript.load(this.currentLang);
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
    if (!currentRegion?.length || !currentRegion[0].locationsDto) {
      return;
    }
    this.regionId = currentRegion[0].regionId;
    this.cities = currentRegion
      .map((element) =>
        element.locationsDto.map((item) =>
          item.locationTranslationDtoList.filter((it) => it.languageCode === Language.UA).map((it) => it.locationName)
        )
      )
      .flat(2);
    this.enCities = currentRegion
      .map((element) =>
        element.locationsDto.map((item) =>
          item.locationTranslationDtoList.filter((it) => it.languageCode === Language.EN).map((it) => it.locationName)
        )
      )
      .flat(2);
    this.activeCities = this.langService.getLangValue(this.cities, this.enCities) as any[];

    this.editedCities = [];
    currentRegion[0].locationsDto.forEach((location) => {
      const enLocation = location.locationTranslationDtoList.find((trans) => trans.languageCode === Language.EN);
      const ukLocation = location.locationTranslationDtoList.find((trans) => trans.languageCode === Language.UA);

      const cityObject = {
        locationId: location.locationId,
        englishLocation: enLocation.locationName,
        location: ukLocation.locationName
      };

      this.editedCities.push(cityObject);
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
    } else {
      this.editedCityExist = true;
    }
  }

  public deleteCity(index): void {
    this.selectedCities.splice(index, 1);
  }

  public deleteEditedCity(index): void {
    this.tariffsService.deleteCityInLocation(this.editedCities[index].locationId).pipe(takeUntil(this.unsubscribe)).subscribe();
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
    this.setTranslation(event.place_id, this.region, this.getLangValue(Language.UK, Language.EN));
    this.setTranslation(event.place_id, this.englishRegion, this.getLangValue(Language.EN, Language.UK));
  }

  setTranslation(id: string, abstractControl: AbstractControl, lang: string): void {
    this.placeService = new google.maps.places.PlacesService(document.createElement('div'));
    const request = {
      placeId: id,
      language: lang
    };
    this.placeService.getDetails(request, (placeDetails) => {
      abstractControl.setValue(placeDetails.name);

      if (this.data.edit) {
        this.currentLatitude = placeDetails.geometry.location.lat();
        this.currentLongitude = placeDetails.geometry.location.lng();
      }
    });
  }

  addEventToAutocomplete(): void {
    this.autocompleteLsr = this.autocomplete.addListener('place_changed', () => {
      this.citySelected = true;
      this.currentLatitude = this.autocomplete.getPlace().geometry.location.lat();
      this.currentLongitude = this.autocomplete.getPlace().geometry.location.lng();

      const placeId = this.autocomplete.getPlace().place_id;
      const languages = {
        current: this.currentLang === Language.UA ? Language.UK : Language.EN,
        opposite: this.currentLang === Language.UA ? Language.EN : Language.UK
      };
      this.setTranslation(placeId, this.location, languages.current);
      this.setTranslation(placeId, this.englishLocation, languages.opposite);
    });
  }

  selectedEditRegion(event): void {
    const selectedValue = this.locations.filter((it) =>
      it.regionTranslationDtos.find((ob) => ob.regionName === event.option.value.toString())
    );

    const notCurrLang = this.currentLang === Language.UA ? Language.EN : Language.UA;
    const enValue = selectedValue
      .map((it) => it.regionTranslationDtos.filter((ob) => ob.languageCode === notCurrLang).map((i) => i.regionName))
      .flat();
    this.englishRegion.setValue(enValue[0]);
  }

  setPredictCities(): void {
    this.cityPredictionList = null;
    const city = this.getLangValue('місто', 'City');
    if (this.location.value) {
      this.inputCity(`${this.region.value}, ${city}, ${this.location.value}`);
    }
  }

  inputCity(searchAddress: string): void {
    const request = {
      input: searchAddress,
      types: ['(cities)'],
      componentRestrictions: { country: 'ua' }
    };
    this.autocomplete = new google.maps.places.AutocompleteService();

    this.autocomplete.getPlacePredictions(request, (cityPredictionList) => {
      this.cityPredictionList = cityPredictionList;
    });
  }

  onCitySelected(city: GooglePrediction): void {
    this.setTranslation(city.place_id, this.location, this.getLangValue(Language.UK, Language.EN));
    this.setTranslation(city.place_id, this.englishLocation, this.getLangValue(Language.EN, Language.UK));
  }

  getLocations(): void {
    this.store.dispatch(GetLocations({ reset: this.reset }));

    this.locations$.pipe(skip(1)).subscribe((item) => {
      if (item) {
        this.locations = item;
        const uaregions = this.locations
          .map((element) => element.regionTranslationDtos.filter((it) => it.languageCode === this.currentLang).map((it) => it.regionName))
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
    const valueUa = this.getLangValue(this.region.value, this.englishRegion.value);
    const valueEn = this.getLangValue(this.englishRegion.value, this.region.value);
    const enRegion = { languageCode: Language.EN, regionName: valueEn };
    const region = { languageCode: Language.UA, regionName: valueUa };

    for (const item of this.selectedCities) {
      const enLocation = { languageCode: Language.EN, locationName: item.englishLocation };
      const Location = { languageCode: Language.UA, locationName: item.location };

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
    this.snackBar.openSnackBar('successUpdateUbsData');
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

  private checkCityExist(item, array: Array<string>): boolean {
    const newCityName = item.locationTranslationDtoList?.locationName.toLowerCase();
    const cityList = array.map((it) => it.toLowerCase());
    return cityList.includes(newCityName);
  }

  public getLangValue(uaValue, enValue): string {
    return this.langService.getLangValue(uaValue, enValue) as string;
  }

  ngAfterViewChecked(): void {
    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {
    google.maps.event.removeListener(this.autocompleteLsr);
    google.maps.event.clearInstanceListeners(this.autocomplete);
  }
}
