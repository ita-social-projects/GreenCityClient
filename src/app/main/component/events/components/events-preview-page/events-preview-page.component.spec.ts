import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EventsPreviewPageComponent } from './events-preview-page.component';
import { EventsService } from '../../services/events.service';
import { LanguageService } from '../../../../i18n/language.service';
import { of } from 'rxjs';
import { PagePreviewDTO } from '../../models/events.interface';
import { TranslateModule } from '@ngx-translate/core';
import { LocalStorageService } from '../../../../service/localstorage/local-storage.service';
import { CUSTOM_ELEMENTS_SCHEMA, Pipe, PipeTransform } from '@angular/core';

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

describe('EventsPreviewPageComponent', () => {
  let component: EventsPreviewPageComponent;
  let languageService: LanguageService;
  let eventsService: EventsService;
  let localStorageService: LocalStorageService;
  let fixture: ComponentFixture<EventsPreviewPageComponent>;

  languageService = jasmine.createSpyObj('LanguageService', ['getLangValue']);
  eventsService = jasmine.createSpyObj('EventsService', ['getForm']);
  localStorageService = jasmine.createSpyObj('LocalStorageService', ['firstNameBehaviourSubject']);

  const mockEvent: PagePreviewDTO = {
    title: 'Eco event',
    description: 'Event Description',
    open: true,
    eventDuration: 1,
    datesLocations: [
      {
        date: new Date(2020, 3, 1),
        startDate: 'string',
        finishDate: 'string',
        coordinates: {
          latitude: 5,
          longitude: 5
        },
        onlineLink: 'string',
        valid: true,
        check: true
      }
    ],
    tags: ['Social'],
    imgArray: [],
    location: {
      date: new Date(2020, 3, 1),
      finishDate: 'string',
      onlineLink: 'string',
      place: 'string',
      startDate: 'string'
    }
  };
  const mockUserName = 'Kateryna Kravchuk';

  const EventsServiceMock = jasmine.createSpyObj('eventservice', ['getForm']);
  EventsServiceMock.getForm = () => of(mockEvent);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EventsPreviewPageComponent, mockPipe({ name: 'dateLocalisation' }), mockPipe({ name: 'translate' })],
      imports: [TranslateModule.forRoot()],
      providers: [
        { provide: EventsService, useValue: EventsServiceMock },
        { provide: LanguageService, useValue: languageService },
        { provide: LocalStorageService, useValue: localStorageService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventsPreviewPageComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});
