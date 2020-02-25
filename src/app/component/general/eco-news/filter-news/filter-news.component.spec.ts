import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterNewsComponent } from './filter-news.component';

describe('FilterNewsComponent', () => {
  let component: FilterNewsComponent;
  let fixture: ComponentFixture<FilterNewsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterNewsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterNewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
