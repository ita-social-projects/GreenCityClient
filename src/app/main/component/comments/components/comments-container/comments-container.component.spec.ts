import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { RouterModule } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
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
});
