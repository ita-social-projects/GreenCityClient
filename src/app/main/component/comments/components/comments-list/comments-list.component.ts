import { Component, EventEmitter, Input, Output, Renderer2 } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { CommentsService } from '../../services/comments.service';
import { CommentsDTO, dataTypes, PaginationConfig } from '../../models/comments-model';
import { take } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { WarningPopUpComponent } from '@shared/components';

@Component({
  selector: 'app-comments-list',
  templateUrl: './comments-list.component.html',
  styleUrls: ['./comments-list.component.scss']
})
export class CommentsListComponent {
  @Input() public entityId: number;
  @Input() public elementsList: CommentsDTO[] = [];
  @Input() public dataType: string;
  @Input() public commentId: number;
  @Input() public config: PaginationConfig;
  @Input() public isLoggedIn: boolean;
  @Input() public userId: number;
  @Output() public changedList = new EventEmitter<number>();
  public types = dataTypes;
  public commentMaxLength = 8000;
  public content: FormControl = new FormControl('', [Validators.required, Validators.maxLength(this.commentMaxLength)]);
  private commentHtml = '';
  public editIcon = 'assets/img/comments/edit.png';
  public cancelIcon = 'assets/img/comments/cancel-comment-edit.png';
  public likeImg = 'assets/img/comments/like.png';
  public isEditTextValid: boolean;
  private confirmDialogConfig = {
    hasBackdrop: true,
    closeOnNavigation: true,
    disableClose: true,
    panelClass: 'popup-dialog-container',
    data: {
      popupTitle: `homepage.eco-news.comment.comment-popup-cancel-edit.title`,
      popupConfirm: `homepage.eco-news.comment.comment-popup-cancel-edit.confirm`,
      popupCancel: `homepage.eco-news.comment.comment-popup-cancel-edit.cancel`
    }
  };

  constructor(
    private commentsService: CommentsService,
    private renderer: Renderer2,
    private router: Router,
    private dialog: MatDialog
  ) {}

  public deleteComment($event): void {
    this.changedList.emit($event);
  }

  public isCommentEdited(element: CommentsDTO): boolean {
    return element.status === 'EDITED';
  }

  public saveEditedComment(element: CommentsDTO): void {
    this.commentsService
      .editComment(element.id, this.commentHtml)
      .pipe(take(1))
      .subscribe(() => this.content.reset());

    element.isEdit = false;
    element.text = this.commentHtml;
    element.status = 'EDITED';
    element.modifiedDate = String(Date.now());
  }

  public cancelEditedComment(element: CommentsDTO): void {
    const dialogRef = this.dialog.open(WarningPopUpComponent, this.confirmDialogConfig);
    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((confirm) => {
        if (confirm) {
          element.isEdit = false;
        }
      });
  }

  public changeCounter(counter: number, id: number, key: string): void {
    this.elementsList = this.elementsList.map((item) => {
      if (item.id === id) {
        item[key] = counter;
      }
      return item;
    });
  }

  public onCommentClick(event: MouseEvent): void {
    const userId = (event.target as HTMLElement).getAttribute('data-userid');
    const userName = (event.target as HTMLElement).textContent;
    if (userId) {
      this.router.navigate(['profile', this.userId, 'users', userName, userId]);
    }
  }

  public showElements(id: number, key: 'isEdit' | 'showAllRelies' | 'showRelyButton'): void {
    if (key !== 'showAllRelies') {
      this.updateContentControl(id);
    }
    this.elementsList = this.elementsList.map((item) => {
      item[key] = item.id === id && !item[key];
      return item;
    });
  }

  public updateContentControl(id: number): void {
    const commentContent = this.elementsList.filter((el) => el.id === id)[0].text;
    this.content.setValue(commentContent);
    this.isEditTextValid = true;
  }

  public isShowReplies(id: number): boolean {
    for (const item of this.elementsList) {
      if (item.id === id && item.showAllRelies) {
        return item.showAllRelies;
      }
    }
    return false;
  }

  public checkCommentAuthor(commentAuthorId: number) {
    return commentAuthorId === Number(this.userId);
  }

  setCommentText(data: { text: string; innerHTML: string }): void {
    this.content.setValue(data.text);
    this.commentHtml = data.innerHTML;
    this.isEditTextValid = !!this.content.value.trim().length && this.content.value.length <= this.commentMaxLength;
  }
}
