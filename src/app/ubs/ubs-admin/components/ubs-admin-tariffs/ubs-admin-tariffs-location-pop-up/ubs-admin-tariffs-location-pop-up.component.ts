import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  OnInit,
  QueryList,
  TemplateRef,
  ViewChildren
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { DatePipe } from '@angular/common';
import { TariffsService } from 'src/app/ubs/ubs-admin/services/tariffs.service';
import { CreateLocation } from '../../../models/tariffs.interface';
import { Store } from '@ngrx/store';
import { IAppState } from 'src/app/store/state/app.state';
import { AddLocations } from 'src/app/store/actions/tariff.actions';

@Component({
  selector: 'app-ubs-admin-tariffs-location-pop-up',
  templateUrl: './ubs-admin-tariffs-location-pop-up.component.html',
  styleUrls: ['./ubs-admin-tariffs-location-pop-up.component.scss']
})
export class UbsAdminTariffsLocationPopUpComponent implements OnInit, AfterViewChecked {
  @ViewChildren('locationInput') inputs: QueryList<ElementRef>;
  locationForm = this.fb.group({
    courier: [''],
    englishCourier: [''],
    station: [''],
    englishStation: [''],
    region: [''],
    englishRegion: [''],
    items: this.fb.array([this.createItem()])
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

  localityOptions;
  regionBounds;
  autocomplete = [];
  tempAutocomplete;
  items: FormArray;
  translatedText: string;
  isDisabled = false;
  name: string;
  unsubscribe: Subject<any> = new Subject();
  datePipe = new DatePipe('ua');
  newDate = this.datePipe.transform(new Date(), 'MMM dd, yyyy');
  quantityOfLocations: number = 0;
  regionSelected = false;

  constructor(
    private tariffsService: TariffsService,
    private fb: FormBuilder,
    private localeStorageService: LocalStorageService,
    private cdr: ChangeDetectorRef,
    public dialogRef: MatDialogRef<UbsAdminTariffsLocationPopUpComponent>,
    private store: Store<IAppState>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      headerText: string;
      template: TemplateRef<any>;
    }
  ) {}

  ngOnInit(): void {
    this.localeStorageService.firstNameBehaviourSubject.pipe(takeUntil(this.unsubscribe)).subscribe((firstName) => {
      this.name = firstName;
    });
  }

  translate(sourceText: string, input: any): void {
    this.tariffsService.getJSON(sourceText).subscribe((data) => {
      input.setValue(data[0][0][0]);
    });
  }

  addCity(): void {
    this.items = this.locationForm.get('items') as FormArray;
    if (this.regionSelected && this.checkIfAllCitysAreSelected()) {
      this.items.push(this.createItem());
      this.quantityOfLocations++;
      this.cdr.detectChanges();
      const tempInput = this.inputs.toArray()[this.quantityOfLocations - 1].nativeElement;
      this.tempAutocomplete = new google.maps.places.Autocomplete(tempInput, this.localityOptions);
      this.tempAutocomplete.setBounds(this.regionBounds);
      this.tempAutocomplete.setOptions(this.localityOptions);
      this.autocomplete.push(this.tempAutocomplete);
      this.addEventToAutocomplete(this.quantityOfLocations - 1);
    }
  }

  checkIfAllCitysAreSelected(): boolean {
    for (const item of this.autocomplete) {
      if (!item.getPlace()) {
        return false;
      }
    }
    return true;
  }

  createItem(): FormGroup {
    return this.fb.group({
      location: '',
      englishLocation: '',
      latitude: 0,
      longitude: 0
    });
  }

  deleteLocation(i: number) {
    const fa = this.locationForm.get('items') as FormArray;
    if (fa.length !== 1) {
      fa.removeAt(i);
      this.autocomplete.splice(i, 1);
      this.quantityOfLocations--;
    }
  }

  onRegionSelected(event: any): void {
    this.regionSelected = true;
    this.setValueOfRegion(event);
    this.quantityOfLocations = 1;
    const tempInput = this.inputs.toArray()[this.quantityOfLocations - 1].nativeElement;
    this.autocomplete[0] = new google.maps.places.Autocomplete(tempInput, this.localityOptions);

    const l = event.geometry.viewport.getSouthWest();
    const x = event.geometry.viewport.getNorthEast();

    this.regionBounds = new google.maps.LatLngBounds(l, x);

    this.autocomplete[0].setBounds(event.geometry.viewport);
    this.localityOptions = {
      bounds: this.regionBounds,
      strictBounds: true,
      types: ['(cities)'],
      componentRestrictions: { country: 'ua' }
    };
    this.autocomplete[0].setOptions(this.localityOptions);
    this.addEventToAutocomplete(0);
  }

  setValueOfRegion(event: any): void {
    this.locationForm.get('region').setValue(event.name);
    this.translate(event.name, this.locationForm.get('englishRegion'));
  }

  addEventToAutocomplete(i: number): void {
    this.autocomplete[i].addListener('place_changed', () => {
      const locationName = this.autocomplete[i].getPlace().name;
      const latitude = this.autocomplete[i].getPlace().geometry.location.lat();
      const longitude = this.autocomplete[i].getPlace().geometry.location.lng();
      const key = 'controls';

      this.locationForm.get('items')[key][i][key].location.setValue(locationName);
      this.translate(locationName, this.locationForm.get('items')[key][i][key].englishLocation);
      this.locationForm.get('items')[key][i][key].latitude.setValue(latitude);
      this.locationForm.get('items')[key][i][key].longitude.setValue(longitude);
    });
  }

  addLocation(): void {
    this.isDisabled = true;
    const enRegion = { languageCode: 'en', regionName: this.locationForm.value.englishRegion };
    const region = { languageCode: 'ua', regionName: this.locationForm.value.region };

    for (let i = 0; i < this.quantityOfLocations; i++) {
      const enLocation = { languageCode: 'en', locationName: this.locationForm.value.items[i].englishLocation };
      const Location = { languageCode: 'ua', locationName: this.locationForm.value.items[i].location };

      const lat = this.locationForm.value.items[i].latitude;
      const lng = this.locationForm.value.items[i].longitude;

      const cart: CreateLocation = {
        latitude: lat,
        addLocationDtoList: [enLocation, Location],
        longitude: lng,
        regionTranslationDtos: [enRegion, region]
      };

      this.createdCards.push(cart);
    }
    this.store.dispatch(AddLocations({ locations: this.createdCards }));
    this.dialogRef.close({});
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngAfterViewChecked(): void {
    this.cdr.detectChanges();
  }
}
