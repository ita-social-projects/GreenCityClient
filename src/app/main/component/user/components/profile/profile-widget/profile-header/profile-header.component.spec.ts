import { UserSharedModule } from './../../../shared/user-shared.module';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileHeaderComponent } from './profile-header.component';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ProfileProgressComponent } from '../profile-progress/profile-progress.component';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { BehaviorSubject, Subject } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ProfileHeaderComponent', () => {
  let component: ProfileHeaderComponent;
  let fixture: ComponentFixture<ProfileHeaderComponent>;
  let localStorageServiceMock: LocalStorageService;
  const mockId = 123;
  localStorageServiceMock = jasmine.createSpyObj('LocalStorageService', ['userIdBehaviourSubject']);
  localStorageServiceMock.userIdBehaviourSubject = new BehaviorSubject(1111);
  localStorageServiceMock.getUserId = () => mockId;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProfileHeaderComponent, ProfileProgressComponent],
      imports: [UserSharedModule, RouterTestingModule.withRoutes([]), HttpClientTestingModule],
      providers: [{ provide: LocalStorageService, useValue: localStorageServiceMock }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileHeaderComponent);
    component = fixture.componentInstance;
    component.userInfo = {
      city: 'Lviv',
      firstName: 'name',
      userCredo: 'credo',
      profilePicturePath: '',
      rating: 2,
      showEcoPlace: false,
      showLocation: false,
      showShoppingList: false,
      socialNetworks: [{ id: 220, url: 'http://instagram' }]
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
