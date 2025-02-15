import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { CUSTOM_ELEMENTS_SCHEMA, Renderer2 } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CommentsListComponent } from './comments-list.component';
import { CommentsService } from '../../services/comments.service';
import { of } from 'rxjs';
import { DateLocalisationPipe } from '@pipe/date-localisation-pipe/date-localisation.pipe';
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
    showRelyButton: true
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

  it('поверни створеного компонента', () => {
    expect(component).toBeTruthy();
  });

  it('ініціалізує всі необхідні властивості', () => {
    expect(component.types).toBeDefined();
    expect(component.content).toBeDefined();
    expect(component.content instanceof FormControl).toBeTrue();
    expect(component.content.errors).toEqual({ required: true });
    expect(component['commentHtml']).toBe('');
  });

  it('викликає подію changedList при видаленні коментаря', () => {
    const emitSpy = spyOn(component.changedList, 'emit');
    // Створюємо обʼєкт типу AddedCommentDTO із всіма необхідними властивостями
    const addedComment: AddedCommentDTO = {
      author: { id: 1, name: 'Test', profilePicturePath: null },
      id: 1,
      modifiedDate: '111',
      text: 'string'
    };
    component.deleteComment(addedComment);
    expect(emitSpy).toHaveBeenCalledWith(addedComment);
  });

  it('повертає true для редагованого коментаря', () => {
    expect(component.isCommentEdited(commentData)).toBeTrue();
  });

  it('відправляє дані при збереженні редагованого коментаря', () => {
    const updatedText = 'Updated comment text';
    component.content.setValue(updatedText);
    component['commentHtml'] = updatedText;

    const editSpy = spyOn((component as any).commentsService, 'editComment').and.returnValue(of());
    component.saveEditedComment(commentData);

    expect(editSpy).toHaveBeenCalledWith(commentData.id, updatedText);
    expect(commentData.text).toEqual(updatedText);
    expect(commentData.status).toEqual('EDITED');
  });

  it('скасовує режим редагування, якщо користувач підтверджує скасування', () => {
    component.cancelEditedComment(commentData);
    expect(commentData.isEdit).toBeFalse();
  });

  it('залишає режим редагування, якщо користувач відмовляється від скасування', () => {
    spyOn((component as any).dialog, 'open').and.returnValue({
      afterClosed: () => of(false)
    } as any);
    commentData.isEdit = true;
    component.cancelEditedComment(commentData);
    expect(commentData.isEdit).toBeTrue();
  });

  it('змінює лічильник (наприклад, лайки) для вибраного коментаря', () => {
    component.elementsList = [{ ...commentData }];
    component.changeCounter(1, commentData.id, 'likes');
    const updatedComment = component.elementsList.find((item) => item.id === commentData.id);
    expect(updatedComment?.likes).toEqual(commentData.likes + 1);
  });

  it('оновлює відображення елементів при кліку на кнопку відповіді (reply)', () => {
    const updateSpy = spyOn(component, 'updateContentControl');
    component.elementsList = [{ ...commentData, showRelyButton: false }];
    component.showElements(commentData.id, 'showRelyButton');
    expect(updateSpy).toHaveBeenCalledWith(commentData.id);
    const updatedComment = component.elementsList.find((item) => item.id === commentData.id);
    expect(updatedComment?.showRelyButton).toBeTrue();
  });

  it('оновлює форму для редагування при відповіді на коментар', () => {
    const oldText = 'old value';
    component.content.setValue(oldText);
    component.elementsList = [{ ...commentData }];
    component.showElements(commentData.id, 'showRelyButton');
    expect(component.content.value).toEqual(commentData.text);
    expect(component.isEditTextValid).toBeTrue();
  });

  it('правильно перевіряє, чи є користувач автором коментаря', () => {
    component.userId = 1;
    expect(component.checkCommentAuthor(commentData.author.id)).toBeTrue();
    expect(component.checkCommentAuthor(5)).toBeFalse();
  });

  it('оновлює контент форми через updateContentControl', () => {
    component.elementsList = [{ ...commentData }];
    component.updateContentControl(commentData.id);
    expect(component.content.value).toEqual(commentData.text);
    expect(component.isEditTextValid).toBeTrue();
  });

  it('не змінює прапорець isAddingReply при кліку на showAllRelies', () => {
    component.isAddingReply = false;
    component.elementsList = [{ ...commentData, showAllRelies: false }];
    component.showElements(commentData.id, 'showAllRelies');
    expect(component.isAddingReply).toBeFalse();
  });

  it('змінює прапорець isAddingReply при кліку на showRelyButton', () => {
    component.isAddingReply = false;
    component.elementsList = [{ ...commentData, showRelyButton: false }];
    component.showElements(commentData.id, 'showRelyButton');
    expect(component.isAddingReply).toBeTrue();
  });

  it('перемикає прапорець isAddingReply при повторному кліку на showRelyButton', () => {
    component.isAddingReply = false;
    component.elementsList = [{ ...commentData, showRelyButton: false }];
    component.showElements(commentData.id, 'showRelyButton');
    expect(component.isAddingReply).toBeTrue();
    component.showElements(commentData.id, 'showRelyButton');
    expect(component.isAddingReply).toBeFalse();
  });

  it('викликає метод updateContentControl під час обробки showElements', () => {
    const updateSpy = spyOn(component, 'updateContentControl');
    component.elementsList = [{ ...commentData }];
    component.showElements(commentData.id, 'showRelyButton');
    expect(updateSpy).toHaveBeenCalledWith(commentData.id);
  });
});
