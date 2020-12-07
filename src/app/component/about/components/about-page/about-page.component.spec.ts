import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { Language } from '@language-service/Language';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, of, Subject } from 'rxjs';

import { AboutPageComponent } from './about-page.component';

describe('AboutPageComponent', () => {
  let component: AboutPageComponent;
  let fixture: ComponentFixture<AboutPageComponent>;
  const routerSpy = { navigate: jasmine.createSpy('navigate') };
  const mockLang = 'ru';

  let translateServiceMock: TranslateService;
  translateServiceMock = jasmine.createSpyObj('TranslateService', ['setDefaultLang']);
  translateServiceMock.setDefaultLang = (lang: string) => of ();
  let localStorageServiceMock: LocalStorageService;
  localStorageServiceMock = jasmine.createSpyObj('LocalStorageService', ['userIdBehaviourSubject']);
  localStorageServiceMock.userIdBehaviourSubject = new BehaviorSubject(1111);
  localStorageServiceMock = jasmine.createSpyObj('LocalStorageService', ['languageSubject']);
  localStorageServiceMock.languageSubject = new Subject();
  localStorageServiceMock = jasmine.createSpyObj('LocalStorageService', ['getCurrentLanguage']);
  localStorageServiceMock.getCurrentLanguage = () => mockLang as Language;



  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AboutPageComponent ],
      imports: [RouterTestingModule.withRoutes([]), TranslateModule.forRoot()],
      providers: [{provide: LocalStorageService, useValue: localStorageServiceMock},
                  {provide: TranslateService, useValue: translateServiceMock}],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create',  () => {
    expect(component).toBeTruthy();
  });

  afterEach(() => {
    spyOn(component, 'ngOnDestroy').and.callFake(() => { });
    fixture.destroy();
  });

  // it ('ngOnInit should called subscribeToLangChange method one time', () => {
  //   const subscribeToLangChangeSpy = spyOn(component as any, 'subscribeToLangChange');
  //   component.ngOnInit();
  //   expect(subscribeToLangChangeSpy).toHaveBeenCalledTimes(1);
  // });

  // it('should get userId', () => {
  //   expect(localStorageServiceMock.userIdBehaviourSubject.value).toBe(1111);
  // });

  // it('should redirect to profile page', () => {
  //   fixture.ngZone.run(() => {
  //     component.navigateToHabit();
  //     fixture.whenStable().then(() => {
  //       expect(routerSpy.navigate).toBeDefined();
  //     });
  //   });
  // });
});
