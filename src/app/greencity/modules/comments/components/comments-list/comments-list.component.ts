import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { CommentsService } from '../../services/comments.service';
import { AddedCommentDTO, CommentsDTO, CommentsModel, dataTypes, PaginationConfig } from '../../models/comments-model';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { WarningPopUpComponent } from '@shared/components';
import { JwtService } from '@global-service/jwt/jwt.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize, take } from 'rxjs/operators';
import { ReactionType } from './reaction-type.enum';

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
  @Output() public changedList = new EventEmitter<AddedCommentDTO>();
  private isProcessing = new Set<number>();
  likeImg = 'assets/img/comments/like.png';
  likedImg = 'assets/img/comments/liked.png';
  dislikedImg = 'assets/img/comments/disliked.png';

  types = dataTypes;
  commentMaxLength = 8000;
  content: FormControl = new FormControl('', [Validators.required, Validators.maxLength(this.commentMaxLength)]);
  private commentHtml = '';
  editIcon = 'assets/img/comments/edit.png';
  cancelIcon = 'assets/img/comments/cancel-comment-edit.png';
  isEditTextValid: boolean;
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
  isAddingReply = false;
  repliedComment: {
    comment: CommentsDTO;
    isAdd: boolean;
  } | null = null;
  private isAdmin = this.jwtService.getUserRole() === 'ROLE_ADMIN';
  private isProcessingLike = false;
  private isProcessingDislike = false;

  constructor(
    private commentsService: CommentsService,
    private jwtService: JwtService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  deleteComment($event): void {
    this.changedList.emit($event);
    this.getRepliesAfterDelete($event);
  }

  private getRepliesAfterDelete(commentId: number): void {
    this.commentsService
      .getActiveRepliesByPage(commentId, this.config.currentPage - 1, this.config.itemsPerPage)
      .pipe(take(1))
      .subscribe((list: CommentsModel) => {
        this.elementsList = list.page;
        this.elementsList.forEach((reply) => (reply.showAllRelies = true));
      });
  }

  isCommentEdited(element: CommentsDTO): boolean {
    return element.status === 'EDITED';
  }

  private updateLikeDislikeCount(commentId: number, type: ReactionType, isAdd: boolean): void {
    this.elementsList = this.elementsList.map((comment) => {
      if (comment?.id === commentId) {
        comment[type] = Math.max(0, comment[type] + (isAdd ? 1 : -1));
      }
      return comment;
    });
  }

  private showErrorMessage(message: string): void {
    this.snackBar.open(message, 'Close', { duration: 3000 });
  }

  likeComment(commentId: number): void {
    if (this.isProcessing.has(commentId)) {
      return;
    }
    this.isProcessing.add(commentId);

    const comment = this.elementsList.find((c) => c.id === commentId);
    if (!comment) {
      return;
    }

    const isLiking = !comment.isLiked;
    this.commentsService
      .postLike(commentId)
      .pipe(
        take(1),
        finalize(() => this.isProcessing.delete(commentId))
      )
      .subscribe(
        () => {
          comment.isLiked = isLiking;
          comment.isDisliked = false;
          comment.likes += isLiking ? 1 : -1;
          this.snackBar.open(isLiking ? 'Comment liked' : 'Like removed', 'Close', { duration: 3000 });
        },
        () => this.showErrorMessage('Failed to update like. Please try again.')
      );
  }

  dislikeComment(commentId: number): void {
    if (this.isProcessing.has(commentId)) {
      return;
    }
    this.isProcessing.add(commentId);

    const comment = this.elementsList.find((c) => c.id === commentId);
    if (!comment) {
      return;
    }

    const isDisliking = !comment.isDisliked;
    this.commentsService
      .postDislike(commentId)
      .pipe(
        take(1),
        finalize(() => this.isProcessing.delete(commentId))
      )
      .subscribe(
        () => {
          comment.isDisliked = isDisliking;
          comment.isLiked = false;
          this.snackBar.open(isDisliking ? 'Comment disliked' : 'Dislike removed', 'Close', { duration: 3000 });
        },
        () => this.showErrorMessage('Failed to update dislike. Please try again.')
      );
  }

  saveEditedComment(element: CommentsDTO): void {
    if (!this.commentHtml.trim() || this.commentHtml === element.text) {
      element.isEdit = false;
      this.content.reset();
      return;
    }

    this.commentsService
      .editComment(element.id, this.commentHtml)
      .pipe(take(1))
      .subscribe(() => this.content.reset());

    element.isEdit = false;
    element.text = this.commentHtml;
    element.status = 'EDITED';
    element.modifiedDate = String(Date.now());
  }

  cancelEditedComment(element: CommentsDTO): void {
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

  changeCounter(counter: number, id: number, key: string): void {
    this.elementsList = this.elementsList.map((item) => {
      if (item.id === id) {
        item[key] = counter;
      }
      return item;
    });
  }

  onCommentClick(event: MouseEvent): void {
    const userId = (event.target as HTMLElement).getAttribute('data-userid');
    const userName = (event.target as HTMLElement).textContent;
    if (userId) {
      this.router.navigate(['profile', this.userId, 'users', userName, userId]);
    }
  }

  showElements(id: number, key: 'isEdit' | 'showAllRelies' | 'showRelyButton'): void {
    if (key !== 'showAllRelies') {
      this.updateContentControl(id);
    }

    if (key === 'showRelyButton') {
      this.isAddingReply = !this.isAddingReply;

      this.repliedComment = {
        comment: this.elementsList.find((comment) => comment.id === id),
        isAdd: !this.repliedComment?.isAdd
      };
    }

    this.elementsList = this.elementsList.map((item) => {
      item[key] = item.id === id && !item[key];
      return item;
    });
  }

  updateContentControl(id: number): void {
    const commentContent = this.elementsList.filter((el) => el.id === id)[0].text;
    this.content.setValue(commentContent);
    this.isEditTextValid = true;
  }

  isShowReplies(id: number): boolean {
    for (const item of this.elementsList) {
      if (item.id === id && item.showAllRelies) {
        return item.showAllRelies;
      }
    }
    return false;
  }

  checkCommentAuthor(commentAuthorId: number) {
    return this.isAdmin || commentAuthorId === Number(this.userId);
  }

  setCommentText(data: { text: string; innerHTML: string }): void {
    this.content.setValue(data.text);
    this.commentHtml = data.innerHTML;
    this.isEditTextValid = !!this.content.value.trim().length && this.content.value.length <= this.commentMaxLength;
  }
}
