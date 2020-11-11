import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { TranslateModule } from '@ngx-translate/core';
import { SearchAllResultsComponent } from './search-all-results.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SearchService } from '@global-service/search/search.service';
import { SearchModel } from '@global-models/search/search.model';
import { NewsSearchModel } from '@global-models/search/newsSearch.model';
import { Observable } from 'rxjs';
import { NgxPageScrollModule } from 'ngx-page-scroll';

xdescribe('SearchAllResultsComponent', () => {
  let component: SearchAllResultsComponent;
  let fixture: ComponentFixture<SearchAllResultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        SearchAllResultsComponent,
      ],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        NgxPageScrollModule,
      ],
      providers: [
        SearchService
      ]
    })
      .compileComponents().then(r => r);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchAllResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create SearchAllResultsComponent', () => {
    expect(component).toBeTruthy();
  });

  describe('General methods', () => {

    it(`ngOnInit should init getAllElemes method`, () => {
        const spy = spyOn(component as any, 'getAllElemes');
        component.ngOnInit();
        expect(spy).toHaveBeenCalledTimes(1);
      });
  });

  describe('Testing services:', () => {
    let searchService: SearchService;
    let mockDataSearchModel: SearchModel;
    let mockNewsSearchModel: NewsSearchModel;

    beforeEach(() => {
      searchService = fixture.debugElement.injector.get(SearchService);

      mockDataSearchModel = {
        countOfResults: 9,
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

    it('should call resetData', () => {
        const scrollSpy = spyOn(component as any, 'onScroll');
        component.onScroll();
        expect(scrollSpy).toHaveBeenCalledTimes(1);
        expect(component.scroll).toBeTruthy();
        expect(component.isSearchFound).toBeTruthy();
      });

    it('should usubscribe from querySubscription', () => {
      const subscribeToQuerySpy = spyOn(component as any, 'querySubscription.unsubscribe');
      const toggleAllSearchSpy = spyOn(component as any, 'search.toggleAllSearch');
      component.ngOnDestroy();
      expect(subscribeToQuerySpy).toHaveBeenCalledTimes(1);
      expect(toggleAllSearchSpy).toHaveBeenCalledTimes(1);
      expect(toggleAllSearchSpy).toHaveBeenCalledWith(false);
    });
  });
});
