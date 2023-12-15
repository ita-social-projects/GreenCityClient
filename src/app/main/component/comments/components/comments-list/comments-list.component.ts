import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UntypedFormControl, Validators } from '@angular/forms';
import { CommentsService } from '../../services/comments.service';
import { CommentsDTO, dataTypes, PaginationConfig } from '../../models/comments-model';
import { take } from 'rxjs/operators';

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
  @Output() public changedList = new EventEmitter();
  public types = dataTypes;
  public content: UntypedFormControl = new UntypedFormControl('', [Validators.required, Validators.maxLength(8000)]);
  public editIcon = 'assets/img/comments/edit.png';
  public cancelIcon = 'assets/img/comments/cancel-comment-edit.png';
  public likeImg = 'assets/img/comments/like.png';
  public isEditTextValid: boolean;
  public commentMaxLength = 8000;

  constructor(private commentsService: CommentsService) {}

  public deleteComment(): void {
    this.changedList.emit();
  }

  public isCommentEdited(element: CommentsDTO): boolean {
    return element.status === 'EDITED';
  }

  public saveEditedComment(element: CommentsDTO): void {
    this.commentsService
      .editComment(element.id, this.content.value)
      .pipe(take(1))
      .subscribe(() => this.content.reset());

    element.isEdit = false;
    element.text = this.content.value;
    element.status = 'EDITED';
    element.modifiedDate = String(Date.now());
  }

  public cancelEditedComment(element: CommentsDTO): void {
    element.isEdit = false;
  }

  public changeCounter(counter: number, id: number, key: string): void {
    this.elementsList = this.elementsList.map((item) => {
      if (item.id === id) {
        item[key] = counter;
      }
      return item;
    });
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

  checkTextarea(event: InputEvent): void {
    this.content.setValue((event.target as HTMLInputElement).value);
    this.isEditTextValid = !!this.content.value.trim().length && this.content.value.length <= this.commentMaxLength;
  }
}
