import { SharedMainModule } from '@shared/shared-main.module';
import { SearchNotFoundComponent } from '../search-not-found/search-not-found.component';
import { FormsModule } from '@angular/forms';
import { ComponentFixture, inject, TestBed, waitForAsync } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { SearchAllResultsComponent } from './search-all-results.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SearchService } from '@global-service/search/search.service';
import { SearchItemComponent } from '../../main/component/layout/components';
import { of, Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('SearchAllResultsComponent', () => {
  let component: SearchAllResultsComponent;
  let fixture: ComponentFixture<SearchAllResultsComponent>;

  const mockNewsData = {
    id: 1,
    title: 'test',
    author: {
      id: 1,
      name: 'test'
    },
    creationDate: '0101',
    tags: ['test'],
    text: 'test'
  };

  const searchDataMock = {
    currentPage: 1,
    page: [mockNewsData],
    totalElements: 1,
    totalPages: 1
  };

  const searchMock: SearchService = jasmine.createSpyObj('SearchService', ['getAllResults']);
  searchMock.searchSubject = new Subject();
  searchMock.getAllResultsByCat = () => of(searchDataMock);
  searchMock.closeSearchSignal = () => true;

  const activatedRouteMock = {
    queryParams: of({
      query: 'test'
    })
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SearchAllResultsComponent, SearchItemComponent, SearchNotFoundComponent],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        FormsModule,
        InfiniteScrollModule,
        TranslateModule.forRoot(),
        SharedMainModule,
        SharedModule
      ],
      providers: [
        { provide: SearchService, useValue: searchMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchAllResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create SearchAllResultsComponent', () => {
    expect(component).toBeTruthy();
  });

  describe('test main functionality', () => {
    // it('should force fetch data if heigth of body less that document', () => {
    //   // @ts-ignore
    //   spyOn(document.documentElement, 'clientHeight').and.returnValue(200);
    //   // @ts-ignore
    //   spyOn(document.body, 'clientHeight').and.returnValue(100);
    //   const spy = spyOn(component, 'onScroll');
    //   // @ts-ignore
    //   component.forceScroll();

    //   expect(spy).toHaveBeenCalled();
    // });

    it('should update url query part', inject([Router], (mockRouter: Router) => {
      component.inputValue = 'test';
      component.searchCategory = 'tetCat';
      spyOn(mockRouter, 'navigate').and.returnValue(new Promise((res) => res(true)));

      (component as any).onSearchUpdateQuery();
      expect(mockRouter.navigate).toHaveBeenCalled();
    }));

    it('should toogle dropdown', () => {
      component.itemsFound = 1;
      component.displayedElements = [mockNewsData];

      (component as any).resetData();
      expect(component.itemsFound).toBe(0);
      expect(component.displayedElements).toEqual([]);
    });

    it('should change current sorting to desc', () => {
      component.changeCurrentSorting(1);
      expect(component.sortType).toBe('desc');
    });

    it('should change current sorting to default', () => {
      component.changeCurrentSorting(0);
      expect(component.sortType).toBe('');
    });

    it('should change current sorting to asc', () => {
      component.changeCurrentSorting(2);
      expect(component.sortType).toBe('asc');
    });

    it('should on update page url if current filter is same', () => {
      component.searchCategory = 'econews';

      const spy = spyOn(component as any, 'onSearchUpdateQuery').and.returnValue(true);
      component.onFilterByClick({ category: 'econews', name: 'news' });
      expect(spy).not.toHaveBeenCalled();
    });
  });
});
