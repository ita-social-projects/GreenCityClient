import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { BehaviorSubject, of, Subscription, throwError } from 'rxjs';
import { ProfileService } from '@global-user/components/profile/profile-service/profile.service';
import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ProfileCardsComponent } from '@global-user/components';
import { FactOfTheDay } from '@global-user/models/factOfTheDay';

describe('ProfileCardsComponent', () => {
  let component: ProfileCardsComponent;
  let fixture: ComponentFixture<ProfileCardsComponent>;
  let profileServiceMock: jasmine.SpyObj<ProfileService>;
  let localStorageService: LocalStorageService;

  const factOfTheDayMock: FactOfTheDay = { id: 1, content: 'Hello' };

  beforeEach(waitForAsync(() => {
    profileServiceMock = jasmine.createSpyObj<ProfileService>('ProfileService', ['getRandomFactOfTheDay']);

    TestBed.configureTestingModule({
      declarations: [ProfileCardsComponent],
      imports: [HttpClientModule],
      providers: [
        { provide: ProfileService, useValue: profileServiceMock },
        { provide: LocalStorageService, useValue: { languageBehaviourSubject: new BehaviorSubject('ua') } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileCardsComponent);
    component = fixture.componentInstance;
    localStorageService = TestBed.inject(LocalStorageService);
    component.profileSubscription = new Subscription();
    component.languageSubscription = new Subscription();
  }));

  afterEach(() => {
    fixture = null;
  });

  afterAll(() => {
    TestBed.resetTestingModule();
    fixture?.destroy();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should get fact of the day on language change', () => {
    const languageSubject = new BehaviorSubject<string>('ua');
    spyOn(localStorageService.languageBehaviourSubject, 'subscribe').and.callThrough();
    spyOn(component, 'getFactOfTheDay').and.callThrough();
    fixture.detectChanges();

    expect(localStorageService.languageBehaviourSubject.subscribe).toHaveBeenCalled();
    expect(component.getFactOfTheDay).toHaveBeenCalled();

    languageSubject.next('en');
    fixture.detectChanges();

    expect(localStorageService.languageBehaviourSubject.subscribe).toHaveBeenCalledTimes(1);
    expect(component.getFactOfTheDay).toHaveBeenCalledTimes(1);
  });

  it('should set factOfTheDay on successful', () => {
    profileServiceMock.getRandomFactOfTheDay.and.returnValue(of(factOfTheDayMock));
    component.ngOnInit();

    expect(component.factOfTheDay).toEqual(factOfTheDayMock);
    expect(component.error).toBeUndefined();
  });

  it('should handle success in getFactOfTheDay', () => {
    profileServiceMock.getRandomFactOfTheDay.and.returnValue(of(factOfTheDayMock));
    component.getFactOfTheDay();

    expect(component.factOfTheDay).toEqual(factOfTheDayMock);
    expect(component.error).toBeUndefined();
  });

  it('should handle error', () => {
    const errorMessage = 'Error message';
    const errorResponse = new Error(errorMessage);
    profileServiceMock.getRandomFactOfTheDay.and.returnValue(throwError(() => errorResponse.message));
    component.ngOnInit();

    expect(component.error).toEqual(errorMessage);
  });

  it('should unsubscribe from subscriptions on component destroy', () => {
    component.profileSubscription = new Subscription();
    component.languageSubscription = new Subscription();
    spyOn(component.profileSubscription, 'unsubscribe');
    spyOn(component.languageSubscription, 'unsubscribe');
    component.ngOnDestroy();

    if (component.profileSubscription) {
      expect(component.profileSubscription.unsubscribe).toHaveBeenCalled();
    }
    if (component.languageSubscription) {
      expect(component.languageSubscription.unsubscribe).toHaveBeenCalled();
    }
  });
});
