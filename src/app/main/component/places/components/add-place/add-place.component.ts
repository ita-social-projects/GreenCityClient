import { AfterViewInit, Component, ElementRef, Injector, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PlaceService } from '@global-service/place/place.service';
import { NewsTagInterface } from '@user-models/news.model';
import { take } from 'rxjs/operators';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { FilterPlaceCategories } from '../../models/place';
import { MapsAPILoader } from '@agm/core';
import { MatDialog } from '@angular/material/dialog';
import { TimePickerPopupComponent } from '../time-picker-pop-up/time-picker-popup.component';

@Component({
  selector: 'app-add-place',
  templateUrl: './add-place.component.html',
  styleUrls: ['./add-place.component.scss']
})
export class AddPlaceComponent implements OnInit, AfterViewInit {
  public addPlaceForm: FormGroup;
  public workingHours = '';
  public adress = '';
  public type = '';
  public name = '';
  public tagList: NewsTagInterface[];
  public filterCategories: FilterPlaceCategories[];
  @ViewChild('addressInput') input: ElementRef;
  @ViewChild('workingHour') hourInput: ElementRef;
  public timeArrStart = [];
  public timeArrEnd = [];
  public timeArr: Array<string> = [];

  constructor(
    private fb: FormBuilder,
    private placeService: PlaceService,
    public localStorageService: LocalStorageService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.placeService
      .getAllFilterPlaceCategories()
      .pipe(take(1))
      .subscribe((categories) => (this.filterCategories = categories));
    this.placeService
      .getAllPresentTags()
      .pipe(take(1))
      .subscribe((tagsArray: Array<NewsTagInterface>) => (this.tagList = tagsArray));
    this.initForm();
  }

  initForm(): void {
    this.addPlaceForm = this.fb.group({
      type: ['', Validators.required],
      name: ['', [Validators.required, Validators.maxLength(30), Validators.pattern(/[0-9a-zа-я]/i)]],
      adress: ['', [Validators.required, Validators.maxLength(100), Validators.pattern(/[0-9a-zа-я]/i)]],
      workingHours: ['', [Validators.required]]
    });
  }

  cancel(): void {
    this.initForm();
  }

  initializeGoogleAutoComplete() {
    const options = {
      componentRestrictions: { country: 'ua' },
      types: ['address']
    };
    const autocomplete = new google.maps.places.Autocomplete(this.input.nativeElement, options);
    autocomplete.addListener('place_changed', () => {
      const result = autocomplete.getPlace();
      this.addPlaceForm.get('adress').setValue(result.formatted_address);

      const latitude = result.geometry.location.lat();
      const longitude = result.geometry.location.lng();
    });
  }

  addPlace(): void {
    console.log(this.addPlaceForm);
    console.log(this.addPlaceForm.get('adress').value);
    this.initForm();
  }

  ngAfterViewInit(): void {
    this.initializeGoogleAutoComplete();
  }

  openTimePickerPopUp() {
    this.dialog
      .open(TimePickerPopupComponent)
      .afterClosed()
      .pipe(take(1))
      .subscribe((value) => {
        this.addPlaceForm.get('workingHours').setValue(value);
        this.hourInput.nativeElement.value = `${value.from} - ${value.to} ` + value.dayOfWeek;
        console.log(value);
      });
  }
}
