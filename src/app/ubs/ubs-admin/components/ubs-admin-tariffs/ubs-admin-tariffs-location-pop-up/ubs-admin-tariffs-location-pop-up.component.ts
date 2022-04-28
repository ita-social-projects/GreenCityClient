import { AfterViewChecked, ChangeDetectorRef, Component, ElementRef, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { skip, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { DatePipe } from '@angular/common';
import { TariffsService } from 'src/app/ubs/ubs-admin/services/tariffs.service';
import { CreateLocation, Locations } from '../../../models/tariffs.interface';
import { Store } from '@ngrx/store';
import { IAppState } from 'src/app/store/state/app.state';
import { AddLocations, GetLocations } from 'src/app/store/actions/tariff.actions';
import { ModalTextComponent } from '../../shared/components/modal-text/modal-text.component';
import { ubsNamePattern } from '../../shared/validators-pattern/ubs-name-patterns';

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
export class UbsAdminTariffsLocationPopUpComponent implements OnInit, AfterViewChecked {
  @ViewChild('locationInput') input: ElementRef;

  locationForm = this.fb.group({
    region: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(40), Validators.pattern(ubsNamePattern.namePattern)]],
    englishRegion: [
      '',
      [Validators.required, Validators.minLength(3), Validators.maxLength(40), Validators.pattern(ubsNamePattern.englishPattern)]
    ],
    location: ['', [Validators.minLength(3), Validators.maxLength(40), Validators.pattern(ubsNamePattern.namePattern)]],
    englishLocation: ['', [Validators.minLength(3), Validators.maxLength(40), Validators.pattern(ubsNamePattern.englishPattern)]]
  });

  regionOptions = {
    types: ['(regions)'],
    componentRestrictions: { country: 'UA' }
  };

  createdCards: CreateLocation[] = [];
  newCard: CreateLocation = {
    addLocationDtoList: [],
    latitude: 0,
    longitude: 0,
    regionTranslationDtos: []
  };

  selectedCities: LocationItem[] = [];
  locations = [];
  currentLatitude: number;
  currentLongitude: number;
  reset = true;
  localityOptions;
  regionBounds;
  autocomplete;
  name: string;
  unsubscribe: Subject<any> = new Subject();
  datePipe = new DatePipe('ua');
  newDate = this.datePipe.transform(new Date(), 'MMM dd, yyyy');
  regionSelected = false;
  regionExist = false;
  citySelected = false;
  cityExist = false;
  cities = [];
  locations$ = this.store.select((state: IAppState): Locations[] => state.locations.locations);

  constructor(
    private tariffsService: TariffsService,
    private fb: FormBuilder,
    private localeStorageService: LocalStorageService,
    private cdr: ChangeDetectorRef,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<UbsAdminTariffsLocationPopUpComponent>,
    private store: Store<IAppState>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      headerText: string;
      template: TemplateRef<any>;
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
      this.cityExist = !this.citySelected && item.length > 3;
    });
  }

  selectCities(currentRegion): void {
    this.cities = currentRegion.map((element) =>
      element.locationsDto.map((item) =>
        item.locationTranslationDtoList.filter((it) => it.languageCode === 'ua').map((it) => it.locationName)
      )
    );
    this.cities = this.cities.reduce((acc, val) => acc.concat(val), []).reduce((acc, val) => acc.concat(val), []);
  }

  translate(sourceText: string, input: any): void {
    this.tariffsService.getJSON(sourceText).subscribe((data) => {
      input.setValue(data[0][0][0]);
    });
  }

  addCity(): void {
    if (this.location.value && this.englishLocation.value && !this.cities.includes(this.location.value) && this.citySelected) {
      const tempItem: LocationItem = {
        location: this.location.value,
        englishLocation: this.englishLocation.value,
        latitute: this.currentLatitude,
        longitude: this.currentLongitude
      };
      this.selectedCities.push(tempItem);
      this.location.setValue('');
      this.englishLocation.setValue('');
      this.citySelected = false;
    }
  }

  deleteCity(index): void {
    this.selectedCities.splice(index, 1);
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
    this.translate(event.name, this.englishRegion);
  }

  addEventToAutocomplete(): void {
    this.autocomplete.addListener('place_changed', () => {
      this.citySelected = true;
      const locationName = this.autocomplete.getPlace().name;
      this.currentLatitude = this.autocomplete.getPlace().geometry.location.lat();
      this.currentLongitude = this.autocomplete.getPlace().geometry.location.lng();
      this.location.setValue(locationName);
      this.translate(locationName, this.englishLocation);
    });
  }

  getLocations(): void {
    this.store.dispatch(GetLocations({ reset: this.reset }));
    this.locations$.pipe(skip(1)).subscribe((item) => {
      if (item) {
        const key = 'content';
        this.locations = item[key];
        this.reset = false;
      }
    });
  }

  addLocation(): void {
    const enRegion = { languageCode: 'en', regionName: this.locationForm.value.englishRegion };
    const region = { languageCode: 'ua', regionName: this.locationForm.value.region };

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

  onNoClick(): void {
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
  }

  ngAfterViewChecked(): void {
    this.cdr.detectChanges();
  }
}
