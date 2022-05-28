import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';
import { TranslateModule } from '@ngx-translate/core';
import { NgxPaginationModule } from 'ngx-pagination';
import { of } from 'rxjs';
import { EventsService } from '../../services/events.service';

import { CreateEditEventsComponent } from './create-edit-events.component';

describe('CreateEditEventsComponent', () => {
  let component: CreateEditEventsComponent;
  let fixture: ComponentFixture<CreateEditEventsComponent>;

  const MockReqest = {
    page: [],
    totalElements: 4
  };

  const EventsServiceMock = jasmine.createSpyObj('EventsService', ['getEvents']);
  EventsServiceMock.getEvents = () => of(MockReqest);

  const MatSnackBarMock = jasmine.createSpyObj('MatSnackBarComponent', ['openSnackBar']);
  MatSnackBarMock.openSnackBar = (type: string) => {};

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

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CreateEditEventsComponent],
      imports: [TranslateModule.forRoot(), NgxPaginationModule, RouterTestingModule, FormsModule, ReactiveFormsModule],
      providers: [
        { provide: EventsService, useValue: EventsServiceMock },
        { provide: MatSnackBarComponent, useValue: MatSnackBarMock }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEditEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit expect titleForm to be true', () => {
    component.titleForm = null;
    component.ngOnInit();
    expect(component.titleForm).toBeTruthy();
  });

  it('checkTab', () => {
    const tag = { name: 'name', isActive: true };
    component.checkTab(tag);
    expect(tag.isActive).toBeFalsy();
  });

  it('checkForm', () => {
    component.dates = [DateMock, DateMock];
    component.checkForm(FormMock, 1);
  });
});
