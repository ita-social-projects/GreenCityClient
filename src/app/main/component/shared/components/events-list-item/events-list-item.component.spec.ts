import { HttpClient } from '@angular/common/http';
import { HttpLoaderFactory } from '@global-user/components/shared/user-shared.module';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { BsModalService } from 'ngx-bootstrap/modal';
import { TagsArray } from '../../../events/models/event-consts';
import { Store } from '@ngrx/store';
import { EventsListItemComponent } from './events-list-item.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

fdescribe('EventsListItemComponent', () => {
  let component: EventsListItemComponent;
  let fixture: ComponentFixture<EventsListItemComponent>;
  let modalService: BsModalService;
  let translate: TranslateService;


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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
