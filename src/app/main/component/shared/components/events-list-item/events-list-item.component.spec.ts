import { Language } from './../../../../i18n/Language';
import { CUSTOM_ELEMENTS_SCHEMA, Injectable, EventEmitter, Pipe, PipeTransform } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { BsModalRef, ModalModule } from 'ngx-bootstrap/modal';
import { TagsArray } from '../../../events/models/event-consts';
import { Store } from '@ngrx/store';
import { EventsListItemComponent } from './events-list-item.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { of } from 'rxjs/internal/observable/of';
import { EventsService } from '../../../events/services/events.service';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { RatingModule } from 'ngx-bootstrap/rating';
import { BehaviorSubject, Subject } from 'rxjs';
import { UserOwnAuthService } from '@auth-service/user-own-auth.service';
import { TagObj } from '../../../events/models/events.interface';
import { DateLocalisationPipe } from '@pipe/date-localisation-pipe/date-localisation.pipe';

@Injectable()
class TranslationServiceStub {
  public onLangChange = new EventEmitter<any>();
  public onTranslationChange = new EventEmitter<any>();
  public onDefaultLangChange = new EventEmitter<any>();
  public addLangs(langs: string[]) {}
  public getLangs() {
    return 'en-us';
  }
  public getBrowserLang() {
    return '';
  }
  public getBrowserCultureLang() {
    return '';
  }
  public use(lang: string) {
    return '';
  }
  public get(key: any): any {
    return of(key);
  }
  public setDefaultLang() {
    return true;
  }
}

@Pipe({ name: 'dateLocalisation' })
class DatePipeMock implements PipeTransform {
  transform(value: string): string {
    return value;
  }
}

