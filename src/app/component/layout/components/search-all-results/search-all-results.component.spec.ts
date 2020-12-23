import { SharedModule } from '@shared/shared.module';
import { SearchNotFoundComponent } from './../search-not-found/search-not-found.component';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { SearchAllResultsComponent } from './search-all-results.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SearchService } from '@global-service/search/search.service';
import { SearchItemComponent } from '..';
import { of, Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

fdescribe('SearchAllResultsComponent', () => {
  let component: SearchAllResultsComponent;
  let fixture: ComponentFixture<SearchAllResultsComponent>;

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
      name: 'test',
    },
    creationDate: '0101',
    tags: ['test']
  };

  const searchModelMock = {
    countOfResults: 2,
    ecoNews: [ mockNewsData ],
    tipsAndTricks: [ mockTipData ]
  };

  let searchMock: SearchService;
  searchMock = jasmine.createSpyObj('SearchService', ['getAllResults']);
  searchMock.searchSubject = new Subject();
  searchMock.getAllResults = () => of(searchModelMock);
  searchMock.getAllResultsByCat = () => of(searchModelMock);
  searchMock.closeSearchSignal = () => true;

  let mockRouter = {
    navigate: jasmine.createSpy('navigate')
  }  

  let snackBarMock: MatSnackBar;
  snackBarMock = jasmine.createSpyObj('MatSnackBar', ['open']);

  const activatedRouteMock = {
    queryParams: of({
      query: 'test',
    }),
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        SearchAllResultsComponent,
        SearchItemComponent,
        SearchNotFoundComponent,
      ],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        FormsModule,
        InfiniteScrollModule,
        MatSnackBarModule,
        TranslateModule.forRoot(),
        SharedModule
      ],
      providers: [
        { provide: MatSnackBar, useValue: snackBarMock },
        { provide: SearchService, useValue: searchMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchAllResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create SearchAllResultsComponent', () => {
    expect(component).toBeTruthy();
  });

  describe('test main functionality', () =>{
    it('should update page', () => {
      component.currentPage = 0;
      // @ts-ignore
      component.changeCurrentPage();

      expect(component.currentPage).toBe(1)
    });

    it('should force fetch data if heigth of body less that document', () => {
      // @ts-ignore
      spyOn(document.documentElement, 'clientHeight').and.returnValue(200);
      // @ts-ignore
      spyOn(document.body, 'clientHeight').and.returnValue(100);
      const spy = spyOn(component, 'onScroll').and.returnValue();
      // @ts-ignore
      component.forceScroll();
      
      expect(spy).toHaveBeenCalled();
    });

    it('should update url query part', inject([Router], (mockRouter: Router) => {
      component.inputValue = 'test';
      component.searchCategory = 'tetCat';
      spyOn(mockRouter, 'navigate').and.returnValue(new Promise(function(res){return res(true)}));
      // @ts-ignore
      component.onSearchUpdateQuery();
      expect(mockRouter.navigate).toHaveBeenCalled();
    }));

  });
});
