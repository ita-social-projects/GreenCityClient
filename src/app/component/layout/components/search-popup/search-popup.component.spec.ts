import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';


import { SearchPopupComponent } from './search-popup.component';
import {RouterTestingModule} from '@angular/router/testing';
import {SearchItemComponent} from './search-item/search-item.component';
import {SearchNotFoundComponent} from './search-not-found/search-not-found.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {MatDialogModule} from '@angular/material/dialog';
import {NgxPageScrollModule} from 'ngx-page-scroll';

fdescribe('SearchPopupComponent', () => {
  let component: SearchPopupComponent;
  let fixture: ComponentFixture<SearchPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        SearchPopupComponent,
        SearchItemComponent,
        SearchNotFoundComponent,
      ],
      imports: [
        RouterTestingModule,
        TranslateModule.forRoot(),
        HttpClientTestingModule,
        MatDialogModule,
        NgxPageScrollModule,
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create SearchPopupComponent', () => {
    expect(component).toBeTruthy();
  });
  describe('General methods', );
});
