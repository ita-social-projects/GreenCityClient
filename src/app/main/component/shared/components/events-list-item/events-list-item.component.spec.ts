import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { BsModalService } from 'ngx-bootstrap/modal';
import { TagsArray } from '../../../events/models/event-consts';
import { Store } from '@ngrx/store';
import { EventsListItemComponent } from './events-list-item.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { of } from 'rxjs/internal/observable/of';
import { EventsService } from '../../../events/services/events.service';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { RatingModule } from 'ngx-bootstrap/rating';
import { Subject } from 'rxjs';

describe('EventsListItemComponent', () => {
  let component: EventsListItemComponent;
  let fixture: ComponentFixture<EventsListItemComponent>;
  let translate: TranslateService;

  const eventMock = {
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

  const routerSpy = { navigate: jasmine.createSpy('navigate') };
  const storeMock = jasmine.createSpyObj('store', ['dispatch']);

  const EventsServiceMock = jasmine.createSpyObj('EventsService', ['getEventById ', 'deleteEvent']);
  EventsServiceMock.getEventById = () => of(eventMock);
  EventsServiceMock.deleteEvent = () => of(true);

  const LocalStorageServiceMock = jasmine.createSpyObj('LocalStorageService', [
    'getCurrentLanguage',
    'setEditMode',
    'setEventForEdit',
    'getUserId',
    'languageSubject'
  ]);
  LocalStorageServiceMock.getCurrentLanguage = () => of('en');
  LocalStorageServiceMock.languageSubject = new Subject();
  LocalStorageServiceMock.getUserId = () => of(5);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EventsListItemComponent],
      providers: [
        { provide: BsModalService, useValue: {} },
        { provide: Store, useValue: storeMock },
        { provide: Router, useValue: routerSpy },
        { provide: EventsService, useValue: EventsServiceMock },
        { provide: LocalStorageService, useValue: LocalStorageServiceMock }
      ],
      imports: [RouterTestingModule, MatDialogModule, TranslateModule.forRoot(), RatingModule.forRoot()],
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
    component.disabledMode = false;
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
      const filterTagsSpy = spyOn(component, 'filterTags');
      component.ngOnInit();
      expect(filterTagsSpy).toHaveBeenCalled();
    });

    it(`initAllStatusesOfEvent should be called in ngOnInit`, () => {
      const initAllStatusesOfEventSpy = spyOn(component, 'initAllStatusesOfEvent');
      component.ngOnInit();
      expect(initAllStatusesOfEventSpy).toHaveBeenCalled();
    });

    it(`rate should be called in ngOnInit`, () => {
      component.ngOnInit();
      component.rate = Math.round(component.event.organizer.organizerRating);
      expect(component.rate).toBe(3);
    });

    it(`checkAllStatusesOfEvent should be called in ngOnInit`, () => {
      const checkAllStatusesOfEventSpy = spyOn(component, 'checkAllStatusesOfEvent');
      component.ngOnInit();
      expect(checkAllStatusesOfEventSpy).toHaveBeenCalled();
    });

    it(`subscribeToLangChange should be called in ngOnInit`, () => {
      const subscribeToLangChangeSpy = spyOn(component, 'subscribeToLangChange');
      component.ngOnInit();
      expect(subscribeToLangChangeSpy).toHaveBeenCalled();
    });

    it(`bindLang should be called in ngOnInit`, () => {
      const bindLangSpy = spyOn(component, 'subscribeToLangChange');
      component.ngOnInit();
      expect(bindLangSpy).toHaveBeenCalled();
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
      component.isOwner = LocalStorageServiceMock.getUserId === component.event.organizer.id;
      expect(component.isOwner).toBe(false);
    });

    it(`should be initialized if user is registered of the event`, () => {
      component.isRegistered = LocalStorageServiceMock.getUserId ? true : false;
      expect(component.isOwner).toBe(false);
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

    it(`should be checked disabledMode of button if is not rated`, () => {
      component.checkIsRate(false);
      expect(component.disabledMode).toBe(false);
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
});
