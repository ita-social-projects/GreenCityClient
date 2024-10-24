import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import { JwtService } from '@global-service/jwt/jwt.service';
import { EventDetailsComponent } from './event-details.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { EventsService } from '../../services/events.service';
import { ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { ActionsSubject, Store } from '@ngrx/store';
import { Language } from 'src/app/main/i18n/Language';
import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';
import { EventStoreService } from '../../services/event-store.service';
import { LangValueDirective } from 'src/app/shared/directives/lang-value/lang-value.directive';
import { LanguageService } from 'src/app/main/i18n/language.service';
import { eventMock, eventStateMock } from '@assets/mocks/events/mock-events';
import { EventResponse } from '../../models/events.interface';

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
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  const storeMock = jasmine.createSpyObj('store', ['select', 'dispatch']);
  storeMock.select = () => of(eventStateMock);
  const snackBarMock = jasmine.createSpyObj('MatSnackBarComponent', ['openSnackBar']);

  const EventsServiceMock = jasmine.createSpyObj('eventService', [
    'getEventById ',
    'deleteEvent',
    'getAllAttendees',
    'createAddresses',
    'getFormattedAddress',
    'getForm',
    'getLangValue',
    'setBackFromPreview',
    'setSubmitFromPreview',
    'postToggleLike',
    'getIsLikedByUser'
  ]);
  EventsServiceMock.getEventById = () => of(eventMock);
  EventsServiceMock.deleteEvent = () => of(true);
  EventsServiceMock.getAllAttendees = () => of([]);
  EventsServiceMock.createAddresses = () => of('');
  EventsServiceMock.getFormattedAddress = () => of('');
  EventsServiceMock.setBackFromPreview = () => of();
  EventsServiceMock.setSubmitFromPreview = () => of();

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

  const bsModalRefMock = jasmine.createSpyObj('bsModalRef', ['hide']);
  const bsModalBsModalServiceMock = jasmine.createSpyObj('BsModalService', ['show']);
  const translateServiceMock: TranslateService = jasmine.createSpyObj('TranslateService', ['setDefaultLang']);
  translateServiceMock.setDefaultLang = (lang: string) => of(lang);
  translateServiceMock.get = () => of(true);

  const MatSnackBarMock = jasmine.createSpyObj('MatSnackBarComponent', ['openSnackBar']);

  const languageServiceMock = jasmine.createSpyObj('LanguageService', ['getLangValue', 'getCurrentLangObs']);
  languageServiceMock.getLangValue = (valUa: string, valEn: string) => valUa;
  languageServiceMock.getCurrentLangObs = () => of('ua');
  EventsServiceMock.getIsLikedByUser.and.returnValue(of(true));
  const actionSub: ActionsSubject = new ActionsSubject();

  beforeEach(waitForAsync(() => {
    const dialogSpyObj = jasmine.createSpyObj('MatDialog', ['open']);
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule, MatDialogModule],
      declarations: [
        EventDetailsComponent,
        LangValueDirective,
        mockPipe({ name: 'dateLocalisation' }),
        mockPipe({ name: 'translate' }),
        mockPipe({ name: 'safeHtmlTransform' })
      ],
      providers: [
        { provide: JwtService, useValue: jwtServiceFake },
        { provide: EventsService, useValue: EventsServiceMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: MatDialog, useClass: MatDialogMock },
        { provide: LocalStorageService, useValue: LocalStorageServiceMock },
        { provide: TranslateService, useValue: translateServiceMock },
        { provide: Store, useValue: storeMock },
        { provide: ActionsSubject, useValue: actionSub },
        { provide: BsModalRef, useValue: bsModalRefMock },
        { provide: MatSnackBarComponent, useValue: MatSnackBarMock },
        { provide: BsModalService, useValue: bsModalBsModalServiceMock },
        { provide: MatDialog, useValue: dialogSpyObj },
        { provide: LanguageService, useValue: languageServiceMock },
        EventStoreService
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
    dialogSpy = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
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

  it('should return the formatted address from the event service', () => {
    const expectedAddress = 'fake address';
    spyOn(component.eventService, 'getFormattedAddress').and.returnValue(expectedAddress);
    expect(component.getAddress()).toBe(expectedAddress);
    expect(component.eventService.getFormattedAddress).toHaveBeenCalledWith(component.locationCoordinates);
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

  it('should verify admin role', () => {
    jwtServiceFake.getUserRole = () => 'ROLE_ADMIN';
    let role = 'UNAUTHENTICATED';
    role = jwtServiceFake.getUserRole() === 'ROLE_ADMIN' ? 'ADMIN' : role;
    expect(role).toBe('ADMIN');
  });

  it('openAuthModalWindow should be called when add to favorite clicked and not raited', () => {
    component.isRegistered = false;
    spyOn(component, 'openAuthModalWindow');
    if (!component.isRegistered) {
      component.openAuthModalWindow('sign-in');
    }
    expect(component.openAuthModalWindow).toHaveBeenCalled();
  });

  it('should call openAuthModalWindow with "sign-in" when role is UNAUTHENTICATED', () => {
    component.role = 'UNAUTHENTICATED';
    const spy = spyOn(component, 'openAuthModalWindow');
    component.buttonAction({} as MouseEvent);
    expect(spy).toHaveBeenCalledWith('sign-in');
  });

  it('should call openSnackBar with "errorJoinEvent" when isUserCanJoin is true and attenderError is truthy', () => {
    component.role = 'USER';
    component.isUserCanJoin = true;
    component.attenderError = 'some error';
    const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
    dialogRefSpy.afterClosed.and.returnValue(of(true));
    dialogSpy.open.and.returnValue(dialogRefSpy);
    component.buttonAction({} as MouseEvent);
    expect(MatSnackBarMock.openSnackBar).toHaveBeenCalledWith('errorJoinEvent');
    expect(component.attenderError).toBe('');
  });

  it('should call submitEventCancelling if result is true after dialog closed when submitting event join cancelation', () => {
    const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
    dialogRefSpy.afterClosed.and.returnValue(of(true));
    dialogSpy.open.and.returnValue(dialogRefSpy);

    spyOn(component, 'submitEventCancelling');

    component.openPopUp();
    dialogRefSpy.afterClosed().subscribe(() => {
      expect(component.submitEventCancelling).toHaveBeenCalled();
    });
  });

  it('should update likes and not revert isLiked if postToggleLike succeeds', () => {
    component.isLiked = false;
    component.event = { likes: 10 } as EventResponse;
    component.eventId = 2;

    EventsServiceMock.postToggleLike.and.returnValue(of(true));

    component.onLikeEvent();

    expect(snackBarMock.openSnackBar).not.toHaveBeenCalled();
    expect(component.isLiked).toBe(true);
  });

  it('should correctly toggle likes and isLiked based on the current state', () => {
    component.event = { likes: 10 } as EventResponse;
    component.eventId = 2;
    component.isLiked = false;
    EventsServiceMock.postToggleLike.and.returnValue(of(true));

    component.onLikeEvent();

    expect(snackBarMock.openSnackBar).not.toHaveBeenCalled();
    expect(component.isLiked).toBe(true);
    expect(component.event.likes).toBe(11);

    component.isLiked = true;
    EventsServiceMock.postToggleLike.and.returnValue(of(true));

    component.onLikeEvent();

    expect(component.isLiked).toBe(false);
    expect(component.event.likes).toBe(10);
  });
});
