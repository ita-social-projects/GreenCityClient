import { WarningPopUpComponent } from '../../../shared/components/warning-pop-up/warning-pop-up.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';

import { DeleteCommentComponent } from './delete-comment.component';
import { of } from 'rxjs';
import { CommentsService } from '../../services/comments.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

class MatDialogMock {
  open() {
    return {
      afterClosed: () => of(true)
    };
  }
}

describe('DeleteCommentComponent', () => {
  let component: DeleteCommentComponent;
  let fixture: ComponentFixture<DeleteCommentComponent>;

  let commentsServiceMock: CommentsService;
  commentsServiceMock = jasmine.createSpyObj('CommentsService', ['deleteComments']);
  commentsServiceMock.deleteComments = () => of(true);

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DeleteCommentComponent, WarningPopUpComponent],
      imports: [TranslateModule.forRoot(), HttpClientTestingModule, MatDialogModule, BrowserAnimationsModule],
      providers: [
        { provide: MatDialog, useClass: MatDialogMock },
        { provide: CommentsService, useValue: commentsServiceMock }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.element = {
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
      status: 'string',
      text: 'string'
    };
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit event on click Yes button', fakeAsync(() => {
    const spy = spyOn(component.elementsList, 'emit');
    component.openPopup();
    tick(1);
    expect(spy).toHaveBeenCalled();
  }));
});
