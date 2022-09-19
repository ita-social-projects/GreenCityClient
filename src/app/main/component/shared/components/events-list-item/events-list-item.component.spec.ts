import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { BsModalService } from 'ngx-bootstrap/modal';
import { TagsArray } from '../../../events/models/event-consts';
import { Store } from '@ngrx/store';
import { EventsListItemComponent } from './events-list-item.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

describe('EventsListItemComponent', () => {
  let component: EventsListItemComponent;
  let fixture: ComponentFixture<EventsListItemComponent>;
  let translate: TranslateService;
  const routerSpy = { navigate: jasmine.createSpy('navigate') };

  const eventMock = {
    additionalImages: [],
    tags: [
      { id: 12, nameUa: 'Соціальний', nameEn: 'Social' },
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
    organizer: { id: 5, name: 'Mykola Kovalushun' },
    title: 'dddddddd',
    titleImage: 'https://-fc27f19b10e0apl',
    isSubscribed: true,
    open: true
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EventsListItemComponent],
      providers: [
        { provide: BsModalService, useValue: {} },
        { provide: Store, useValue: {} },
        { provide: Router, useValue: routerSpy },
      ],
      imports: [RouterTestingModule, MatDialogModule,
        TranslateModule.forRoot(),
      ],
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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`should navigate to events`, () => {
    component.routeToEvent();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/events', component.event.id]);
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

  it(`checkAllStatusesOfEvent should be called in ngOnInit`, () => {
    const checkAllStatusesOfEventSpy = spyOn(component, 'checkAllStatusesOfEvent');
    component.ngOnInit();
    expect(checkAllStatusesOfEventSpy).toHaveBeenCalled();
  });

  it(`should be initialized if user subscribed to the event`, () => {
    component.isJoined = component.event.isSubscribed ? true : false;
    expect(component.isJoined).toBe(true);
  });

  it(`should be initialized is an event finished`, () => {
    component.isFinished = Date.parse(component.event.dates[0].finishDate) < Date.parse(new Date().toString());
    expect(component.isFinished).toBe(true);
  });

  it(`should be initialized is an event rated`, () => {
    component.isRated = component.rate ? true : false;
    expect(component.isRated).toBe(false);
  });

  it(`should be initialized is owner of event`, () => {
    component.checkIsOwner(true);
    expect(component.nameBtn).toBe('event.btn-edit');
    expect(component.styleBtn).toBe('secondary-global-button');
  });

  it(`should be checked is not owner of event`, () => {
    component.checkIsOwner(false);
    expect(component.nameBtn).toBe('event.btn-cancel');
    expect(component.styleBtn).toBe('secondary-global-button');
  });

  it(`should be checked is rated of event`, () => {
    component.checkIsRate(true);
    expect(component.nameBtn).toBe('event.btn-see');
    expect(component.styleBtn).toBe('secondary-global-button');
  });

  it(`should be checked is not rated of event`, () => {
    component.checkIsRate(false);
    expect(component.disabledMode).toBe(false);
    expect(component.nameBtn).toBe('event.btn-rate');
    expect(component.styleBtn).toBe('primary-global-button');
  });
});
