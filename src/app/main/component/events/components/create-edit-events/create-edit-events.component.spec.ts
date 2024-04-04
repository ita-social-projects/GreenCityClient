import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { ActionsSubject, Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { NgxPaginationModule } from 'ngx-pagination';
import { of } from 'rxjs';
import { EventsService } from '../../services/events.service';
import { CreateEditEventsComponent } from './create-edit-events.component';
import { ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LanguageService } from 'src/app/main/i18n/language.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('CreateEditEventsComponent', () => {
  let component: CreateEditEventsComponent;
  let fixture: ComponentFixture<CreateEditEventsComponent>;
  let route: ActivatedRoute;

  const FormMock = {
    date: new Date(),
    endTime: '15:00',
    coordinates: {
      latitude: null,
      longitude: null
    },
    onlineLink: 'link',
    place: 'place',
    startTime: '12:00'
  };

  const DateMock = {
    date: new Date(),
    startDate: '',
    finishDate: '',
    coordinates: {
      latitude: null,
      longitude: null
    },
    onlineLink: '',
    valid: false,
    check: false
  };

  const EditDateEventMock = {
    coordinates: {
      latitude: 1,
      longitude: 1,
      cityEn: 'Lviv',
      cityUa: 'Львів',
      countryEn: 'Ukraine',
      countryUa: 'Україна',
      houseNumber: 55,
      regionEn: 'Lvivska oblast',
      regionUa: 'Львівська область',
      streetEn: 'Svobody Ave',
      streetUa: 'Свободи',
      formattedAddressEn: 'Свободи, 55, Львів, Львівська область, Україна',
      formattedAddressUa: 'Svobody Ave, 55, Lviv, Lvivska oblast, Ukraine'
    },
    valid: true,
    event: 'event',
    finishDate: '2022-06-29T04:00:00Z',
    id: 1,
    onlineLink: 'http',
    startDate: '2022-06-29T04:00:00Z'
  };

  const EditEventMock = {
    additionalImages: [],
    imgArray: [],
    imgArrayToPreview: [],
    creationDate: '2022-05-31',
    dates: [EditDateEventMock],
    editorText: 'any',
    description: 'any',
    id: 1,
    open: true,
    organizer: {
      id: 1,
      name: 'John',
      organizerRating: 1
    },
    location: {
      date: new Date(),
      finishDate: 'string',
      onlineLink: 'string',
      place: 'string',
      startDate: 'string',
      coordinates: {
        latitude: 1,
        longitude: 1
      }
    },
    tags: [
      {
        id: 1,
        nameUa: 'Tag1',
        nameEn: 'Tag1'
      },
      {
        id: 2,
        nameUa: 'Tag2',
        nameEn: 'Tag2'
      }
    ],
    title: 'Title',
    titleImage: 'string',
    isSubscribed: true,
    isFavorite: false,
    isActive: true,
    likes: 8,
    countComments: 9,
    isRelevant: true,
    isOrganizedByFriend: false
  };

  const formDataMock: FormGroup = new FormGroup({
    titleForm: new FormControl('title'),
    description: new FormControl('1 day'),
    eventDuration: new FormControl('titletitletitletitle')
  });

  const actionSub: ActionsSubject = new ActionsSubject();

  const storeMock = jasmine.createSpyObj('store', ['select', 'dispatch']);

  const languageServiceMock = jasmine.createSpyObj('languageService', ['getLangValue']);
  languageServiceMock.getLangValue.and.returnValue(['fakeValue']);

  const localStorageServiceMock = jasmine.createSpyObj('localStorageService', [
    'getEventForEdit',
    'getEditMode',
    'getUserId',
    'getPreviousPage'
  ]);
  localStorageServiceMock.getEditMode = () => true;
  localStorageServiceMock.getEventForEdit = () => EditEventMock;
  localStorageServiceMock.getUserId = () => 137;
  localStorageServiceMock.getPreviousPage = () => '/profile';

  const EventsServiceMock = jasmine.createSpyObj('EventsService', [
    'createEvent',
    'editEvent',
    'setArePlacesFilled',
    'setInitialValueForPlaces',
    'getCheckedPlacesObservable',
    'getForm',
    'setForm',
    'getBackFromPreview',
    'setBackFromPreview',
    'transformDate',
    'getSubmitFromPreview',
    'setSubmitFromPreview'
  ]);
  EventsServiceMock.createEvent = () => of(EditEventMock);
  EventsServiceMock.currentForm = () => of(EditDateEventMock);
  EventsServiceMock.editEvent = () => of(true);
  EventsServiceMock.setSubmitFromPreview = () => of(false);
  EventsServiceMock.setArePlacesFilled = () => of('');
  EventsServiceMock.setInitialValueForPlaces = () => of('');
  EventsServiceMock.getCheckedPlacesObservable = () => of([]);
  EventsServiceMock.setForm = () => of(EditDateEventMock);
  EventsServiceMock.getForm = () => of(EditDateEventMock);

  const MatSnackBarMock = jasmine.createSpyObj('MatSnackBarComponent', ['openSnackBar']);
  MatSnackBarMock.openSnackBar = () => {
    return true;
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), NgxPaginationModule, RouterTestingModule, FormsModule, ReactiveFormsModule],
      declarations: [CreateEditEventsComponent],
      providers: [
        { provide: LanguageService, useValue: languageServiceMock },
        { provide: EventsService, useValue: EventsServiceMock },
        { provide: MatSnackBarComponent, useValue: MatSnackBarMock },
        { provide: ActionsSubject, useValue: actionSub },
        { provide: Store, useValue: storeMock },
        { provide: LocalStorageService, useValue: localStorageServiceMock },
        { provide: MatDialog, useValue: {} },
        { provide: MatDialogRef, useValue: {} }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    route = TestBed.inject(ActivatedRoute);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEditEventsComponent);
    component = fixture.componentInstance;
    component.eventFormGroup = formDataMock;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit expect eventFormGroup to be true', () => {
    const spy = spyOn(component as any, 'setEditValue');
    component.tags = [];
    component.editMode = true;
    component.eventFormGroup = null;
    component.ngOnInit();
    expect(component.eventFormGroup).toBeTruthy();
    expect(component.tags.length).toBe(3);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('checkTab', () => {
    const tag = { nameEn: 'name', nameUa: 'імя', isActive: true };
    component.checkTab(tag);
    expect(tag.isActive).toBeFalsy();
  });

  it('should set values during edit mode', () => {
    component.editEvent = EditEventMock;
    component.setEditValue();

    expect(component.eventFormGroup.get('titleForm').value).toBe(EditEventMock.title);
    expect(component.eventFormGroup.get('eventDuration').value).toBe(component.dateArrCount[EditEventMock.dates.length - 1]);
    expect(component.eventFormGroup.get('description').value).toBe(EditEventMock.description);
    expect(component.imgArrayToPreview).toEqual([EditEventMock.titleImage, ...EditEventMock.additionalImages]);
    expect(component.imagesForEdit).toEqual([EditEventMock.titleImage, ...EditEventMock.additionalImages]);
    expect(component.isOpen).toBe(EditEventMock.open);
    expect(component.oldImages).toEqual(component.imagesForEdit);
  });

  it('should set dates during initialization', () => {
    const mockLocalStorageService = {
      getEventForEdit: () => ({
        dates: [
          {
            startDate: '2022-06-29T12:00:00Z',
            finishDate: '2022-06-29T15:00:00Z',
            check: true,
            valid: true,
            onlineLink: 'http://example.com',
            coordinates: {
              latitude: 1,
              longitude: 1
            }
          }
        ]
      })
    };

    component.localStorageService = mockLocalStorageService as any;
    component.setDates(true);

    expect(component.dates.length).toBe(1);
    expect(component.dates[0].startDate).toBe('2022-06-29T12:00:00Z');
    expect(component.dates[0].finishDate).toBe('2022-06-29T15:00:00Z');
    expect(component.dates[0].check).toBe(false);
    expect(component.dates[0].valid).toBe(false);
    expect(component.dates[0].onlineLink).toBe('http://example.com');
    expect(component.dates[0].coordinates.latitude).toBe(1);
    expect(component.dates[0].coordinates.longitude).toBe(1);
  });

  it('should set dates during edit mode', () => {
    const mockLocalStorageService = {
      getEventForEdit: () => ({
        dates: [
          {
            startDate: '2022-06-29T12:00:00Z',
            finishDate: '2022-06-29T15:00:00Z',
            check: true,
            valid: true,
            onlineLink: 'http://example.com',
            coordinates: {
              latitude: 1,
              longitude: 1
            }
          }
        ]
      })
    };

    component.localStorageService = mockLocalStorageService as any;
    component.editMode = true;

    component.setDates(false, [
      {
        startDate: '2022-06-30T12:00:00Z',
        finishDate: '2022-06-30T15:00:00Z',
        check: false,
        valid: false,
        onlineLink: 'http://edited-example.com',
        coordinates: {
          latitude: 2,
          longitude: 2
        }
      }
    ]);

    expect(component.dates.length).toBe(1);
    expect(component.dates[0].startDate).toBe('2022-06-30T12:00:00Z');
    expect(component.dates[0].finishDate).toBe('2022-06-30T15:00:00Z');
    expect(component.dates[0].check).toBe(false);
    expect(component.dates[0].valid).toBe(false);
    expect(component.dates[0].onlineLink).toBe('http://edited-example.com');
    expect(component.dates[0].coordinates.latitude).toBe(2);
    expect(component.dates[0].coordinates.longitude).toBe(2);
  });

  it('checkForm startDate should be 12:00', () => {
    component.dates = [DateMock];
    component.checkFormSetDates(FormMock, 0);
    expect(component.dates[0].startDate).toBe('12:00');
  });

  it('escapeFromCreateEvent expect router should be call', () => {
    const spy = spyOn(component.router, 'navigate');
    component.escapeFromCreateEvent();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('changeEventType expect isOpen to be true', () => {
    const mouseEvent = { type: 'click' } as MouseEvent;
    component.isOpen = false;
    component.changeEventType(mouseEvent);
    expect(component.isOpen).toBeTruthy();
  });

  it('changeEventType expect isOpen to be false', () => {
    const keyboardEnterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
    component.isOpen = true;
    component.changeEventType(keyboardEnterEvent);
    expect(component.isOpen).toBeFalsy();
  });

  it('changeEventType should not change isOpen value', () => {
    const keyboardEvent = new KeyboardEvent('keydown', { key: 'P' });
    component.isOpen = true;
    component.changeEventType(keyboardEvent);
    expect(component.isOpen).toBeTruthy();
  });

  describe('setOnlineLink', () => {
    it('should update the online link and call updateAreAddressFilled with correct parameters', () => {
      const link = 'newOnlineLink';
      const index = 0;
      const updateAreAddressFilledSpy = spyOn(component as any, 'updateAreAddressFilled');
      component.setOnlineLink(link, index);
      expect(component.dates[index].onlineLink).toBe(link);
      expect(updateAreAddressFilledSpy).toHaveBeenCalledWith(component.dates, false, true, index);
    });
  });

  it('setDateCount dates length should be 3', () => {
    component.setDateCount(3);
    expect(component.dates.length).toBe(3);
  });

  it('getImageTosend imgArray length should be 1', () => {
    component.getImageTosend([new File(['some content'], 'text-file.txt')]);
    expect((component as any).imgArray.length).toBe(1);
  });

  it('setCoordsOffline expect latitude to be 2', () => {
    component.dates = [DateMock];
    component.setCoordsOffline({ latitude: 2, longitude: 3 }, 0);
    expect(component.dates[0].coordinates.latitude).toBe(2);
  });

  it('checkDates expect checkdates to be false', () => {
    component.checkdates = true;
    component.dates = [DateMock];
    component.dates[0].valid = false;
    (component as any).checkDates();
    expect(component.checkdates).toBeFalsy();
  });

  it('checkDates expect checkdates to be false', () => {
    component.checkdates = false;
    component.dates = [DateMock];
    component.dates[0].valid = true;
    (component as any).checkDates();
    expect(component.checkdates).toBeTruthy();
  });

  it('onSubmit expect isposting to be false', () => {
    const spy = spyOn(component as any, 'checkDates');
    component.tags[0].isActive = true;
    component.eventFormGroup.patchValue({
      titleForm: 'title',
      eventDuration: '1 day',
      description: 'descriptiondescriptiondescriptiondescription'
    });
    component.onSubmit();
    (component as any).checkDates();
    expect(component.checkdates).toBeFalsy();
    expect(spy).toHaveBeenCalledTimes(2);
  });
});
