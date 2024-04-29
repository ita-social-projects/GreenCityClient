import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { of, BehaviorSubject, Observable } from 'rxjs';
import { ProfileService } from '@global-user/components/profile/profile-service/profile.service';
import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { ProfileCardsComponent } from '@global-user/components';
import { CardModel } from '@user-models/card.model';

describe('ProfileCardsComponent', () => {
  let component: ProfileCardsComponent;
  let fixture: ComponentFixture<ProfileCardsComponent>;

  const cardModelMock: CardModel = { id: 1, content: 'Hello' };
  const profileServiceMock: ProfileService = jasmine.createSpyObj('ProfileService', ['getFactsOfTheDay']);
  profileServiceMock.getFactsOfTheDay = () => of(cardModelMock);

  const localStorageServiceMock: LocalStorageService = jasmine.createSpyObj('LocalStorageService', ['languageBehaviourSubject']);
  localStorageServiceMock.languageBehaviourSubject = new BehaviorSubject('ua');

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ProfileCardsComponent],
      imports: [TranslateModule.forRoot(), HttpClientModule],
      providers: [
        { provide: ProfileService, useValue: profileServiceMock },
        { provide: LocalStorageService, useValue: localStorageServiceMock }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get language', () => {
    let mockLang = null;
    (component as any).localStorageService.languageBehaviourSubject.subscribe((language) => (mockLang = language));
    expect(mockLang).toBe('ua');
  });

  it('should handle success in getFactOfTheDay', (done) => {
    profileServiceMock.getFactsOfTheDay = () => of(cardModelMock);
    component.getFactOfTheDay();
    setTimeout(() => {
      expect(component.factOfTheDay).toEqual(cardModelMock);
      expect(component.factOfTheDay.content).toBe('Hello');
      done();
    }, 0);
  });

  it('should handle error', () => {
    const errorResponse = new Error('Error message');
    profileServiceMock.getFactsOfTheDay = () => new Observable((subscriber) => subscriber.error(errorResponse));
    component.ngOnInit();
    expect(component.error).toBe(errorResponse);
  });
});
