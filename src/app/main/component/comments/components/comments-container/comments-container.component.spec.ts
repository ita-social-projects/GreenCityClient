import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { RouterModule } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA, SimpleChange } from '@angular/core';
import { CommentsService } from '../../services/comments.service';
import { UserOwnAuthService } from '@auth-service/user-own-auth.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { CommentsContainerComponent } from './comments-container.component';
import { CommentsModel } from '../../models/comments-model';
import { of } from 'rxjs';

describe('CommentsContainerComponent', () => {
  let component: CommentsContainerComponent;
  let fixture: ComponentFixture<CommentsContainerComponent>;

  const CommentsServiceMock = {
    getActiveCommentsByPage: () => of({ page: [] }),
    getCommentsCount: () => of({})
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CommentsContainerComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        ReactiveFormsModule,
        NgxPaginationModule,
        RouterModule,
        TranslateModule.forRoot()
      ],
      providers: [{ provide: CommentsService, useValue: CommentsServiceMock }, UserOwnAuthService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentsContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should setData', () => {
    component.setData(2, 20);
    expect(component.config.currentPage).toBe(2);
    expect(component.config.totalItems).toBe(20);
  });

  it('should setCommentsList', () => {
    const commentsModel = {
      currentPage: 1,
      page: [],
      totalElements: 10
    } as CommentsModel;
    component.setCommentsList(commentsModel);
    component.updateElementsList();
    expect(component.elementsList.length).toBe(0);
    expect(component.elementsArePresent).toBeFalsy();
  });

  it('should reset userReplies when showAllRelies changes', () => {
    component.comment = { showAllRelies: true } as any;
    component.userReplies = [{ id: 1 }];

    component.ngOnChanges({
      comment: {
        currentValue: { showAllRelies: false },
        previousValue: { showAllRelies: true },
        isFirstChange: () => false
      } as SimpleChange
    });
    expect(component.userReplies).toEqual([]);
  });

  it('should not reset userReplies if not press hide replies', () => {
    component.comment = { showAllRelies: true } as any;
    component.userReplies = [{ id: 1 }];

    component.ngOnChanges({
      comment: {
        currentValue: { showAllRelies: false },
        previousValue: { showAllRelies: false },
        isFirstChange: () => false
      } as SimpleChange
    });
    expect(component.userReplies.length).toEqual(1);
  });

  it('should update userReplies when calling updateElementsListReply', () => {
    component.comment = { id: 1 } as any;
    component.userReplies = [{ id: 2 }];

    const addedComment: any = { id: 3, text: 'New reply' };
    component.updateElementsListReply(addedComment);

    expect(component.userReplies.length).toBe(2);
    expect(component.userReplies[0].id).toBe(3, 'newer replies should be at top');
    expect(component.userReplies[1].id).toBe(2);
    expect(component.userReplies[0].text).toBe('New reply');
  });
});
