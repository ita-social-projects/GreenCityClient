import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { EventDetailsComponent } from './event-details.component';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { EventsService } from '../../services/events.service';
import { ActivatedRoute } from '@angular/router';

describe('EventDetailsComponent', () => {
  let component: EventDetailsComponent;
  let fixture: ComponentFixture<EventDetailsComponent>;

  const MockReqest = {
    additionalImages: [],
    coordinates: {
      latitude: 0,
      longitude: 0
    },
    dates: [],
    description: 'description',
    id: 1,
    onlineLink: 'link',
    open: true,
    organizer: {
      id: 1,
      name: 'John'
    },
    tags: [{ nameEn: 'Environmental', nameUa: 'Екологічний', id: 1 }],
    title: 'title',
    titleImage: ''
  };

  const EventsServiceMock = jasmine.createSpyObj('EventsService', ['getEventById ']);
  EventsServiceMock.getEventById = () => of(MockReqest);

  const activatedRouteMock = {
    snapshot: {
      params: {
        id: 2
      }
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule],
      declarations: [EventDetailsComponent],
      providers: [
        { provide: EventsService, useValue: EventsServiceMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit tags.length shoud be 3', () => {
    component.tags = [];
    component.ngOnInit();
    expect(component.tags.length).toBe(3);
  });

  it('filterTags tags[1] should be active', () => {
    (component as any).filterTags([{ nameEn: 'Social', nameUa: 'Соціальний', id: 1 }]);
    expect(component.tags[1].isActive).toBeTruthy();
  });

  it('setNewsId eventId should be 2', () => {
    (component as any).eventId = 0;
    (component as any).setNewsId();
    expect((component as any).eventId).toBe(2);
  });

  it('selectImage sliderIndex should be 1 ', () => {
    component.selectImage(1);
    expect(component.sliderIndex).toBe(1);
  });

  it('moveRight sliderIndex should be 1', () => {
    component.imagesSlider = ['1', '2'];
    component.sliderIndex = 0;
    component.moveRight();
    expect(component.sliderIndex).toBe(1);
  });

  it('moveRight sliderIndex should be 0', () => {
    component.imagesSlider = ['1', '2', '3'];
    component.sliderIndex = 2;
    component.moveRight();
    expect(component.sliderIndex).toBe(0);
  });

  it('moveLeft sliderIndex should be 1', () => {
    component.imagesSlider = ['1', '2'];
    component.sliderIndex = 0;
    component.moveLeft();
    expect(component.sliderIndex).toBe(1);
  });

  it('moveLeft sliderIndex should be 2 ', () => {
    component.imagesSlider = ['1', '2', '3', '4'];
    component.sliderIndex = 3;
    component.moveLeft();
    expect(component.sliderIndex).toBe(2);
  });
});
