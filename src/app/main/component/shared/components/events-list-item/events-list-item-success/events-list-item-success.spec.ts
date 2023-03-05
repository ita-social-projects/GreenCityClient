import { Language } from './../../../../../i18n/Language';
import { EventsListItemSuccessComponent } from './events-list-item-success';
import { BsModalRef, ModalModule } from 'ngx-bootstrap/modal';
import { Injectable, EventEmitter } from '@angular/core';
import { TestBed, async, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { of, Subject } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@Injectable()
class TranslationServiceStub {
  public onLangChange = new EventEmitter<any>();
  public onTranslationChange = new EventEmitter<any>();
  public onDefaultLangChange = new EventEmitter<any>();
  public addLangs(langs: string[]) {}
  public getLangs() {
    return 'en-us';
  }
  public getBrowserLang() {
    return '';
  }
  public getBrowserCultureLang() {
    return '';
  }
  public use(lang: string) {
    return '';
  }
  public get(key: any): any {
    return of(key);
  }
  public setDefaultLang() {
    return true;
  }
}
describe('EventsListItemSuccessComponent', () => {
  let component: EventsListItemSuccessComponent;
  let fixture: ComponentFixture<EventsListItemSuccessComponent>;

  const mockLang = 'ua';

  let translateServiceMock: TranslateService;
  translateServiceMock = jasmine.createSpyObj('TranslateService', ['setDefaultLang']);
  translateServiceMock.setDefaultLang = (lang: string) => of();
  translateServiceMock.get = () => of(true);

  let localStorageServiceMock: LocalStorageService;
  localStorageServiceMock = jasmine.createSpyObj('LocalStorageService', ['languageSubject', 'getCurrentLanguage']);
  localStorageServiceMock.languageSubject = new Subject();
  localStorageServiceMock.getCurrentLanguage = () => mockLang as Language;

  const MockBsModalRef = jasmine.createSpyObj('bsModalRef', ['hide']);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EventsListItemSuccessComponent],
      providers: [
        { provide: BsModalRef, useValue: MockBsModalRef },
        { provide: TranslateService, useClass: TranslationServiceStub },
        { provide: LocalStorageService, useValue: localStorageServiceMock }
      ],
      imports: [MatDialogModule, TranslateModule.forRoot(), ModalModule.forRoot(), BrowserAnimationsModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventsListItemSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('modalBtn', () => {
    it(`should be called on click`, fakeAsync(() => {
      spyOn(component, 'modalBtn');
      const button = fixture.debugElement.nativeElement.querySelector('button:nth-child(2)');
      button.click();
      tick();
      expect(component.modalBtn).toHaveBeenCalled();
    }));

    it(`should be clicked and closed modal`, fakeAsync(() => {
      const closeBtn = fixture.debugElement.nativeElement.querySelector('button:nth-child(1)');
      closeBtn.click();
      tick();
      expect(MockBsModalRef.hide).toHaveBeenCalled();
    }));

    it(`should be called on click and hide the previous modal`, () => {
      component.modalBtn();
      expect(MockBsModalRef.hide).toHaveBeenCalled();
    });

    it(`should be called on click and open the auth modal`, () => {
      component.isRegistered = false;
      spyOn(component, 'openAuthModalWindow').withArgs('sign-in');
      jasmine.clock().install();
      component.modalBtn();
      jasmine.clock().tick(500);
      expect(component.openAuthModalWindow).toHaveBeenCalled();
      jasmine.clock().uninstall();
    });
  });

  describe('ngOnInit', () => {
    it(`subscribeToLangChange should be called in ngOnInit`, () => {
      const subscribeToLangChangeSpy = spyOn(component, 'subscribeToLangChange');
      component.ngOnInit();
      expect(subscribeToLangChangeSpy).toHaveBeenCalled();
    });

    it(`bindLang should be called in ngOnInit`, () => {
      const bindLangSpy = spyOn(component, 'subscribeToLangChange');
      component.ngOnInit();
      expect(bindLangSpy).toHaveBeenCalled();
    });
  });

  describe('ngOnDestroy', () => {
    it('should unsubscribe of language change', () => {
      component.langChangeSub = of(true).subscribe();
      component.ngOnDestroy();
      expect(component.langChangeSub.closed).toBeTruthy();
    });
  });
});
