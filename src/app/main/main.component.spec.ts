import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MainComponent } from './main.component';
import { TitleAndMetaTagsService } from './service/title-meta-tags/title-and-meta-tags.service';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { UserService } from '@global-service/user/user.service';
import { UserOwnAuthService } from '@global-service/auth/user-own-auth.service';
import { ChangeDetectorRef, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

class MockTitleAndMetaTagsService {
  useTitleMetasData() {}
}

class MockLocalStorageService {
  setUbsRegistration(value: boolean) {}
}

class MockUserService {
  updateLastTimeActivity() {}
}

class MockUserOwnAuthService {
  isLoginUserSubject = new BehaviorSubject<boolean>(false);
}
class MockTranslateService {
  get(key: any): any {
    return key;
  }
  instant(key: any): any {
    return key;
  }
}

describe('MainComponent', () => {
  let component: MainComponent;
  let fixture: ComponentFixture<MainComponent>;
  let router: Router;
  let localStorageService: MockLocalStorageService;
  let userService: MockUserService;
  let titleAndMetaTagsService: MockTitleAndMetaTagsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MainComponent],
      imports: [RouterTestingModule, TranslateModule.forRoot()],
      providers: [
        { provide: TranslateService, useClass: MockTranslateService },
        { provide: TitleAndMetaTagsService, useClass: MockTitleAndMetaTagsService },
        { provide: LocalStorageService, useClass: MockLocalStorageService },
        { provide: UserService, useClass: MockUserService },
        { provide: UserOwnAuthService, useClass: MockUserOwnAuthService },
        { provide: ChangeDetectorRef, useValue: { detectChanges: jasmine.createSpy() } }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(MainComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    localStorageService = TestBed.inject(LocalStorageService);
    userService = TestBed.inject(UserService);
    titleAndMetaTagsService = TestBed.inject(TitleAndMetaTagsService);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('constructor', () => {
    it('should instantiate dependencies', () => {
      expect(component['titleAndMetaTagsService']).toBeDefined();
      expect(component.router).toBeDefined();
      expect(component['localStorageService']).toBeDefined();
      expect(component['userService']).toBeDefined();
      expect(component['userOwnAuthService']).toBeDefined();
    });
  });

  describe('HostListener: onExitHandler', () => {
    it('should call updateLastTimeActivity on window:beforeunload', () => {
      spyOn(userService, 'updateLastTimeActivity');
      component.onExitHandler();
      expect(userService.updateLastTimeActivity).toHaveBeenCalled();
    });
  });

  describe('ngOnInit', () => {
    it('should set isUBS and isUnsubscribe based on router.url', () => {
      spyOnProperty(router, 'url', 'get').and.returnValue('/ubs/some-path');
      component.ngOnInit();
      expect(component.isUBS).toBeTrue();
      expect(component.isUnsubscribe).toBeFalse();
    });

    it('should call setUbsRegistration with the correct value', () => {
      spyOn(localStorageService, 'setUbsRegistration');
      spyOnProperty(router, 'url', 'get').and.returnValue('/ubs/some-path');
      component.ngOnInit();
      expect(localStorageService.setUbsRegistration).toHaveBeenCalledWith(true);
    });

    it('should call useTitleMetasData', () => {
      spyOn(titleAndMetaTagsService, 'useTitleMetasData');
      component.ngOnInit();
      expect(titleAndMetaTagsService.useTitleMetasData).toHaveBeenCalled();
    });

    it('should call navigateToStartingPositionOnPage', () => {
      spyOn(component, 'navigateToStartingPositionOnPage');
      component.ngOnInit();
      expect(component.navigateToStartingPositionOnPage).toHaveBeenCalled();
    });

    it('should call checkLogin', () => {
      spyOn(component, 'checkLogin');
      component.ngOnInit();
      expect(component.checkLogin).toHaveBeenCalled();
    });
  });

});
