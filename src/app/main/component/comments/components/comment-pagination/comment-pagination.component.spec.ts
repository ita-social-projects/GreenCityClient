import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NgxPaginationModule } from 'ngx-pagination';

import { CommentPaginationComponent } from './comment-pagination.component';

describe('CommentPaginationComponent', () => {
  let component: CommentPaginationComponent;
  let fixture: ComponentFixture<CommentPaginationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CommentPaginationComponent],
      imports: [NgxPaginationModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentPaginationComponent);
    component = fixture.componentInstance;
    component.config = {
      id: 'string',
      itemsPerPage: 1,
      currentPage: 1,
      totalItems: 1
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit event on page change', () => {
    const spy = spyOn(component.setPage, 'emit');
    component.onPageChange(1);
    expect(spy).toHaveBeenCalled();
  });
});
