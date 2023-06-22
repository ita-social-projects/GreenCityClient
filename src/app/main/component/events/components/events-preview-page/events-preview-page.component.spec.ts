import { EventsPreviewPageComponent } from './events-preview-page.component';
import { EventsService } from '../../services/events.service';
import { LanguageService } from '../../../../i18n/language.service';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';

describe('EventsPreviewPageComponent', () => {
  let component: EventsPreviewPageComponent;
  let languageService: LanguageService;
  let eventsService: EventsService;
  let localStorageService: LocalStorageService;

  beforeEach(() => {
    languageService = jasmine.createSpyObj('LanguageService', ['getLangValue']);
    eventsService = jasmine.createSpyObj('EventsService', ['getForm']);
    localStorageService = jasmine.createSpyObj('LocalStorageService', ['firstNameBehaviourSubject']);

    component = new EventsPreviewPageComponent(localStorageService, languageService, eventsService);
  });

  afterEach(() => {
    // Cleanup or restore any mocks used in the tests
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize event and other properties on ngOnInit', () => {
    const mockEvent = { datesLocations: [{ date: '2023-06-22' }] };
    const mockDate = new Date(mockEvent.datesLocations[0].date).toDateString();
    const mockUserName = 'John Doe';

    // Mocking the behavior of the services
    eventsService.getForm.and.returnValue(mockEvent);
    localStorageService.firstNameBehaviourSubject = jasmine.createSpyObj('BehaviorSubject', ['subscribe']);
    localStorageService.firstNameBehaviourSubject.subscribe.and.callFake((callback) => callback(mockUserName));

    component.ngOnInit();

    expect(component.event).toBe(mockEvent);
    expect(component.date).toBe(mockDate);
    expect(component.userName).toBe(mockUserName);
  });

  it('should call getLangValue method of LanguageService with correct parameters', () => {
    const uaValue = 'uaValue';
    const enValue = 'enValue';
    const expectedReturnValue = 'translatedValue';

    languageService.getLangValue.and.returnValue(expectedReturnValue);

    const returnValue = component.getLangValue(uaValue, enValue);

    expect(languageService.getLangValue).toHaveBeenCalledWith(uaValue, enValue);
    expect(returnValue).toBe(expectedReturnValue);
  });
});
