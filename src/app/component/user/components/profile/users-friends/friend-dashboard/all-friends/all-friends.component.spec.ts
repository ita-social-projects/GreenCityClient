import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material';
import { RouterTestingModule } from '@angular/router/testing';
import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { UserFriendsService } from '@global-user/services/user-friends.service';
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AllFriendsComponent } from './all-friends.component';

fdescribe('AllFriendsComponent', () => {
  let component: AllFriendsComponent;
  let fixture: ComponentFixture<AllFriendsComponent>;
  let MatSnackBarMock: MatSnackBarComponent;
  MatSnackBarMock = jasmine.createSpyObj('MatSnackBarComponent', ['openSnackBar']);
  MatSnackBarMock.openSnackBar = (type: string) =>  { };
  let localStorageServiceMock: LocalStorageService;
  localStorageServiceMock = jasmine.createSpyObj('LocalStorageService', ['userIdBehaviourSubject']);
  localStorageServiceMock.userIdBehaviourSubject = new BehaviorSubject(1111);
  let userFriendsServiceMock: UserFriendsService;
  const userFriends = {
    totalElements:1,
    totalPages: 1,
    currentPage: 1,
    page: [
      {
       id: 1,
       name: 'Name',
       profilePicture: '',
       added: false
      },
      {
        id: 2,
        name: 'Name2',
        profilePicture: '',
        added: false
       },
     ]
    }
    userFriendsServiceMock = jasmine.createSpyObj('UserFriendsService', ['getAllFriends', 'deleteFriend', 'addFriend']);
    userFriendsServiceMock.getAllFriends = () => (of(userFriends));
    userFriendsServiceMock.deleteFriend = (idUser, idFriend) => (of());


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllFriendsComponent ],
      imports: [
        TranslateModule.forRoot(),
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([]),
        MatSnackBarModule
      ],
      providers: [
        { provide: MatSnackBarComponent, useValue: MatSnackBarMock },
        {provide: LocalStorageService, useValue: localStorageServiceMock},
        {provide: UserFriendsService, useValue: userFriendsServiceMock},
      ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllFriendsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get userId', () => {
    expect(localStorageServiceMock.userIdBehaviourSubject.value).toBe(1111);
  });

  it('should get a user', () => {
    const initUserSpy = spyOn(component as any, 'initUser');
    component.ngOnInit();
    expect(initUserSpy).toHaveBeenCalledTimes(1);
    });

  it('should get a user\'s', () => {
    const getUsersFriendsSpy = spyOn(component as any, 'getAllFriends');
    component.ngOnInit();
    expect(getUsersFriendsSpy).toHaveBeenCalledTimes(1);
  });

  it('should change status a friend\'s', () => {
    const changeStatusSpy = spyOn(component as any, 'changeStatus');
    component.changeStatus(1, userFriends.page);
    expect(changeStatusSpy).toHaveBeenCalledWith(1, userFriends.page);
  });

  it('should get a friend\'s array', () => {
    const addStatusSpy = spyOn(component as any, 'addStatus');
    component.addStatus(userFriends.page);
    expect(addStatusSpy).toHaveBeenCalledWith(userFriends.page);
    });

  it('should set message to error message', () => {
    const error = 'Error message';
    spyOn( userFriendsServiceMock, 'getAllFriends').and.returnValue(throwError(new Error(error)));
    component.getAllFriends();
    expect(component.Friends).toBeTruthy();
  });

  it('should delete user', () => {
    let id = 12;
    const spy = spyOn(component as any, 'deleteFriend');
    component.deleteFriend(id);
    expect(spy).toHaveBeenCalledWith(12);
  });
});
