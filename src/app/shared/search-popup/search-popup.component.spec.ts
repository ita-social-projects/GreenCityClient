import { Language } from '../../main/i18n/Language';

import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { SearchPopupComponent } from './search-popup.component';
import { RouterTestingModule } from '@angular/router/testing';
import { SearchItemComponent } from '../search-item/search-item.component';
import { SearchNotFoundComponent } from '../search-not-found/search-not-found.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { SearchService } from '@global-service/search/search.service';
import { of, Subject } from 'rxjs';
import { NgxPageScrollModule } from 'ngx-page-scroll';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LocalStorageService } from '@global-service/localstorage/local-storage.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('SearchPopupComponent', () => {
  let component: SearchPopupComponent;
  let fixture: ComponentFixture<SearchPopupComponent>;
  const matSnackBarMock: MatSnackBar = jasmine.createSpyObj('MatSnackBar', ['open']);
  const localStorageServiceMock: LocalStorageService = jasmine.createSpyObj('LocalStorageService', ['getCurrentLanguage']);
  localStorageServiceMock.getCurrentLanguage = () => 'ua' as Language;

  const mockTipData = {
    id: 1,
    title: 'test',
    author: {
      id: 1,
      name: 'test'
    },
    creationDate: '0101',
    tags: ['test']
  };

  const mockNewsData = {
    id: 1,
    title: 'test',
    author: {
      id: 1,
      name: 'test'
    },
    creationDate: '0101',
    tags: ['test']
  };

  const mockEventsData = {
    id: 1,
    title: 'test',
    creationDate: '0101',
    tags: ['test']
  };

  const searchModelMock = {
    countOfResults: 2,
    ecoNews: [mockNewsData],
    events: [mockEventsData],
    tipsAndTricks: [mockTipData]
  };

  const searchMock: SearchService = jasmine.createSpyObj('SearchService', ['getAllResults']);
  searchMock.searchSubject = new Subject();
  searchMock.getAllResults = () => of(searchModelMock);
  searchMock.closeSearchSignal = () => true;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SearchPopupComponent, SearchItemComponent, SearchNotFoundComponent],
      imports: [
        RouterTestingModule,
        TranslateModule.forRoot(),
        ReactiveFormsModule,
        HttpClientTestingModule,
        MatDialogModule,
        NgxPageScrollModule,
        MatSnackBarModule,
        BrowserAnimationsModule,
        SharedModule
      ],
      providers: [
        { provide: SearchService, useValue: searchMock },
        MatSnackBarComponent,
        { provide: MatSnackBar, useValue: matSnackBarMock },
        { provide: LocalStorageService, useValue: localStorageServiceMock }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents()
      .then((r) => r);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create SearchPopupComponent', () => {
    expect(component).toBeTruthy();
  });

  describe('General methods', () => {
    it(`ngOnInit should init setupInitialValue method`, () => {
      const spy = spyOn(component as any, 'setupInitialValue');
      component.ngOnInit();
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should call openErrorPopup', () => {
      spyOn(component.dialog, 'open');
      component.openErrorPopup();
      expect(component.dialog).toBeDefined();
    });
  });

  describe('Testing services:', () => {
    it('should handle search value changes', fakeAsync(() => {
      const getSearchSpy = spyOn(component.searchService, 'getAllResults').and.returnValue(of(searchModelMock));
      component.ngOnInit();

      component.searchInput.setValue('test');
      tick(300);
      expect(getSearchSpy).toHaveBeenCalledWith('test', 'econews', 'ua');
    }));

    it('should call resetData', () => {
      const resetDataSpy = spyOn(component as any, 'resetData');
      component.ngOnInit();

      component.searchInput.setValue('', { emitEvent: true });
      expect(resetDataSpy).toHaveBeenCalled();
    });

    it('closeSearch should open SearchService/closeSearchSignal', () => {
      const spy = spyOn(component.searchService, 'closeSearchSignal');
      component.closeSearch();
      expect(spy).toHaveBeenCalled();
    });

    it('should setup Initial Value', () => {
      const subscribeToSignalSpy = spyOn(component as any, 'subscribeToSignal');
      component.setupInitialValue();
      component.searchService.searchSubject.next(true);
      expect(subscribeToSignalSpy).toHaveBeenCalledWith(true);
    });

    it('should reset input value', () => {
      component.setupInitialValue();
      component.searchInput.setValue('test', { emitEvent: false });
      component.searchService.searchSubject.next(false);
      expect(component.searchInput.value).toBe('');
    });
  });
});
