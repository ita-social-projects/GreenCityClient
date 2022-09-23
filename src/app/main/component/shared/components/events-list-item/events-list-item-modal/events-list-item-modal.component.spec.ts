import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { EventsListItemModalComponent } from './events-list-item-modal.component';
import { RatingModule } from 'ngx-bootstrap/rating';
import { BsModalRef, ModalModule } from 'ngx-bootstrap/modal';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatDialogModule } from '@angular/material/dialog';
import { of } from 'rxjs';
import { EventEmitter, Injectable } from '@angular/core';

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

  let translateServiceMock: TranslateService;
  translateServiceMock = jasmine.createSpyObj('TranslateService', ['setDefaultLang']);
  translateServiceMock.setDefaultLang = (lang: string) => of();
  translateServiceMock.get = () => of(true);

  const bsModalRefMock = jasmine.createSpyObj('bsModalRef', ['hide']);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EventsListItemModalComponent],
      providers: [
        { provide: Store, useValue: storeMock },
        { provide: BsModalRef, useValue: bsModalRefMock },
        { provide: TranslateService, useClass: TranslationServiceStub }
      ],
      imports: [RatingModule.forRoot(), ModalModule.forRoot(), MatDialogModule, TranslateModule.forRoot()]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventsListItemModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.isRegistered = false;
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
    beforeEach(fakeAsync(() => {
      spyOn(component, 'modalBtn');
      const button = fixture.debugElement.nativeElement.querySelector('button:nth-child(2)');
      tick();
      button.click();
    }));

    it(`should be called on click`, fakeAsync(() => {
      expect(component.modalBtn).toHaveBeenCalled();
    }));

    it(`should be clicked and closed modal`, fakeAsync(() => {
      const closeBtn = fixture.debugElement.nativeElement.querySelector('button:nth-child(1)');
      closeBtn.click();
      tick();
      expect(bsModalRefMock.hide).toHaveBeenCalled();
    }));

    it(`should be called on click and hide the previous modal`, fakeAsync(() => {
      bsModalRefMock.hide();
      expect(bsModalRefMock.hide).toHaveBeenCalled();
    }));

    it(`should be called on click and open the auth modal`, fakeAsync(() => {
      spyOn(component, 'openAuthModalWindow');
      component.openAuthModalWindow('sign-up');
      expect(component.openAuthModalWindow).toHaveBeenCalledTimes(1);
    }));

    it(`should be called on click and change the rating`, fakeAsync(() => {
      component.isRegistered = true;
      component.modalBtn();
      spyOn(component, 'onRateChange');
      component.onRateChange();
      expect(component.onRateChange).toHaveBeenCalledTimes(1);
    }));
  });

  it(`should be called on hover`, fakeAsync(() => {
    spyOn(component, 'hoveringOver');
    component.hoveringOver(1);
    expect(component.hoveringOver).toHaveBeenCalled();
  }));
});
