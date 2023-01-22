import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { JwtService } from '@global-service/jwt/jwt.service';
import { EventDetailsComponent } from './event-details.component';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject, of } from 'rxjs';
import { EventsService } from '../../services/events.service';
import { ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { ActionsSubject, Store } from '@ngrx/store';

describe('EventDetailsComponent', () => {
  let component: EventDetailsComponent;
  let fixture: ComponentFixture<EventDetailsComponent>;

  const MockReqest = {
    additionalImages: [],
    dates: [
      {
        coordinates: {
          latitude: 0,
          longitude: 0
        },
        onlineLink: 'link'
      }
    ],
    description: 'description',
    id: 1,
    open: true,
    organizer: {
      id: 1111,
      name: 'John'
    },
    tags: [{ nameEn: 'Environmental', nameUa: 'Екологічний', id: 1 }],
    title: 'title',
    titleImage: ''
  };

  const EventsServiceMock = jasmine.createSpyObj('EventsService', ['getEventById ', 'deleteEvent', 'getAllAttendees']);
  EventsServiceMock.getEventById = () => of(MockReqest);
  EventsServiceMock.deleteEvent = () => of(true);
  EventsServiceMock.getAllAttendees = () => of([]);

  const jwtServiceFake = jasmine.createSpyObj('jwtService', ['getUserRole']);
  jwtServiceFake.getUserRole = () => '123';

  const activatedRouteMock = {
    snapshot: {
      params: {
        id: 2
      }
    }
  };

  const LocalStorageServiceMock = jasmine.createSpyObj('LocalStorageService', ['userIdBehaviourSubject', 'setEditMode', 'setEventForEdit']);
  LocalStorageServiceMock.userIdBehaviourSubject = new BehaviorSubject(1111);
  class MatDialogMock {
    open() {
      return {
        afterClosed: () => of(true)
      };
    }
  }

  const storeMock = jasmine.createSpyObj('store', ['select', 'dispatch']);

  const actionSub: ActionsSubject = new ActionsSubject();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule, MatDialogModule],
      declarations: [EventDetailsComponent],
      providers: [
        { provide: JwtService, useValue: jwtServiceFake },
        { provide: EventsService, useValue: EventsServiceMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: MatDialog, useClass: MatDialogMock },
        { provide: LocalStorageService, useValue: LocalStorageServiceMock },
        { provide: Store, useValue: storeMock },
        { provide: ActionsSubject, useValue: actionSub }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventDetailsComponent);
    component = fixture.componentInstance;
    (component as any).dialog = TestBed.inject(MatDialog);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
