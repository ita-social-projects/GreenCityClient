import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchAllResultsComponent } from './search-all-results.component';

describe('SearchAllResultsComponent', () => {
  let component: SearchAllResultsComponent;
  let fixture: ComponentFixture<SearchAllResultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchAllResultsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchAllResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
