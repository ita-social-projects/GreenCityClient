import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { SearchAllResultsComponent } from './search-all-results.component';
import { ItemComponent } from './item/item.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SearchService } from '@global-service/search/search.service';

describe('SearchAllResultsComponent', () => {
  let component: SearchAllResultsComponent;
  let fixture: ComponentFixture<SearchAllResultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        SearchAllResultsComponent,
        ItemComponent
      ],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        FormsModule,
        InfiniteScrollModule,
        MatSnackBarModule,
        TranslateModule.forRoot()
      ],
      providers: [
        SearchService,
        MatSnackBar
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
});
