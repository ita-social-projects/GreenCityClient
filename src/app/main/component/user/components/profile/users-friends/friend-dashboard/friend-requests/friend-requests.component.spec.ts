import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { TranslateModule } from '@ngx-translate/core';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { BehaviorSubject, of } from 'rxjs';
import { Store } from '@ngrx/store';
import { FriendRequestsComponent } from './friend-requests.component';
import { FRIENDS } from '@global-user/mocks/friends-mock';

describe('FriendRequestsComponent', () => {
  let component: FriendRequestsComponent;
  let fixture: ComponentFixture<FriendRequestsComponent>;
  const localStorageServiceMock: LocalStorageService = jasmine.createSpyObj('LocalStorageService', ['userIdBehaviourSubject']);
  localStorageServiceMock.userIdBehaviourSubject = new BehaviorSubject(1111);
  const storeMock = jasmine.createSpyObj('Store', ['select', 'dispatch']);
  storeMock.select.and.returnValue(of({ friendsList: FRIENDS }));

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [FriendRequestsComponent],
      imports: [TranslateModule.forRoot(), HttpClientTestingModule, RouterTestingModule.withRoutes([]), InfiniteScrollModule],
      providers: [
        { provide: LocalStorageService, useValue: localStorageServiceMock },
        { provide: Store, useValue: storeMock }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FriendRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get a user', () => {
    const initUserSpy = spyOn(component as any, 'initUser');
    component.ngOnInit();
    expect(initUserSpy).toHaveBeenCalledTimes(1);
    expect(component.scroll).toBeFalsy();
  });

  it('should set userId on initUser', () => {
    (component as any).initUser();
    expect(component.userId).toBe(1111);
  });
});
