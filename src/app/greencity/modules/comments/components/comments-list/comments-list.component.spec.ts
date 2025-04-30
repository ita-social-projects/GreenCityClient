import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { CUSTOM_ELEMENTS_SCHEMA, Renderer2 } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CommentsListComponent } from './comments-list.component';
import { CommentsService } from '../../services/comments.service';
import { of } from 'rxjs';
import { DateLocalisationPipe } from '@shared/pipes/date-localisation-pipe/date-localisation.pipe';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { WarningPopUpComponent } from '@shared/components';
import { AddedCommentDTO } from '../../models/comments-model';
import { MatSnackBarModule } from '@angular/material/snack-bar';

describe('CommentsListComponent', () => {
  let component: CommentsListComponent;
  let fixture: ComponentFixture<CommentsListComponent>;

  const commentsServiceMock: any = {
    editComment: jasmine.createSpy('editComment').and.returnValue(of()),
    getActiveRepliesByPage: jasmine.createSpy('getActiveRepliesByPage').and.returnValue(
      of({
        currentPage: 1,
        page: [
          {
            author: { id: 1, name: 'Test', profilePicturePath: null },
            currentUserLiked: false,
            id: 1,
            likes: 5,
            modifiedDate: '2022-01-01',
            replies: 2,
            status: 'ACTIVE',
            text: 'Test reply',
            showAllRelies: true
          }
        ],
        totalElements: 1
      })
    )
  };
  commentsServiceMock.editComment = () => of();

  const matDialogMock = {
    open: () => ({
      afterClosed: () => of(true)
    })
  };

  const matDialogRefMock = jasmine.createSpyObj('MatDialogRef', ['close', 'afterClosed']);
  matDialogRefMock.afterClosed.and.returnValue(of(true));

  const routerMock = jasmine.createSpyObj('Router', ['navigate']);

  const commentData = {
    author: {
      id: 1,
      name: 'Test',
      profilePicturePath: null
    },
    currentUserLiked: true,
    id: 1,
    likes: 0,
    modifiedDate: '111',
    replies: 1,
    status: 'EDITED',
    text: 'string',
    isEdit: true,
    showRelyButton: true,
    isLiked: false,
    isDisliked: false
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CommentsListComponent, DateLocalisationPipe],
      imports: [
        HttpClientTestingModule,
        NgxPaginationModule,
        ReactiveFormsModule,
        TranslateModule.forRoot(),
        RouterTestingModule,
        MatSnackBarModule
      ],
      providers: [
        { provide: CommentsService, useValue: commentsServiceMock },
        { provide: Renderer2, useValue: {} },
        { provide: MatDialog, useValue: matDialogMock },
        { provide: MatDialogRef, useValue: matDialogRefMock },
        { provide: Router, useValue: routerMock }
      ],
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

  it('return the created componennt', () => {
    expect(component).toBeTruthy();
  });

  it('inititilez preperties', () => {
    expect(component.types).toBeDefined();
    expect(component.content).toBeDefined();
    expect(component.content instanceof FormControl).toBeTrue();
    expect(component.content.errors).toEqual({ required: true });
    expect(component['commentHtml']).toBe('');
  });

  it('calls event  changedList on comment delete', () => {
    const emitSpy = spyOn(component.changedList, 'emit');
    const addedComment: AddedCommentDTO = {
      author: { id: 1, name: 'Test', profilePicturePath: null },
      id: 1,
      modifiedDate: '111',
      text: 'string'
    };
    component.deleteComment(addedComment);
    expect(emitSpy).toHaveBeenCalledWith(addedComment);
  });

  it('return the comment', () => {
    expect(component.isCommentEdited(commentData)).toBeTrue();
  });

  it('sends data on edited comment sending', () => {
    const updatedText = 'Updated comment text';
    component.content.setValue(updatedText);
    component['commentHtml'] = updatedText;

    const editSpy = spyOn((component as any).commentsService, 'editComment').and.returnValue(of());
    component.saveEditedComment(commentData);

    expect(editSpy).toHaveBeenCalledWith(commentData.id, updatedText);
    expect(commentData.text).toEqual(updatedText);
    expect(commentData.status).toEqual('EDITED');
  });

  it(' cancels the edit mode, if the user confirms the cancelling', () => {
    component.cancelEditedComment(commentData);
    expect(commentData.isEdit).toBeFalse();
  });

  it('leaves the edit mode if the user cancels the cancel', () => {
    spyOn((component as any).dialog, 'open').and.returnValue({
      afterClosed: () => of(false)
    } as any);
    commentData.isEdit = true;
    component.cancelEditedComment(commentData);
    expect(commentData.isEdit).toBeTrue();
  });

  it('changes the counter (likes(e.g.)) for the chosen comment', () => {
    component.elementsList = [{ ...commentData }];
    component.changeCounter(1, commentData.id, 'likes');
    const updatedComment = component.elementsList.find((item) => item.id === commentData.id);
    expect(updatedComment?.likes).toEqual(commentData.likes + 1);
  });

  it('renews the displaying elements on the reply button click', () => {
    const updateSpy = spyOn(component, 'updateContentControl');
    component.elementsList = [{ ...commentData, showRelyButton: false }];
    component.showElements(commentData.id, 'showRelyButton');
    expect(updateSpy).toHaveBeenCalledWith(commentData.id);
    const updatedComment = component.elementsList.find((item) => item.id === commentData.id);
    expect(updatedComment?.showRelyButton).toBeTrue();
  });

  it('renews the form for editing on the comment replying', () => {
    const oldText = 'old value';
    component.content.setValue(oldText);
    component.elementsList = [{ ...commentData }];
    component.showElements(commentData.id, 'showRelyButton');
    expect(component.content.value).toEqual(commentData.text);
    expect(component.isEditTextValid).toBeTrue();
  });

  it('checks whether the user is the comment author', () => {
    component.userId = 1;
    expect(component.checkCommentAuthor(commentData.author.id)).toBeTrue();
    expect(component.checkCommentAuthor(5)).toBeFalse();
  });

  it('refreshes the form content using the updateContentControl', () => {
    component.elementsList = [{ ...commentData }];
    component.updateContentControl(commentData.id);
    expect(component.content.value).toEqual(commentData.text);
    expect(component.isEditTextValid).toBeTrue();
  });

  it("doesn't change the isAddingReply flag on click", () => {
    component.isAddingReply = false;
    component.elementsList = [{ ...commentData, showAllRelies: false }];
    component.showElements(commentData.id, 'showAllRelies');
    expect(component.isAddingReply).toBeFalse();
  });

  it('changes the isAddingReply flang on the showRelybutton click', () => {
    component.isAddingReply = false;
    component.elementsList = [{ ...commentData, showRelyButton: false }];
    component.showElements(commentData.id, 'showRelyButton');
    expect(component.isAddingReply).toBeTrue();
  });

  it('changes the isAddingReply flag on repeating click on the showRelyButtonChanges', () => {
    component.isAddingReply = false;
    component.elementsList = [{ ...commentData, showRelyButton: false }];
    component.showElements(commentData.id, 'showRelyButton');
    expect(component.isAddingReply).toBeTrue();
    component.showElements(commentData.id, 'showRelyButton');
    expect(component.isAddingReply).toBeFalse();
  });

  it('calls the updateContentControl method processing the showElelents', () => {
    const updateSpy = spyOn(component, 'updateContentControl');
    component.elementsList = [{ ...commentData }];
    component.showElements(commentData.id, 'showRelyButton');
    expect(updateSpy).toHaveBeenCalledWith(commentData.id);
  });
});
