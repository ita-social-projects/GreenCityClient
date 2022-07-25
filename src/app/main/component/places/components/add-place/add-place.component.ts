import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PlaceService } from '@global-service/place/place.service';
import { NewsTagInterface } from '@user-models/news.model';
import { take } from 'rxjs/operators';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { FilterPlaceCategories } from '../../models/place';
import { MatDialogRef } from '@angular/material/dialog';
import { WorkingTime } from '../../models/week-pick-model';
import { CreatePlaceModel, OpeningHoursDto } from '../../models/create-place.model';
import { TranslateService } from '@ngx-translate/core';
import { Patterns } from 'src/assets/patterns/patterns';

@Component({
  selector: 'app-add-place',
  templateUrl: './add-place.component.html',
  styleUrls: ['./add-place.component.scss']
})
export class AddPlaceComponent implements OnInit {
  public addPlaceForm: FormGroup;
  public workingHours = '';
  public tagList: NewsTagInterface[];
  public filterCategories: FilterPlaceCategories[];
  public timeArrStart = [];
  public timeArrEnd = [];
  public timeArr: Array<string> = [];
  public workingTime: WorkingTime[];
  public workingTimeIsValid: boolean;
  @Output() getAddressData: any = new EventEmitter<any>();

  constructor(
    private fb: FormBuilder,
    private placeService: PlaceService,
    public localStorageService: LocalStorageService,
    public matDialogRef: MatDialogRef<AddPlaceComponent>,
    public translate: TranslateService
  ) {}

  get type() {
    return this.addPlaceForm.get('type') as FormControl;
  }

  get name() {
    return this.addPlaceForm.get('name') as FormControl;
  }

  get address() {
    return this.addPlaceForm.get('address') as FormControl;
  }

  ngOnInit(): void {
    this.placeService
      .getAllFilterPlaceCategories()
      .pipe(take(1))
      .subscribe((categories) => (this.filterCategories = categories));
    this.placeService
      .getAllPresentTags()
      .pipe(take(1))
      .subscribe((tagsArray: Array<NewsTagInterface>) => (this.tagList = tagsArray));
    this.bindLang(this.localStorageService.getCurrentLanguage());
    this.initForm();
  }

  initForm(): void {
    this.addPlaceForm = this.fb.group({
      type: ['', Validators.required],
      name: ['', [Validators.required, Validators.maxLength(30), Validators.pattern(Patterns.NamePattern)]],
      address: ['', [Validators.required, Validators.maxLength(100)]]
    });
  }

  onLocationSelected(event: any) {
    this.getAddressData.emit(event);
  }

  cancel(): void {
    this.matDialogRef.close();
  }

  clear(property: string): void {
    this.addPlaceForm.get(property).setValue('');
  }

  addPlace(): void {
    const sendPlace: CreatePlaceModel = {
      categoryName: this.type.value,
      placeName: this.name.value,
      locationName: this.address.value,
      openingHoursList: this.workingTime.map((time): OpeningHoursDto => {
        return { openTime: time.timeFrom, closeTime: time.timeTo, weekDay: time.dayOfWeek };
      })
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
          return { dayOfWeek: time.dayOfWeek, timeTo: time.timeTo, timeFrom: time.timeFrom, isSelected: time.isSelected };
        }
      });
  }

  public bindLang(lang: string): void {
    this.translate.setDefaultLang(lang);
  }
}
