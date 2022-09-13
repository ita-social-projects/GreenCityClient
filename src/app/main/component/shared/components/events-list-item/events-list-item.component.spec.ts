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

fdescribe('EventsListItemComponent', () => {
  let component: EventsListItemComponent;
  let fixture: ComponentFixture<EventsListItemComponent>;
  let translate: TranslateService;
  let routerSpy = { navigate: jasmine.createSpy('navigate') };
  const eventMock = {
    additionalImages: [],
    tags: [{ nameEn: 'Environmental', nameUa: 'Екологічний', id: 1 }],
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
    titleImage: 'https://-fc27f19b10e0apl'
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EventsListItemComponent],
      providers: [
        { provide: BsModalService, useValue: {} },
        { provide: Store, useValue: {} },
        { provide: Router, useValue: routerSpy },
      ],
      imports: [
        RouterTestingModule, MatDialogModule, TranslateModule.forRoot()
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
});
