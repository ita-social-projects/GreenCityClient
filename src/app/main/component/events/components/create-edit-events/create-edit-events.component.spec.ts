import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
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

describe('CreateEditEventsComponent', () => {
  let component: CreateEditEventsComponent;
  let fixture: ComponentFixture<CreateEditEventsComponent>;
  let route: ActivatedRoute;

  const FormMock = {
    date: new Date(),
    endTime: '15:00',
    onlineLink: 'link',
    place: 'place',
    startTime: '12:00'
  };

  const DateMock = {
    date: new Date(),
    startDate: '',
    finishDate: '',
    coordinatesDto: {
      latitude: null,
      longitude: null
    },
    onlineLink: '',
    valid: false,
    check: false
  };

  const EditDateEventMock = {
    coordinates: null,
    event: 'string',
    finishDate: '',
    id: 1,
    onlineLink: 'link',
    startDate: ''
  };
  const EditEventMock = {
    additionalImages: [],
    dates: [EditDateEventMock],
    description: 'any',
    id: 1,
    open: true,
    organizer: {
      id: 1,
      name: 'John'
    },
    tags: [],
    title: 'Title',
    titleImage: 'string'
  };

  const formDataMock: FormGroup = new FormGroup({
    titleForm: new FormControl('title'),
    description: new FormControl('1 day'),
    eventDuration: new FormControl('titletitletitletitle')
  });

  const actionSub: ActionsSubject = new ActionsSubject();

  const storeMock = jasmine.createSpyObj('store', ['select', 'dispatch']);

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

  const EventsServiceMock = jasmine.createSpyObj('EventsService', ['createEvent', 'editEvent']);
  EventsServiceMock.createEvent = () => of(EditEventMock);
  EventsServiceMock.editEvent = () => of(true);

  const MatSnackBarMock = jasmine.createSpyObj('MatSnackBarComponent', ['openSnackBar']);
  MatSnackBarMock.openSnackBar = () => {
    return true;
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), NgxPaginationModule, RouterTestingModule, FormsModule, ReactiveFormsModule],
      declarations: [CreateEditEventsComponent],
      providers: [
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

  it('checkForm startDate should be 12:00', () => {
    component.dates = [DateMock];
    component.checkForm(FormMock, 0);
    expect(component.dates[0].startDate).toBe('12:00');
  });

  it('checkStatus dates.valid should be falsy', () => {
    component.dates = [DateMock];
    component.checkStatus(false, 0);
    expect(component.dates[0].valid).toBeFalsy();
  });

  it('escapeFromCreateEvent expect router should be call', () => {
    const spy = spyOn(component.router, 'navigate');
    component.escapeFromCreateEvent();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('changeToOpen expect isOpen to be true', () => {
    component.isOpen = false;
    component.changeToOpen();
    expect(component.isOpen).toBeTruthy();
  });

  it('changeToClose expect isOpen to be false', () => {
    component.isOpen = true;
    component.changeToClose();
    expect(component.isOpen).toBeFalsy();
  });

  it('setDateCount dates length should be 3', () => {
    component.setDateCount(3);
    expect(component.dates.length).toBe(3);
  });

  it('getImageTosend imgArray length should be 1', () => {
    component.getImageTosend([new File(['some content'], 'text-file.txt')]);
    expect((component as any).imgArray.length).toBe(1);
  });

  it('setCoordsOnlOff  expect latitude to be 2', () => {
    component.dates = [DateMock];
    component.setCoordsOnlOff({ latitude: 2, longitude: 3 }, 0);
    expect(component.dates[0].coordinatesDto.latitude).toBe(2);
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

  it('getFormattedDate expect hour to be 2', () => {
    const date = new Date((component as any).getFormattedDate(new Date(), 2, 2));
    expect(date.getHours()).toBe(2);
  });

  it('createDates  should create 1 date', () => {
    const spy = spyOn(component as any, 'getFormattedDate');
    component.dates = [DateMock];
    const dates = (component as any).createDates();
    expect(dates.length).toBe(1);
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('createDates  should create 1 date', () => {
    component.dates = [DateMock];
    component.dates[0].startDate = null;
    component.dates[0].finishDate = null;
    const dates = (component as any).createDates();
    expect(new Date(dates[0].finishDate).getHours()).toBe(23);
  });

  it('onSubmit expect isposting to be false', () => {
    const spy = spyOn(component as any, 'checkDates');
    component.checkdates = true;
    component.contentValid = true;
    component.tags[0].isActive = true;
    component.eventFormGroup.patchValue({
      titleForm: 'title',
      eventDuration: '1 day',
      description: 'descriptiondescriptiondescriptiondescription'
    });
    component.onSubmit();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
