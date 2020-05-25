import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchNotFoundComponent } from './search-not-found.component';

describe('SearchNotFoundComponent', () => {
  let component: SearchNotFoundComponent;
  let fixture: ComponentFixture<SearchNotFoundComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchNotFoundComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchNotFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
