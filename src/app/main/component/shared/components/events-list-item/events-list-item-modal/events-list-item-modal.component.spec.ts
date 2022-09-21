import { async, ComponentFixture, TestBed } from '@angular/core/testing';
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

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EventsListItemModalComponent],
      providers: [
        { provide: Store, useValue: storeMock },
        { provide: BsModalRef, useValue: {} },
        { provide: TranslateService, useClass: TranslationServiceStub }
      ],
      imports: [RatingModule.forRoot(), ModalModule.forRoot(), MatDialogModule, TranslateModule.forRoot()]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventsListItemModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