describe('EventsListItemComponent', () => {
  let component: EventsListItemComponent;
  let fixture: ComponentFixture<EventsListItemComponent>;
  let translate: TranslateService;

  const eventMock = {
    description: 'tralalalal',
    additionalImages: [],
    tags: [
      { id: 1, nameUa: 'Соціальний', nameEn: 'Social' },
      { id: 13, nameUa: 'Екологічний', nameEn: 'Environmental' },
      { id: 14, nameUa: 'Економічний', nameEn: 'Economic' }
    ],
    dates: [
      {
        coordinates: {
          addressEn: 'address',
          addressUa: 'address',
          latitude: 0,
          longitude: 0
        },
        id: null,
        event: null,
        startDate: '2022-05-31T00:00:00+03:00',
        finishDate: '2022-05-31T23:59:00+03:00',
        onlineLink: null
      }
    ],
    id: 307,
    organizer: { id: 5, name: 'Mykola Kovalushun', organizerRating: 3 },
    title: 'dddddddd',
    titleImage: 'https://-fc27f19b10e0apl',
    isSubscribed: true,
    open: true
  };

  const fakeItemTags: TagObj[] = [
    {
      nameEn: 'Environmental',
      nameUa: 'Екологічний',
      isActive: true
    },
    {
      nameEn: 'Social',
      nameUa: 'Соціальний',
      isActive: true
    },
    {
      nameEn: 'eco',
      nameUa: 'Соціальний',
      isActive: false
    }
  ];

  const fakeActiveTags: TagObj[] = [
    {
      nameEn: 'Environmental',
      nameUa: 'Екологічний',
      isActive: true
    },
    {
      nameEn: 'Social',
      nameUa: 'Соціальний',
      isActive: true
    }
  ];

  const routerSpy = { navigate: jasmine.createSpy('navigate') };
  const storeMock = jasmine.createSpyObj('store', ['dispatch']);
  const mockLang = 'ua';
  const bsModalRefMock = jasmine.createSpyObj('bsModalRef', ['hide']);
  const EventsServiceMock = jasmine.createSpyObj('EventsService', ['getEventById ', 'deleteEvent', 'getAllAttendees']);
  EventsServiceMock.getEventById = () => of(eventMock);
  EventsServiceMock.getAllAttendees = () => of([]);
  EventsServiceMock.deleteEvent = () => of(true);

  let localStorageServiceMock: LocalStorageService;
  localStorageServiceMock = jasmine.createSpyObj('LocalStorageService', [
    'getCurrentLanguage',
    'setEditMode',
    'setEventForEdit',
    'userIdBehaviourSubject',
    'languageSubject'
  ]);
  localStorageServiceMock.languageSubject = new Subject();
  localStorageServiceMock.userIdBehaviourSubject = new BehaviorSubject(5);
  localStorageServiceMock.languageBehaviourSubject = new BehaviorSubject('ua');

  let translateServiceMock: TranslateService;
  translateServiceMock = jasmine.createSpyObj('TranslateService', ['setDefaultLang']);
  translateServiceMock.setDefaultLang = (lang: string) => of();
  translateServiceMock.get = () => of(true);
  localStorageServiceMock.getCurrentLanguage = () => mockLang as Language;

  let userOwnAuthServiceMock: UserOwnAuthService;
  userOwnAuthServiceMock = jasmine.createSpyObj('UserOwnAuthService', ['getDataFromLocalStorage']);
  userOwnAuthServiceMock.getDataFromLocalStorage = () => true;
  userOwnAuthServiceMock.credentialDataSubject = new Subject();
  userOwnAuthServiceMock.isLoginUserSubject = new BehaviorSubject(true);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EventsListItemComponent, DatePipeMock],
      providers: [
        { provide: BsModalRef, useValue: bsModalRefMock },
        { provide: Store, useValue: storeMock },
        { provide: Router, useValue: routerSpy },
        { provide: EventsService, useValue: EventsServiceMock },
        { provide: LocalStorageService, useValue: localStorageServiceMock },
        { provide: TranslateService, useClass: TranslationServiceStub },
        { provide: UserOwnAuthService, useValue: userOwnAuthServiceMock }
      ],
      imports: [RouterTestingModule, MatDialogModule, TranslateModule.forRoot(), RatingModule.forRoot(), ModalModule.forRoot()],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    translate = TestBed.inject(TranslateService);
    fixture = TestBed.createComponent(EventsListItemComponent);
    component = fixture.componentInstance;
    component.event = eventMock as any;
    component.itemTags = TagsArray;
    component.styleBtn = 'string';
    component.nameBtn = 'string';
    component.isJoinBtnHidden = false;
    component.rate = 3;
    component.isJoined = false;
    component.isEventOpen = false;
    component.isOwner = false;
    component.isRegistered = false;
    component.isFinished = false;
    component.isReadonly = false;
    component.isPosting = false;
    component.isRated = false;
    component.max = 3;

    component.deleteDialogData = {
      popupTitle: 'homepage.events.delete-title',
      popupConfirm: 'homepage.events.delete-yes',
      popupCancel: 'homepage.events.delete-no'
    };

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('tags.length shoud be 3 in ngOnInit', () => {
      component.itemTags = [];
      component.ngOnInit();
      expect(component.itemTags.length).toBe(3);
    });

    it(`filterTags should be called in ngOnInit`, () => {
      spyOn(component, 'filterTags');
      component.ngOnInit();
      expect(component.filterTags).toHaveBeenCalled();
    });

    it(`should check whether getAllAttendees returns correct value`, () => {
      component.ngOnInit();
      EventsServiceMock.getAllAttendees();
      expect(component.attendees).toEqual([]);
    });

    it(`should check whether active tags are filtered properly`, () => {
      component.itemTags = fakeItemTags;
      component.filterTags(component.event.tags);
      expect(component.activeTags).toEqual(fakeActiveTags);
    });

    it(`initAllStatusesOfEvent should be called in ngOnInit`, () => {
      spyOn(component, 'initAllStatusesOfEvent');
      component.ngOnInit();
      expect(component.initAllStatusesOfEvent).toHaveBeenCalled();
    });

    it(`rate should be called in ngOnInit`, () => {
      component.ngOnInit();
      component.rate = Math.round(component.event.organizer.organizerRating);
      expect(component.rate).toBe(3);
    });

    it('getUserId user ID should be 5', () => {
      component.getUserId();
      expect(component.userId).toBe(5);
    });

    it('getUserId should be called in ngOnInit', () => {
      spyOn(component, 'getUserId');
      component.ngOnInit();
      expect(component.getUserId).toHaveBeenCalled();
    });

    it(`checkAllStatusesOfEvent should be called in ngOnInit`, () => {
      spyOn(component, 'checkAllStatusesOfEvent');
      component.ngOnInit();
      expect(component.checkAllStatusesOfEvent).toHaveBeenCalled();
    });

    it(`subscribeToLangChange should be called in ngOnInit`, () => {
      spyOn(component, 'subscribeToLangChange');
      component.ngOnInit();
      expect(component.subscribeToLangChange).toHaveBeenCalled();
    });

    it(`bindLang should be called in ngOnInit`, () => {
      spyOn(component, 'bindLang');
      component.ngOnInit();
      expect(component.bindLang).toHaveBeenCalled();
    });
  });

  describe('Routing', () => {
    it(`should be clicked and called routeToEvent method`, fakeAsync(() => {
      spyOn(component, 'routeToEvent');
      const button = fixture.debugElement.nativeElement.querySelector('button:nth-child(1)');
      button.click();
      tick();
      expect(component.routeToEvent).toHaveBeenCalled();
    }));

    it(`should navigate to events`, () => {
      component.routeToEvent();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/events', component.event.id]);
    });
  });

  describe('Filtering tags', () => {
    it('filterTags tags[1] should be active', () => {
      (component as any).filterTags([{ nameEn: 'Social', nameUa: 'Соціальний', id: 1 }]);
      expect(component.itemTags[1].isActive).toBeTruthy();
    });
  });

  describe('Initializing all statuses of even', () => {
    it(`should be initialized if user subscribed to the event`, () => {
      component.isJoined = component.event.isSubscribed ? true : false;
      expect(component.isJoined).toBe(true);
    });

    it(`should be initialized if event opened`, () => {
      component.isEventOpen = component.event.open;
      expect(component.isEventOpen).toBe(true);
    });

    it(`should be initialized if user is owner of the event`, () => {
      component.isOwner = Number(localStorageServiceMock.userIdBehaviourSubject) === Number(component.event.organizer.id);
      expect(component.isOwner).toBe(false);
    });

    it(`should be initialized if user is registered of the event`, () => {
      component.isRegistered = localStorageServiceMock.userIdBehaviourSubject ? true : false;
      expect(component.isOwner).toBe(true);
    });

    it(`should be initialized the event finished`, () => {
      component.isFinished = Date.parse(component.event.dates[0].finishDate) < Date.parse(new Date().toString());
      expect(component.isFinished).toBe(true);
    });

    it(`should be initialized the event rated is rated`, () => {
      component.isRated = component.rate ? true : false;
      expect(component.isRated).toBe(true);
    });
  });

  describe('Checking all statuses of event', () => {
    it('checkIsOwner should be called when event opened and not closed ', () => {
      component.isEventOpen = true;
      component.isFinished = false;
      component.isOwner = true;
      spyOn(component, 'checkIsOwner');
      if (component.isEventOpen && !component.isFinished) {
        component.checkIsOwner(component.isOwner);
      } else {
        if (component.isOwner) {
          component.nameBtn = 'event.btn-delete';
          component.styleBtn = 'secondary-global-button';
        } else {
          component.checkIsRate(component.isRated);
        }
      }
      expect(component.checkIsOwner).toHaveBeenCalled();
    });

    beforeEach(() => {
      component.isEventOpen = false;
      component.isFinished = true;
      component.isOwner = true;

      if (component.isEventOpen && !component.isFinished) {
        component.checkIsOwner(component.isOwner);
      } else {
        if (component.isOwner) {
          component.nameBtn = 'event.btn-delete';
          component.styleBtn = 'secondary-global-button';
        } else {
          component.checkIsRate(component.isRated);
        }
      }
    });

    it('should be changed name of button when event not opened and closed', () => {
      expect(component.nameBtn).toBe('event.btn-delete');
    });

    it('should be changed style of button when event not opened and closed ', () => {
      expect(component.styleBtn).toBe('secondary-global-button');
    });

    it('checkIsOwner should be called when event not opened and closed and not owner ', () => {
      component.isEventOpen = false;
      component.isFinished = true;
      component.isOwner = false;
      spyOn(component, 'checkIsRate');

      if (component.isEventOpen && !component.isFinished) {
        component.checkIsOwner(component.isOwner);
      } else {
        if (component.isOwner) {
          component.nameBtn = 'event.btn-delete';
          component.styleBtn = 'secondary-global-button';
        } else {
          component.checkIsRate(component.isRated);
        }
      }
      expect(component.checkIsRate).toHaveBeenCalled();
    });
  });

  describe('checkIsOwner', () => {
    it(`should be checked name of button if is the owner`, () => {
      component.checkIsOwner(true);
      expect(component.nameBtn).toBe('event.btn-edit');
    });

    it(`should be checked style of button if is the owner`, () => {
      component.checkIsOwner(true);
      expect(component.styleBtn).toBe('secondary-global-button');
    });

    it(`should be checked name of button if is not the owner`, () => {
      component.checkIsOwner(false);
      expect(component.nameBtn).toBe('event.btn-cancel');
    });

    it(`should be checked style of button if is not the owner`, () => {
      component.checkIsOwner(false);
      expect(component.styleBtn).toBe('secondary-global-button');
    });
  });

  describe('checkIsRate', () => {
    it(`should be checked name of button if is rated`, () => {
      component.checkIsRate(true);
      expect(component.nameBtn).toBe('event.btn-see');
    });

    it(`should be checked style of button if is rated`, () => {
      component.checkIsRate(true);
      expect(component.styleBtn).toBe('secondary-global-button');
    });

    it(`should be checked name of button if is not rated`, () => {
      component.checkIsRate(false);
      expect(component.nameBtn).toBe('event.btn-rate');
    });

    it(`should be checked style of button if is not rated`, () => {
      component.checkIsRate(false);
      expect(component.styleBtn).toBe('secondary-global-button');
    });

    it(`should be checked of button if is not rated`, () => {
      component.checkIsRate(false);
      expect(component.isJoinBtnHidden).toBe(true);
    });
  });

  describe('buttonAction', () => {
    it(`should be clicked and called buttonAction method`, fakeAsync(() => {
      spyOn(component, 'buttonAction');
      const button = fixture.debugElement.nativeElement.querySelector('button:nth-child(2)');
      button.click();
      tick();
      expect(component.buttonAction).toHaveBeenCalled();
    }));

    it(`should be set mode for editing`, () => {
      component.isRegistered = true;
      component.isEventOpen = true;
      component.isFinished = false;
      component.isOwner = true;
      component.buttonAction();
      expect(localStorageServiceMock.setEditMode).toHaveBeenCalled();
    });

    it(`should be set event for editing`, () => {
      component.isRegistered = true;
      component.isEventOpen = true;
      component.isFinished = false;
      component.isOwner = true;
      component.buttonAction();
      expect(localStorageServiceMock.setEventForEdit).toHaveBeenCalled();
    });

    it(`should navigate to create-event`, () => {
      component.isRegistered = true;
      component.isEventOpen = true;
      component.isFinished = false;
      component.isOwner = true;
      component.buttonAction();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['events/', 'create-event']);
    });
  });

  describe('actionIsJoined', () => {
    it(`should be changed name of button if user is joined`, () => {
      component.actionIsJoined(true);
      expect(component.nameBtn).toBe('event.btn-join');
    });

    it(`should be changed style of button if user is joined`, () => {
      component.actionIsJoined(true);
      expect(component.styleBtn).toBe('primary-global-button');
    });

    it(`should be changed isReadonly if user is  joined`, () => {
      component.actionIsJoined(true);
      expect(component.isReadonly).toBe(true);
    });

    it(`should be changed isJoined if user is joined`, () => {
      component.actionIsJoined(true);
      expect(component.isJoined).toBe(false);
    });

    it(`should be changed name of button if user is not joined`, () => {
      component.actionIsJoined(false);
      expect(component.nameBtn).toBe('event.btn-cancel');
    });

    it(`should be changed style of button if user is not joined`, () => {
      component.actionIsJoined(false);
      expect(component.styleBtn).toBe('secondary-global-button');
    });

    it(`should be changed isReadonly if user is not joined`, () => {
      component.actionIsJoined(false);
      expect(component.isReadonly).toBe(true);
    });

    it(`should be changed isJoined if user is not joined`, () => {
      component.actionIsJoined(false);
      expect(component.isJoined).toBe(true);
    });
  });

  it('should check weather title which length is shorter than 40 characters cut correctly', () => {
    component.event.title = 'title';
    expect(component.cutTitle()).toEqual('title');
  });

  it('should check weather title which length is longer than 30 characters cut correctly', () => {
    component.event.title = '40 characters long title has to be cut as it is to long';
    const newTitle = component.event.title.slice(0, 30) + '...';
    expect(component.cutTitle()).toEqual(newTitle);
  });

  it('should check weather description which length is shorter than 40 characters cut correctly', () => {
    component.event.description = 'description';
    expect(component.cutDescription()).toEqual('description');
  });

  it('should check weather description which length is longer than 90 characters cut correctly', () => {
    component.event.description = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dignissimos exercitationem fugiat incidunt';
    const newDescription = component.event.description.slice(0, 90) + '...';
    expect(component.cutDescription()).toEqual(newDescription);
  });

  describe('ngOnDestroy', () => {
    it('should unsubscribe of language change', () => {
      component.langChangeSub = of(true).subscribe();
      component.ngOnDestroy();
      expect(component.langChangeSub.closed).toBeTruthy();
    });
  });
});
