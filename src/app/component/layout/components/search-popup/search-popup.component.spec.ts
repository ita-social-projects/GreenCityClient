import { MatSnackBarComponent } from '@global-errors/mat-snack-bar/mat-snack-bar.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { MatSnackBarModule } from '@angular/material';
import { SearchPopupComponent } from './search-popup.component';
import { RouterTestingModule } from '@angular/router/testing';
import { SearchItemComponent } from './search-item/search-item.component';
import { SearchNotFoundComponent } from './search-not-found/search-not-found.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { SearchService } from '@global-service/search/search.service';
import { SearchModel } from '@global-models/search/search.model';
import { NewsSearchModel } from '@global-models/search/newsSearch.model';
import { Observable } from 'rxjs';
import { NgxPageScrollModule } from 'ngx-page-scroll';
import { ReactiveFormsModule } from '@angular/forms';

describe('SearchPopupComponent', () => {
  let component: SearchPopupComponent;
  let fixture: ComponentFixture<SearchPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        SearchPopupComponent,
        SearchItemComponent,
        SearchNotFoundComponent
      ],
      imports: [
        RouterTestingModule,
        TranslateModule.forRoot(),
        ReactiveFormsModule,
        HttpClientTestingModule,
        MatDialogModule,
        NgxPageScrollModule,
        MatSnackBarModule
      ],
      providers: [
        SearchService, MatSnackBarComponent
      ]
    })
      .compileComponents().then(r => r);
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
    let searchService: SearchService;
    let mockDataSearchModel: SearchModel;
    let mockNewsSearchModel: NewsSearchModel;

    beforeEach(() => {
      searchService = fixture.debugElement.injector.get(SearchService);

      mockDataSearchModel = {
        countOfResults: 4,
        ecoNews: [mockNewsSearchModel],
        tipsAndTricks: [mockNewsSearchModel]
   };

      mockNewsSearchModel = {
     id: 10,
      title: 'taras',
      author: {
        id: 20,
        name: 'Ivan',
      },
      creationDate: 'data-time',
      tags: ['news'],
   };
    });

    it('should handle search value changes', () => {
      const getSearchSpy = spyOn(searchService, 'getSearch').and.returnValue(Observable.of(mockDataSearchModel));
      component.ngOnInit();

      component.searchInput.setValue('test', { emitEvent: true });
      expect(getSearchSpy).toHaveBeenCalledWith('test');
    });

    it('should call resetData', () => {
      const resetDataSpy = spyOn(component as any, 'resetData');
      component.ngOnInit();

      component.searchInput.setValue('', { emitEvent: true });
      expect(resetDataSpy).toHaveBeenCalled();
    });

    it('closeSearch should open SearchService/closeSearchSignal', () => {
    const spy = spyOn(searchService, 'closeSearchSignal');
    component.closeSearch();
    expect(spy).toHaveBeenCalled();
     });

    it('should setup Initial Value', () => {
      const subscribeToSignalSpy = spyOn(component as any, 'subscribeToSignal');
      component.search.searchSubject.next(true);
      expect(subscribeToSignalSpy).toHaveBeenCalledWith(true);
    });
  });
});
