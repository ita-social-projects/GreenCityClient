import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CommentsListComponent } from './comments-list.component';
import { CommentsService } from '../../services/comments.service';
import { of } from 'rxjs';
import { DateLocalisationPipe } from '@pipe/date-localisation-pipe/date-localisation.pipe';
import { By } from '@angular/platform-browser';

describe('CommentsListComponent', () => {
  let component: CommentsListComponent;
  let fixture: ComponentFixture<CommentsListComponent>;

  let commentsServiceMock: CommentsService;
  commentsServiceMock = jasmine.createSpyObj('CommentsService', ['editComment']);
  commentsServiceMock.editComment = () => of();

  const commentData = {
    author: {
      id: 1,
      name: 'Test',
      userProfilePicturePath: null
    },
    currentUserLiked: true,
    id: 1,
    likes: 0,
    modifiedDate: '111',
    replies: 1,
    status: 'EDITED',
    text: 'string',
    isEdit: true,
    showRelyButton: true
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CommentsListComponent, DateLocalisationPipe],
      imports: [HttpClientTestingModule, NgxPaginationModule, ReactiveFormsModule, TranslateModule.forRoot()],
      providers: [{ provide: CommentsService, useValue: commentsServiceMock }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentsListComponent);
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

  it('should emit event when user delete comment', () => {
    const spy = spyOn(component.changedList, 'emit');
    component.deleteComment();
    expect(spy).toHaveBeenCalled();
  });

  it('should return comments status', () => {
    expect(component.isCommentEdited(commentData)).toBeTruthy();
  });

  it('should send data when user save edited content', () => {
    component.content.setValue('some test text');
    // @ts-ignore
    const spy = spyOn(component.commentsService, 'editComment').and.returnValue(of());
    component.saveEditedComment(commentData);
    expect(spy).toHaveBeenCalled();
  });

  it('should cancel edit comment', () => {
    component.cancelEditedComment(commentData);
    expect(commentData.isEdit).toBeFalsy();
  });

  it('should change counter if user clicks like', () => {
    const spy = spyOn(component.elementsList, 'map').and.returnValues([commentData]);
    component.changeCounter(1, commentData.id, 'likes');
    fixture.debugElement.triggerEventHandler('click', commentData.likes++);
    expect(spy).toHaveBeenCalled();
    expect(commentData.likes).toBe(1);
  });

  it('should show page elements if user clicks reply', () => {
    const spyMap = spyOn(component.elementsList, 'map').and.returnValue([commentData]);
    const spyFilter = spyOn(component.elementsList, 'filter').and.returnValue([commentData]);
    const spyUpdateControl = spyOn(component, 'updateContentControl');
    component.showElements(1, 'showRelyButton');
    expect(spyMap).toHaveBeenCalled();
    expect(spyUpdateControl).toHaveBeenCalledWith(1);
    expect(spyMap.length).toBe(1);
  });

  it('should update content form controls when user reply', () => {
    component.content.setValue('old value');
    const spyFilter = spyOn(component.elementsList, 'filter').and.returnValue([commentData]);
    component.showElements(1, 'showRelyButton');
    expect(component.content.value).toBe(commentData.text);
    expect(component.isEditTextValid).toBeTruthy();
  });

  it('should check is current user an author', () => {
    const userId = 1;
    component.checkCommentAuthor(commentData.author.id);
    expect(commentData.author.id).toEqual(userId);
  });

  it('should check textarea length', () => {
    const spyFilter = spyOn(component.elementsList, 'filter').and.returnValue([commentData]);
    component.updateContentControl(1);
    expect(component.content.value).toBe(commentData.text);
    expect(component.isEditTextValid).toBeTruthy();
  });
});
