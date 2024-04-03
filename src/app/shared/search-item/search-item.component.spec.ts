import { RouterTestingModule } from '@angular/router/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SearchItemComponent } from './search-item.component';

describe('SearchItemComponent', () => {
  let component: SearchItemComponent;
  let fixture: ComponentFixture<SearchItemComponent>;
  const searchModelMock = {
    id: 1,
    title: 'test',
    author: {
      id: 1,
      name: 'string'
    },
    creationDate: '1000',
    tags: ['tag'],
    text: 'test'
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SearchItemComponent],
      imports: [RouterTestingModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchItemComponent);
    component = fixture.componentInstance;
    component.searchModel = searchModelMock;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
