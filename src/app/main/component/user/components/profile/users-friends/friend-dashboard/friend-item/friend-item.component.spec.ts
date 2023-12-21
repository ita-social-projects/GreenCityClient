import { MatDialogModule } from '@angular/material/dialog';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { FriendItemComponent } from './friend-item.component';
import { MaxTextLengthPipe } from 'src/app/shared/max-text-length-pipe/max-text-length.pipe';
import { CorrectUnitPipe } from 'src/app/shared/correct-unit-pipe/correct-unit.pipe';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { Language } from 'src/app/main/i18n/Language';
import { of, BehaviorSubject } from 'rxjs';
import { MatTooltipModule } from '@angular/material/tooltip';

describe('FriendItemComponent', () => {
  let component: FriendItemComponent;
  let fixture: ComponentFixture<FriendItemComponent>;

  const localStorageServiceMock = jasmine.createSpyObj('localStorageService', [
    'languageBehaviourSubject',
    'getCurrentLanguage',
    'getUserId'
  ]);
  localStorageServiceMock.languageBehaviourSubject = new BehaviorSubject('ua');
  localStorageServiceMock.getCurrentLanguage = () => 'en' as Language;
  localStorageServiceMock.languageSubject = of('en');
  localStorageServiceMock.getUserId = () => 1;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FriendItemComponent, MaxTextLengthPipe, CorrectUnitPipe],
      imports: [TranslateModule.forRoot(), HttpClientTestingModule, MatDialogModule, RouterTestingModule.withRoutes([]), MatTooltipModule],
      providers: [{ provide: LocalStorageService, useValue: localStorageServiceMock }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FriendItemComponent);
    component = fixture.componentInstance;
    component.friend = {
      id: 1,
      name: 'Name',
      profilePicturePath: '',
      added: true,
      rating: 380,
      email: 'name@mail.com',
      friendStatus: 'FRIEND',
      chatId: 2
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getLangChange method onInit', () => {
    const spy = spyOn(component as any, 'getLangChange');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('it should call friendEvent on click', () => {
    const spy = spyOn(component.friendEventEmit, 'emit');
    component.friendEvent();
    expect(spy).toHaveBeenCalledWith(1);
  });

  it('it should call declineEvent on click', () => {
    const spy = spyOn(component.declineEvent, 'emit');
    component.declineFriend();
    expect(spy).toHaveBeenCalledWith(1);
  });

  it('should call checkButtons when target is a button', () => {
    const mockEvent: Partial<MouseEvent> = {
      target: document.createElement('button')
    };
    const spy = spyOn(component as any, 'checkButtons');

    component.clickHandler(mockEvent as MouseEvent);

    expect(spy).toHaveBeenCalled();
  });

  it('should call showMutualFriends when target is a span and userId is not set', () => {
    const mockEvent: Partial<MouseEvent> = {
      target: document.createElement('span')
    };
    component.userId = null;
    const spy = spyOn(component as any, 'showMutualFriends');

    component.clickHandler(mockEvent as MouseEvent);

    expect(spy).toHaveBeenCalled();
  });

  it('should call toUsersInfo when target is div', () => {
    const mockEvent: Partial<MouseEvent> = {
      target: document.createElement('div')
    };
    const spy = spyOn(component as any, 'toUsersInfo');

    component.clickHandler(mockEvent as MouseEvent);

    expect(spy).toHaveBeenCalled();
  });
});
