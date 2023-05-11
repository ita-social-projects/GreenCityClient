import { Language } from './../../../../../i18n/Language';
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { EventsListItemModalComponent } from './events-list-item-modal.component';
import { RatingModule } from 'ngx-bootstrap/rating';
import { BsModalRef, ModalModule } from 'ngx-bootstrap/modal';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatDialogModule } from '@angular/material/dialog';
import { of, Subject } from 'rxjs';
import { EventEmitter, Injectable } from '@angular/core';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';

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

describe('EventsListItemModalComponent', () => {
  let component: EventsListItemModalComponent;
  let fixture: ComponentFixture<EventsListItemModalComponent>;

  const storeMock = jasmine.createSpyObj('store', ['dispatch']);
  const mockLang = 'ua';

  let translateServiceMock: TranslateService;
  translateServiceMock = jasmine.createSpyObj('TranslateService', ['setDefaultLang']);
  translateServiceMock.setDefaultLang = (lang: string) => of();
  translateServiceMock.get = () => of(true);

  let localStorageServiceMock: LocalStorageService;
  localStorageServiceMock = jasmine.createSpyObj('LocalStorageService', ['languageSubject', 'getCurrentLanguage']);
  localStorageServiceMock.languageSubject = new Subject();
  localStorageServiceMock.getCurrentLanguage = () => mockLang as Language;

  const bsModalRefMock = jasmine.createSpyObj('bsModalRef', ['hide']);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EventsListItemModalComponent],
      providers: [
        { provide: Store, useValue: storeMock },
        { provide: BsModalRef, useValue: bsModalRefMock },
        { provide: TranslateService, useClass: TranslationServiceStub },
        { provide: LocalStorageService, useValue: localStorageServiceMock }
      ],
      imports: [RatingModule.forRoot(), ModalModule.forRoot(), MatDialogModule, TranslateModule.forRoot()]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventsListItemModalComponent);
    component = fixture.componentInstance;
    component.text = '';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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
      expect(bsModalRefMock.hide).toHaveBeenCalled();
    }));

    it(`should be called on click and hide the previous modal`, () => {
      component.modalBtn();
      expect(bsModalRefMock.hide).toHaveBeenCalled();
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

    it(`should be called on click and change the rating`, fakeAsync(() => {
      component.isRegistered = true;
      spyOn(component, 'onRateChange');
      component.modalBtn();
      expect(component.onRateChange).toHaveBeenCalled();
    }));
  });

  describe('hoveringOver', () => {
    it(`should be called with parameter 1`, () => {
      spyOn(component, 'hoveringOver');
      component.hoveringOver(1);
      expect(component.hoveringOver).toHaveBeenCalledWith(1);
    });

    it(`should be called with parameter 0`, () => {
      spyOn(component, 'hoveringOver');
      component.hoveringOver(0);
      expect(component.hoveringOver).toHaveBeenCalledWith(0);
    });

    it(`should be set text by rating equal 1`, () => {
      component.hoveringOver(1);
      expect(component.text).toBe('event.text-1');
      expect(component.hover).toBe(true);
      expect(component.textByRate).toBe(' ');
    });

    it(`should be set text by rating equal 0`, () => {
      component.hoveringOver(0);
      expect(component.text).toBe(' ');
      expect(component.hover).toBe(false);
      expect(component.textByRate).toBe(' ');
    });
  });

  describe('onRateChange', () => {
    it(`should be set rating`, () => {
      storeMock.dispatch.calls.reset();
      component.onRateChange();
      expect(storeMock.dispatch).toHaveBeenCalledTimes(1);
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
