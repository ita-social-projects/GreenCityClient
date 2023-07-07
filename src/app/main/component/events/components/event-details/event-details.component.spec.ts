import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import { JwtService } from '@global-service/jwt/jwt.service';
import { EventDetailsComponent } from './event-details.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject, of } from 'rxjs';
import { EventsService } from '../../services/events.service';
import { ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { ActionsSubject, Store } from '@ngrx/store';
import { Language } from 'src/app/main/i18n/Language';
import { LanguageService } from 'src/app/main/i18n/language.service';

export function mockPipe(options: Pipe): Pipe {
  const metadata: Pipe = {
    name: options.name
  };

  return Pipe(metadata)(
    class MockPipe implements PipeTransform {
      transform(value: string): string {
        return value;
      }
    }
  );
}

describe('EventDetailsComponent', () => {
  let component: EventDetailsComponent;
  let fixture: ComponentFixture<EventDetailsComponent>;
  let route: ActivatedRoute;
  const routerSpy = { navigate: jasmine.createSpy('navigate') };

  const eventMock = {
    additionalImages: [],
    dates: [
      {
        coordinates: {
          addressEn: 'Address',
          addressUa: 'Адрес',
          latitude: 3,
          longitude: 4
        },
        event: 'test',
        finishDate: '2023-02-14',
        id: 1,
        onlineLink: 'https://test',
        startDate: '2023-04-12'
      }
    ],
    description: 'description',
    id: 1,
    open: true,
    organizer: {
      id: 1111,
      name: 'John',
      organizerRating: 2
    },
    tags: [{ nameEn: 'Environmental', nameUa: 'Екологічний', id: 1 }],
    title: 'title',
    titleImage: '',
    isSubscribed: true
  };

  const EventsServiceMock = jasmine.createSpyObj('eventService', ['getEventById ', 'deleteEvent', 'getAllAttendees', 'createAdresses']);
  EventsServiceMock.getEventById = () => of(eventMock);
  EventsServiceMock.deleteEvent = () => of(true);
  EventsServiceMock.getAllAttendees = () => of([]);
  EventsServiceMock.createAdresses = () => of('');

  const jwtServiceFake = jasmine.createSpyObj('jwtService', ['getUserRole']);
  jwtServiceFake.getUserRole = () => '123';

  const activatedRouteMock = {
    snapshot: {
      params: {
        id: 2
      }
    }
  };

  const LocalStorageServiceMock = jasmine.createSpyObj('LocalStorageService', [
    'userIdBehaviourSubject',
    'languageBehaviourSubject',
    'setEditMode',
    'setEventForEdit',
    'getCurrentLanguage',
    'getPreviousPage'
  ]);

  LocalStorageServiceMock.userIdBehaviourSubject = new BehaviorSubject(1111);
  LocalStorageServiceMock.languageBehaviourSubject = new BehaviorSubject('ua');
  LocalStorageServiceMock.getCurrentLanguage = () => 'ua' as Language;
  class MatDialogMock {
    open() {
      return {
        afterClosed: () => of(true)
      };
    }
  }
  LocalStorageServiceMock.getPreviousPage = () => '/profile';

  const languageServiceMock = jasmine.createSpyObj('languageService', ['getLangValue']);
  languageServiceMock.getLangValue = (valUa: string, valEn: string) => {
    return valUa;
  };

  let translateServiceMock: TranslateService;
  translateServiceMock = jasmine.createSpyObj('TranslateService', ['setDefaultLang']);
  translateServiceMock.setDefaultLang = (lang: string) => of();
  translateServiceMock.get = () => of(true);

  const storeMock = jasmine.createSpyObj('store', ['select', 'dispatch']);

  const actionSub: ActionsSubject = new ActionsSubject();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule, MatDialogModule],
      declarations: [EventDetailsComponent, mockPipe({ name: 'dateLocalisation' }), mockPipe({ name: 'translate' })],
      providers: [
        { provide: JwtService, useValue: jwtServiceFake },
        { provide: EventsService, useValue: EventsServiceMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: MatDialog, useClass: MatDialogMock },
        { provide: LocalStorageService, useValue: LocalStorageServiceMock },
        { provide: LanguageService, useValue: languageServiceMock },
        { provide: TranslateService, useValue: translateServiceMock },
        { provide: Store, useValue: storeMock },
        { provide: ActionsSubject, useValue: actionSub }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    route = TestBed.inject(ActivatedRoute);
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

  it('should call methods on ngOnInit', () => {
    const spy1 = spyOn(component as any, 'bindLang');
    const spy2 = spyOn(component as any, 'verifyRole');
    component.ngOnInit();
    expect(spy1).toHaveBeenCalled();
    expect(spy1).toHaveBeenCalledWith('ua');
    expect(spy2).toHaveBeenCalled();
  });

  it('should verify unauthenticated role', () => {
    const role = component.roles.UNAUTHENTICATED;
    expect(role).toBe('UNAUTHENTICATED');
  });

  it('should verify user role', () => {
    jwtServiceFake.getUserRole = () => 'ROLE_USER';
    let role = 'UNAUTHENTICATED';
    role = jwtServiceFake.getUserRole() === 'ROLE_USER' ? 'USER' : role;
    expect(role).toBe('USER');
  });

  it('should verify organizer role', () => {
    let role = 'UNAUTHENTICATED';
    (component as any).userId = 1;
    eventMock.organizer.id = 1;
    role = (component as any).userId === eventMock.organizer.id ? 'ORGANIZER' : role;
    expect(role).toBe('ORGANIZER');
  });

  it('should verify admin role', () => {
    jwtServiceFake.getUserRole = () => 'ROLE_ADMIN';
    let role = 'UNAUTHENTICATED';
    role = jwtServiceFake.getUserRole() === 'ROLE_ADMIN' ? 'ADMIN' : role;
    expect(role).toBe('ADMIN');
  });

  it('should redirect to edit page', (done) => {
    fixture.ngZone.run(() => {
      component.navigateToEditEvent();
      fixture.whenStable().then(() => {
        expect(routerSpy.navigate).toBeDefined();
        done();
      });
    });
  });

  it('should return ua value by getLangValue', () => {
    const value = component.getLangValue('value', 'enValue');
    expect(value).toBe('value');
  });

  it('should return true if an event is over', () => {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - 1);
    const prevDate = currentDate.toISOString();
    const value = component.isEventOver(prevDate.toString());
    expect(value).toBeTruthy();
  });
});
