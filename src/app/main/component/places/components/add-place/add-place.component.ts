import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PlaceService } from '@global-service/place/place.service';
import { take } from 'rxjs/operators';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { FilterPlaceCategories } from '../../models/place';
import { MatDialogRef } from '@angular/material/dialog';
import { WorkingTime } from '../../models/week-pick-model';
import { CreatePlaceModel, OpeningHoursDto } from '../../models/create-place.model';
import { TranslateService } from '@ngx-translate/core';
import { Patterns } from 'src/assets/patterns/patterns';
import { FilterModel } from '@shared/components/tag-filter/tag-filter.model';
import { tagsListPlacesData } from '../../models/places-consts';
import { PlaceFormGroup } from '../../models/interfaces';

@Component({
  selector: 'app-add-place',
  templateUrl: './add-place.component.html',
  styleUrls: ['./add-place.component.scss']
})
export class AddPlaceComponent implements OnInit {
  placeFormGroup: FormGroup<PlaceFormGroup> = this.fb.group({
    type: ['', Validators.required],
    name: ['', [Validators.required, Validators.maxLength(30), Validators.pattern(Patterns.NamePattern)]],
    address: [{ address: '', coords: undefined }, [Validators.required, Validators.maxLength(100)]]
  });
  workingHours = '';
  tagList: Array<FilterModel> = tagsListPlacesData;
  filterCategories: FilterPlaceCategories[];
  timeArrStart = [];
  timeArrEnd = [];
  timeArr: Array<string> = [];
  workingTime: WorkingTime[];
  workingTimeIsValid: boolean;
  @Output() getAddressData: any = new EventEmitter<any>();

  constructor(
    private fb: FormBuilder,
    private placeService: PlaceService,
    public localStorageService: LocalStorageService,
    public matDialogRef: MatDialogRef<AddPlaceComponent>,
    public translate: TranslateService
  ) {}

  get type() {
    return this.placeFormGroup.get('type') as FormControl;
  }

  get name() {
    return this.placeFormGroup.get('name') as FormControl;
  }

  get address() {
    return this.placeFormGroup.get('address');
  }

  ngOnInit(): void {
    this.placeFormGroup.valueChanges.subscribe((value) => {
      console.log(value);
    });
    this.placeService
      .getAllFilterPlaceCategories()
      .pipe(take(1))
      .subscribe((categories) => (this.filterCategories = categories));
    this.bindLang(this.localStorageService.getCurrentLanguage());
    this.initForm();
  }

  initForm(): void {}

  onLocationSelected(event: any) {
    this.getAddressData.emit(event);
  }

  cancel(): void {
    this.matDialogRef.close();
  }

  clear(property: string): void {
    this.placeFormGroup.get(property).setValue({ address: '', coords: undefined });
  }

  addPlace(): void {
    const sendPlace: CreatePlaceModel = {
      categoryName: this.type.value,
      placeName: this.name.value,
      locationName: this.address.value.address,
      openingHoursList: this.workingTime.map(
        (time): OpeningHoursDto => ({ openTime: time.timeFrom, closeTime: time.timeTo, weekDay: time.dayOfWeek })
      )
    };
    this.matDialogRef.close(sendPlace);
  }

  getTimeOfWork(event) {
    this.workingTimeIsValid = false;
    this.workingTime = event
      .filter((time) => time.isSelected)
      .map((time): WorkingTime => {
        this.workingTimeIsValid = false;
        if (time.dayOfWeek.length && time.timeTo.length && time.timeFrom.length) {
          this.workingTimeIsValid = time.timeTo.length > 0 && time.timeFrom.length > 0 && time.dayOfWeek.length > 0;
          return {
            dayOfWeek: time.dayOfWeek,
            timeTo: time.timeTo,
            timeFrom: time.timeFrom,
            isSelected: time.isSelected
          };
        }
      });
  }

  bindLang(lang: string): void {
    this.translate.setDefaultLang(lang);
  }
}
