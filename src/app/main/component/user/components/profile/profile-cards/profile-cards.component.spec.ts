import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { ProfileService } from '@global-user/components/profile/profile-service/profile.service';
import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ProfileCardsComponent } from '@global-user/components';
import { FactOfTheDay } from '@global-user/models/factOfTheDay';
import { ProfileStatistics } from '@global-user/models/profile-statistiscs';
import { TranslateModule } from '@ngx-translate/core';

describe('ProfileCardsComponent', () => {
  let component: ProfileCardsComponent;
  let fixture: ComponentFixture<ProfileCardsComponent>;
  let profileServiceMock: jasmine.SpyObj<ProfileService>;
  let localStorageServiceMock: jasmine.SpyObj<LocalStorageService>;
  let languageSubject: BehaviorSubject<string>;

  const factOfTheDayMock: FactOfTheDay = { id: 1, content: 'Hello' };
  const profileStatisticsMock: ProfileStatistics = {
    amountHabitsInProgress: 1,
    amountHabitsAcquired: 0,
    amountPublishedNews: 0,
    amountOrganizedAndAttendedEvents: 0
  };

  beforeEach(waitForAsync(() => {
    profileServiceMock = jasmine.createSpyObj('ProfileService', [
      'getRandomFactOfTheDay',
      'getUserProfileStatistics',
      'getFactsOfTheDayByTags'
    ]);

    profileServiceMock.getRandomFactOfTheDay.and.returnValue(of(factOfTheDayMock));
    profileServiceMock.getUserProfileStatistics.and.returnValue(of(profileStatisticsMock));
    profileServiceMock.getFactsOfTheDayByTags.and.returnValue(of(factOfTheDayMock));

    localStorageServiceMock = jasmine.createSpyObj('LocalStorageService', [
      'getHabitFactFromLocalStorage',
      'clearHabitFactFromLocalStorage',
      'saveHabitFactToLocalStorage'
    ]);

    languageSubject = new BehaviorSubject<string>('ua');
    localStorageServiceMock.languageBehaviourSubject = languageSubject;

    TestBed.configureTestingModule({
      declarations: [ProfileCardsComponent],
      imports: [HttpClientModule, TranslateModule.forRoot()],
      providers: [
        { provide: ProfileService, useValue: profileServiceMock },
        { provide: LocalStorageService, useValue: localStorageServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileCardsComponent);
    component = fixture.componentInstance;
  }));

  afterEach(() => {
    fixture.destroy();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should get fact of the day on language change', () => {
    spyOn(component, 'getFactOfTheDay').and.callThrough();
    fixture.detectChanges();

    expect(component.getFactOfTheDay).toHaveBeenCalled();

    languageSubject.next('en');
    fixture.detectChanges();

    expect(component.getFactOfTheDay).toHaveBeenCalledTimes(2);
  });

  it('should set factOfTheDay on successful response', () => {
    profileServiceMock.getRandomFactOfTheDay.and.returnValue(of(factOfTheDayMock));
    component.ngOnInit();

    expect(component.factOfTheDay).toEqual(factOfTheDayMock);
    expect(component.error).toBeUndefined();
  });

  it('should handle error in getFactOfTheDay', () => {
    const errorMessage = 'Error occurred';
    profileServiceMock.getRandomFactOfTheDay.and.returnValue(throwError(() => new Error(errorMessage)));

    component.getFactOfTheDay();

    expect(component.error).toBe(errorMessage);
    expect(component.factOfTheDay).toBeUndefined();
  });

  it('should load habit fact from local storage', () => {
    localStorageServiceMock.getHabitFactFromLocalStorage.and.returnValue(factOfTheDayMock);

    component.loadHabitFactFromLocalStorage();

    expect(component.habitFactOfTheDay).toEqual(factOfTheDayMock);
  });

  it('should update habit fact if more than one day has passed', () => {
    const profileStatisticsMock: ProfileStatistics = {
      amountHabitsInProgress: 1,
      amountHabitsAcquired: 0,
      amountPublishedNews: 0,
      amountOrganizedAndAttendedEvents: 0
    };

    profileServiceMock.getUserProfileStatistics.and.returnValue(of(profileStatisticsMock));

    spyOn(component, 'updateHabitFactIfNeeded').and.callThrough();

    component.checkAndUpdateHabitFact();

    expect(component.updateHabitFactIfNeeded).toHaveBeenCalled();
  });

  it('should unsubscribe from observables on destroy', () => {
    spyOn(component['destroy$'], 'next').and.callThrough();
    spyOn(component['destroy$'], 'complete').and.callThrough();

    component.ngOnDestroy();

    expect(component['destroy$'].next).toHaveBeenCalled();
    expect(component['destroy$'].complete).toHaveBeenCalled();
  });
});
